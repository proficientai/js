import type { Interaction, Message } from '@proficient/api';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextareaAutosize from 'react-textarea-autosize';

import { useApi, useKeyboardEnterEvent } from '../../hooks';
import type { InteractionViewProps } from './types';

const paginationLimit = 20; // TODO: Make dynamic

type InteractionState = {
  input: string;
  interaction: Interaction;
  messages: Message[];
  hasMore: boolean;
};

interface SectionPaginationInfo {
  oldestItemId: string | null;
  /**
   * null: no attempt
   * 0: initial attempt
   * string: the ID of the oldest batch item
   */
  lastAttempt: null | 0 | string;
}

class MultiSectionPaginationMap {
  private readonly map = new Map<string, SectionPaginationInfo>();

  public setLastAttemptFor(sectionId: string, attempt: 0 | string) {
    let sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) {
      sectionInfo = {
        oldestItemId: null,
        lastAttempt: null,
      };
      this.map.set(sectionId, sectionInfo);
    }
    sectionInfo.lastAttempt = attempt;
  }

  public setOldestItemFor(sectionId: string, oldestItemId: string | null) {
    let sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) {
      sectionInfo = {
        oldestItemId: null,
        lastAttempt: null,
      };
      this.map.set(sectionId, sectionInfo);
    }
    sectionInfo.oldestItemId = oldestItemId;
  }

  public lastAttemptFor(sectionId: string) {
    const sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) return null;
    return sectionInfo.lastAttempt;
  }

  public oldestItemFor(sectionId: string) {
    const sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) return null;
    return sectionInfo.oldestItemId;
  }
}

export function AgentView({
  apiKey,
  agentId,
  userExternalId,
  userHmac,
  inputPlaceholder = 'Type something...',
  contentMaxLength = 500,
}: InteractionViewProps) {
  const { getApi } = useApi({ apiKey, userExternalId, userHmac });

  const [interactionStatesById, setInteractionStatesById] = useState<Record<string, InteractionState>>({});
  const [hasMoreInteractions, setHasMoreInteractions] = useState(true);
  const paginationMap = useRef(new MultiSectionPaginationMap());
  const oldestInteractionId = useRef<string | null>(null);
  const lastAttemptedInteractionsBatchId = useRef<null | string>(null);
  const [interactionId, setInteractionId] = useState<string | null>(null);

  const interactionStates = Object.values(interactionStatesById).sort(
    (i1, i2) => i2.interaction.updated_at - i1.interaction.updated_at
  );
  const interactionState = interactionId ? interactionStatesById[interactionId] ?? null : null;

  const loadNextInteractionsBatch = useCallback(async () => {
    try {
      const api = await getApi();
      if (
        lastAttemptedInteractionsBatchId.current !== null &&
        lastAttemptedInteractionsBatchId.current === oldestInteractionId.current
      ) {
        return;
      }
      lastAttemptedInteractionsBatchId.current = oldestInteractionId.current;
      const { data: receivedInteractions, has_more: hasMore } = await api.getInteractions({
        agent_id: agentId,
        limit: 20,
      });
      setInteractionStatesById((prev) => {
        const next = cloneDeep(prev);
        receivedInteractions.forEach((i) => {
          let intState = next[i.id];
          if (!intState) {
            intState = {
              hasMore: true,
              input: '',
              interaction: i,
              messages: [],
            };
          } else {
            // TODO: See if we want to update existing object
            // ...
          }
          next[i.id] = intState;
        });
        return next;
      });
      const [firstInteraction] = receivedInteractions;
      if (firstInteraction && interactionId === null) {
        setInteractionId(firstInteraction.id);
      }
      setHasMoreInteractions(hasMore);
      const oldestInteraction = receivedInteractions[receivedInteractions.length - 1];
      oldestInteractionId.current = oldestInteraction?.id ?? null;
    } catch (e: any) {
      // TODO: Handle properly
      console.log('Unexpected Error in Load Interactions Batch:', e.message);
      console.log(e.response.data);
    }
  }, [getApi, agentId, interactionId]);

  useEffect(() => {
    loadNextInteractionsBatch();
  }, [loadNextInteractionsBatch]);

  const loadNextMessagesBatch = useCallback(
    async (interactionId: string) => {
      try {
        const api = await getApi();
        const oldestMessageId = paginationMap.current.oldestItemFor(interactionId);
        const lastAttemptedBatchId = paginationMap.current.lastAttemptFor(interactionId);

        if (oldestMessageId === null) {
          paginationMap.current.setLastAttemptFor(interactionId, 0);
        } else if (lastAttemptedBatchId === oldestMessageId) {
          return;
        } else {
          paginationMap.current.setLastAttemptFor(interactionId, oldestMessageId);
        }

        const { data: receivedMessages, has_more: hasMore } = await api.getMessages({
          interaction_id: interactionId,
          limit: paginationLimit,
          starting_after: oldestMessageId ?? undefined,
        });

        setInteractionStatesById((prev) => {
          const next = cloneDeep(prev);
          const intState = next[interactionId];
          if (!intState) {
            console.warn(
              'Could not find interaction state. This indicates an unexpected behavior in application flow:',
              {
                interactionId,
              }
            );
            return next;
          }
          intState.hasMore = hasMore;
          intState.messages.push(...receivedMessages);
          return next;
        });
        const oldestMessage = receivedMessages[receivedMessages.length - 1];
        if (oldestMessage) {
          paginationMap.current.setOldestItemFor(interactionId, oldestMessage.id);
        }
      } catch (e: any) {
        // TODO: Handle properly
        console.log('Unexpected Error in Load Messages Batch:', e.message);
        console.log(e.response.data);
      }
    },
    [getApi]
  );

  useEffect(() => {
    if (interactionId) {
      loadNextMessagesBatch(interactionId);
    }
  }, [loadNextMessagesBatch, interactionId]);

  const handleSendMessage = useCallback(async () => {
    if (!interactionState) {
      // TODO: Confirm
      return;
    }
    const {
      interaction: { id: interactionId },
      messages,
    } = interactionState;
    const { input: content } = interactionState;
    setInteractionStatesById((prev) => {
      const next = cloneDeep(prev);
      const intState = next[interactionId];
      if (!intState) {
        console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
          interactionId,
        });
        return next;
      }
      intState.input = '';
      intState.messages.unshift({
        id: 'provisional',
        index: -1,
        content,
        created_at: Date.now(),
        interaction_id: interactionId,
        object: 'message',
        sent_by: 'user',
      });
      return next;
    });

    const api = await getApi();
    const [firstMessage] = messages;
    const parentId = firstMessage?.id ?? null;
    const { received, sent } = await api.createMessage({
      content,
      interaction_id: interactionId,
      parent_id: parentId,
    });

    if (sent.index === 0) {
      paginationMap.current.setOldestItemFor(interactionId, sent.id);
    }

    setInteractionStatesById((prev) => {
      const next = cloneDeep(prev);
      const intState = next[interactionId];
      if (!intState) {
        console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
          interactionId,
        });
        return next;
      }
      const provisionalMessageIndex = intState.messages.findIndex((m) => m.id === 'provisional');
      if (provisionalMessageIndex !== -1) {
        intState.messages[provisionalMessageIndex] = sent;
      }
      intState.messages.unshift(received);
      return next;
    });
  }, [getApi, interactionState]);

  useKeyboardEnterEvent(handleSendMessage);

  const handleCreateNewInteraction = useCallback(async () => {
    const api = await getApi();
    const newInteraction = await api.createInteraction({ agent_id: agentId });
    // TODO: If initialTurn == 'Agent' then probably want to set oldest message id here
    setInteractionStatesById((prev) => {
      const next = cloneDeep(prev);
      next[newInteraction.id] = {
        hasMore: true,
        input: '',
        interaction: newInteraction,
        messages: [],
      };
      return next;
    });
  }, [getApi, agentId]);

  const handleDeleteInteraction = useCallback(
    async (interactionId: string) => {
      const api = await getApi();
      try {
        await api.deleteInteraction(interactionId);
      } catch (e: any) {
        console.log('ERROR:', e?.response?.data);
        alert(e?.response?.data?.message ?? 'Cannot delete interaction.');
        return;
      }
      setInteractionStatesById((prev) => {
        const { [interactionId]: _, ...next } = prev;
        return next;
      });
    },
    [getApi]
  );

  return (
    <div style={{ display: 'flex', border: '1px solid gray' }}>
      <div>
        <div>Search</div>
        <button onClick={handleCreateNewInteraction} style={{ marginBottom: 20, marginTop: 10 }}>
          Create new interaction
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {interactionStates.map((interactionState) => {
            const { interaction } = interactionState;
            return (
              <button key={interaction.id} onClick={() => setInteractionId(interaction.id)}>
                {interaction.id}
              </button>
            );
          })}
        </div>
      </div>
      {(() => {
        if (!interactionState) {
          return <div>No selected interaction...</div>;
        }

        const { messages, interaction, input, hasMore } = interactionState;

        return (
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'yellowgreen',
              }}>
              <div>{interaction.id}</div>
              <button onClick={() => handleDeleteInteraction(interaction.id)}>Delete interaction</button>
            </div>
            <InfiniteScroll
              dataLength={messages.length}
              next={() => loadNextMessagesBatch(interaction.id)}
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                paddingLeft: 20,
                paddingRight: 20,
              }}
              inverse
              hasMore={hasMore}
              height={400}
              loader={<p style={{ textAlign: 'center' }}>Loading...</p>}
              endMessage={<p style={{ textAlign: 'center' }}>This marks the beginning of the interaction.</p>}>
              {messages.map((message) => {
                return (
                  <div
                    key={message.id}
                    style={{
                      marginLeft: message.sent_by === 'agent' ? 0 : 'auto',
                      padding: 10,
                      border: '1px solid rgb(235, 235, 235)',
                      backgroundColor: message.sent_by === 'agent' ? 'rgb(250, 250, 250)' : 'rgb(41, 87, 255)',
                      color: message.sent_by === 'agent' ? 'black' : 'white',
                      borderRadius: 10,
                      marginBottom: 10,
                      width: 'fit-content',
                      maxWidth: '75ch',
                      whiteSpace: 'pre-wrap',
                    }}>
                    {message.content}
                  </div>
                );
              })}
            </InfiniteScroll>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: 'hsl(220, 30%, 80%)',
              }}>
              <TextareaAutosize
                maxLength={contentMaxLength}
                placeholder={inputPlaceholder}
                style={{
                  width: '100%',
                  overflowY: 'hidden',
                  resize: 'none',
                  marginBottom: 0,
                }}
                minRows={3}
                value={input}
                onChange={(e) => {
                  setInteractionStatesById((prev) => {
                    const next = cloneDeep(prev);
                    const intState = next[interaction.id];
                    if (!intState) {
                      console.warn(
                        'Could not find interaction state. This indicates an unexpected behavior in application flow:',
                        {
                          interactionId,
                        }
                      );
                      return next;
                    }
                    intState.input = e.target.value;
                    return next;
                  });
                }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

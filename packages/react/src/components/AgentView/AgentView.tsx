/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { Interaction, Message } from '@proficient/client';
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
    const { interaction: newInteraction, messages } = await api.createInteraction({ agent_id: agentId });
    const oldestMessage = messages[messages.length - 1];
    if (oldestMessage) {
      paginationMap.current.setOldestItemFor(newInteraction.id, oldestMessage.id);
    }
    setInteractionStatesById((prev) => {
      const next = cloneDeep(prev);
      next[newInteraction.id] = {
        hasMore: true,
        input: '',
        interaction: newInteraction,
        messages,
      };
      return next;
    });
    setInteractionId(newInteraction.id);
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
    <div
      css={css`
        display: flex;
        border: 1px solid gray;
        font-size: 16px;
        border-radius: 4px;
      `}>
      {/* Interactions Sidebar */}
      <div
        css={css`
          border-right: 1px solid gray;
          padding: 12px;
        `}>
        <button
          css={css`
            margin-bottom: 20px;
          `}
          onClick={handleCreateNewInteraction}>
          + Create new interaction
        </button>
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}>
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

      {/* Interaction View */}

      {(() => {
        if (!interactionState) {
          return <div>No selected interaction...</div>;
        }

        const { messages, interaction, input, hasMore } = interactionState;

        return (
          <div
            css={css`
              width: 100%;
            `}>
            <div
              css={css`
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding: 12px;
                border-bottom: 1px solid gray;
              `}>
              <div>{interaction.id}</div>
              <button onClick={() => handleDeleteInteraction(interaction.id)}>Delete interaction</button>
            </div>
            <InfiniteScroll
              dataLength={messages.length}
              next={() => loadNextMessagesBatch(interaction.id)}
              css={css`
                display: flex;
                flex-direction: column-reverse;
                padding-left: 20px;
                padding-right: 20px;
              `}
              inverse
              hasMore={hasMore}
              height={400}
              loader={
                <div
                  css={css`
                    text-align: center;
                  `}>
                  Loading...
                </div>
              }
              endMessage={
                <div
                  css={css`
                    text-align: center;
                    padding: 10px;
                    margin-bottom: 10px;
                    margin-top: 10px;
                    color: #444;
                    font-size: 14px;
                  `}>
                  This marks the beginning of the interaction.
                </div>
              }>
              {messages.map((message) => {
                return (
                  <div
                    key={message.id}
                    css={css`
                      padding: 10px;
                      border-radius: 10px;
                      margin-bottom: 10px;
                      margin-left: ${message.sent_by === 'agent' ? 0 : 'auto'};
                      width: fit-content;
                      max-width: 75ch;
                      white-space: pre-wrap;
                      border: 1px solid rgb(235, 235, 235);
                      background-color: ${message.sent_by === 'agent' ? 'rgb(250, 250, 250)' : 'rgb(41, 87, 255)'};
                      color: ${message.sent_by === 'agent' ? 'black' : 'white'};
                    `}>
                    {message.content}
                  </div>
                );
              })}
            </InfiniteScroll>

            <div
              css={css`
                display: flex;
                align-items: center;
                border-top: 1px solid gray;
                padding-left: 20px;
                padding-right: 20px;
                padding-top: 12px;
                padding-bottom: 12px;
              `}>
              <TextareaAutosize
                placeholder={inputPlaceholder}
                css={css`
                  width: 100%;
                  overflow-y: hidden;
                  resize: none;
                  margin-bottom: 0;
                `}
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
              <button
                onClick={handleSendMessage}
                css={css`
                  margin-left: 12px;
                `}>
                Send
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

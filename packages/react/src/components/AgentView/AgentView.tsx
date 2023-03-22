/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { Agent, Interaction, Message } from '@proficient/client';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useApi, useKeyboardEnterEvent } from '../../hooks';
import { ChatSection } from './ChatSection';
import { HeaderSection } from './HeaderSection';
import { InputSection } from './InputSection';
import type { AgentViewProps } from './types';

const paginationLimit = 20; // TODO: Make dynamic

type InteractionState = {
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

type AgentState =
  | {
      status: 'nil';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'error';
      code: 'not-found' | 'unknown';
    }
  | {
      status: 'success';
      agent: Agent;
    };

export function AgentView({
  apiKey,
  agentId,
  userExternalId,
  userHmac,
  inputPlaceholder = 'Type something...',
}: AgentViewProps) {
  const { getApi } = useApi({ apiKey, userExternalId, userHmac });

  const [agentState, setAgentState] = useState<AgentState>({ status: 'nil' });
  const [interactionStatesById, setInteractionStatesById] = useState<Record<string, InteractionState>>({});
  const [hasMoreInteractions, setHasMoreInteractions] = useState(true);
  const paginationMap = useRef(new MultiSectionPaginationMap());
  const textInputMap = useRef(new Map<string, string>());
  const oldestInteractionId = useRef<string | null>(null);
  const lastAttemptedInteractionsBatchId = useRef<null | string>(null);
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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
      const { data: receivedInteractions, has_more: hasMore } = await api.interactions.list({
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

  const setTextAreaValue = useCallback((val: string) => {
    if (textAreaRef.current) {
      textAreaRef.current.value = val;
    }
  }, []);

  const selectInteraction = useCallback(
    (id: string) => {
      setInteractionId(id);
      const val = textInputMap.current.get(id) ?? '';
      setTextAreaValue(val);
    },
    [setTextAreaValue]
  );

  useEffect(() => {
    (async () => {
      setAgentState({ status: 'loading' });
      const api = await getApi();
      try {
        const agent = await api.agents.get(agentId);
        setAgentState({ status: 'success', agent });
      } catch (e) {
        // TODO: Check error code
        setAgentState({ status: 'error', code: 'unknown' });
      }
    })();
  }, [agentId, getApi]);

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

        const { data: receivedMessages, has_more: hasMore } = await api.messages.list({
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
    const content = textInputMap.current.get(interactionId);
    if (!content) {
      alert('No message');
      return;
    }
    textInputMap.current.delete(interactionId);
    setTextAreaValue('');
    setInteractionStatesById((prev) => {
      const next = cloneDeep(prev);
      const intState = next[interactionId];
      if (!intState) {
        console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
          interactionId,
        });
        return next;
      }
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
    const { received, sent } = await api.messages.create({
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
  }, [getApi, setTextAreaValue, interactionState]);

  useKeyboardEnterEvent(handleSendMessage);

  const handleCreateNewInteraction = useCallback(async () => {
    const api = await getApi();
    const { interaction: newInteraction, messages } = await api.interactions.create({ agent_id: agentId });
    const oldestMessage = messages[messages.length - 1];
    if (oldestMessage) {
      paginationMap.current.setOldestItemFor(newInteraction.id, oldestMessage.id);
    }
    setInteractionStatesById((prev) => {
      const next = cloneDeep(prev);
      next[newInteraction.id] = {
        hasMore: true,
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
        await api.interactions.delete(interactionId);
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

  if (agentState.status === 'nil' || agentState.status === 'loading') {
    return <div>Loading agent...</div>;
  }

  if (agentState.status === 'error') {
    // TODO: Show which error
    return <div>Error loading agent: {agentState.code}</div>;
  }

  const { agent } = agentState;

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
        <div>{agent.name}</div>

        <button
          css={css`
            margin-top: 20px;
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
            const { interaction: i } = interactionState;
            return (
              <div
                key={i.id}
                css={css`
                  border-bottom: 1px solid gray;
                  padding-top: 12px;
                  padding-bottom: 12px;
                  padding-left: 12px;
                  padding-right: 12px;
                  cursor: pointer;
                  background-color: ${interactionId === i.id ? 'lightblue' : 'transparent'};

                  &:hover {
                    background-color: ${interactionId === i.id ? 'lightblue' : 'rgb(240, 240, 240)'};
                  }
                `}
                onClick={() => selectInteraction(i.id)}>
                {i.id}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interaction View */}

      {(() => {
        if (!interactionState) {
          return <div>No selected interaction...</div>;
        }

        const { messages, interaction, hasMore } = interactionState;

        return (
          <div
            css={css`
              width: 100%;
            `}>
            <HeaderSection onClickDelete={() => handleDeleteInteraction(interaction.id)} title={interaction.id} />

            <ChatSection hasMore={hasMore} messages={messages} next={() => loadNextMessagesBatch(interaction.id)} />

            <InputSection
              onClickSend={handleSendMessage}
              onInputChange={(text) => {
                if (text) {
                  textInputMap.current.set(interaction.id, text);
                } else {
                  textInputMap.current.delete(interaction.id);
                }
              }}
              placeholder={inputPlaceholder}
              textAreaRef={textAreaRef}
            />
          </div>
        );
      })()}
    </div>
  );
}

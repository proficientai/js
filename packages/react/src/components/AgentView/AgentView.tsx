/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { Agent, Interaction, Message } from '@proficient/client';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useApi, useKeyboardEnterEvent } from '../../hooks';
import { ChatSection } from './ChatSection';
import { HeaderSection } from './HeaderSection';
import { InputSection } from './InputSection';
import { SidebarSection } from './SidebarSection';
import type { AgentViewProps } from './types';
import { useMultiSectionPagination } from './useMultiSectionPagination';
import { usePagination } from './usePagination';
import { useTextInputMap } from './useTextInputMap';

type InteractionState = {
  interaction: Interaction;
  messages: Message[];
  hasMore: boolean;
};

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
  const {
    markAttempt: markAttemptToLoadInteractionsBatch,
    lastAttemptId: lastAttemptedInteractionsBatchId,
    oldestItemId: oldestInteractionId,
    updateOldestItem: updateOldestInteraction,
  } = usePagination();
  const paginationMap = useMultiSectionPagination();
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { get: getInteractionInput, set: setInteractionInput } = useTextInputMap();

  const interactionState = interactionId ? interactionStatesById[interactionId] ?? null : null;

  const setTextAreaValue = useCallback((val: string) => {
    if (inputTextAreaRef.current) {
      inputTextAreaRef.current.value = val;
    }
  }, []);

  const selectInteraction = useCallback(
    (id: string) => {
      setInteractionId(id);
      const val = getInteractionInput(id);
      setTextAreaValue(val);
    },
    [getInteractionInput, setTextAreaValue]
  );

  const loadNextInteractionsBatch = useCallback(async () => {
    try {
      const api = await getApi();
      if (lastAttemptedInteractionsBatchId !== null && lastAttemptedInteractionsBatchId === oldestInteractionId) return;
      markAttemptToLoadInteractionsBatch();
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
        selectInteraction(firstInteraction.id);
      }
      setHasMoreInteractions(hasMore);
      const oldestInteraction = receivedInteractions[receivedInteractions.length - 1];
      updateOldestInteraction(oldestInteraction?.id ?? null);
    } catch (e: any) {
      // TODO: Handle properly
      console.log('Unexpected Error in Load Interactions Batch:', e.message);
      console.log(e.response.data);
    }
  }, [
    getApi,
    agentId,
    interactionId,
    markAttemptToLoadInteractionsBatch,
    lastAttemptedInteractionsBatchId,
    oldestInteractionId,
    updateOldestInteraction,
    selectInteraction,
  ]);

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
        const oldestMessageId = paginationMap.oldestItemFor(interactionId);
        const lastAttemptedBatchId = paginationMap.lastAttemptFor(interactionId);

        if (oldestMessageId === null) {
          paginationMap.setLastAttemptFor(interactionId, 0);
        } else if (lastAttemptedBatchId === oldestMessageId) {
          return;
        } else {
          paginationMap.setLastAttemptFor(interactionId, oldestMessageId);
        }

        const { data: receivedMessages, has_more: hasMore } = await api.messages.list({
          interaction_id: interactionId,
          limit: 20,
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
          paginationMap.setOldestItemFor(interactionId, oldestMessage.id);
        }
      } catch (e: any) {
        // TODO: Handle properly
        console.log('Unexpected Error in Load Messages Batch:', e.message);
        console.log(e.response.data);
      }
    },
    [getApi, paginationMap]
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
    const content = getInteractionInput(interactionId);
    if (!content) {
      alert('No message');
      return;
    }
    setInteractionInput(interactionId, '');
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
      paginationMap.setOldestItemFor(interactionId, sent.id);
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
  }, [getApi, getInteractionInput, setInteractionInput, setTextAreaValue, interactionState, paginationMap]);

  useKeyboardEnterEvent(handleSendMessage);

  const handleCreateNewInteraction = useCallback(async () => {
    const api = await getApi();
    const { interaction: newInteraction, messages } = await api.interactions.create({ agent_id: agentId });
    const oldestMessage = messages[messages.length - 1];
    if (oldestMessage) {
      paginationMap.setOldestItemFor(newInteraction.id, oldestMessage.id);
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
  }, [getApi, agentId, paginationMap]);

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
  const sortedInteractions = Object.values(interactionStatesById)
    .map((s) => s.interaction)
    .sort((i1, i2) => i2.updated_at - i1.updated_at);

  return (
    <div
      css={css`
        display: flex;
        border: 1px solid gray;
        font-size: 16px;
        border-radius: 4px;
      `}>
      <SidebarSection
        header={agent.name}
        interactions={sortedInteractions}
        isSelectedInteraction={(i) => i.id === interactionId}
        onClickInteraction={(i) => {
          selectInteraction(i.id);
        }}
        onClickNewInteraction={handleCreateNewInteraction}
      />

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
              onInputChange={(text) => setInteractionInput(interaction.id, text)}
              placeholder={inputPlaceholder}
              textAreaRef={inputTextAreaRef}
            />
          </div>
        );
      })()}
    </div>
  );
}

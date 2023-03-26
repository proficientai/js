/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import type { Agent, Interaction, Message } from '@proficient/client';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useApi, useKeyboardEnterEvent } from '../../hooks';
import { ChatSection } from './ChatSection';
import { HeaderSection } from './HeaderSection';
import { InputSection } from './InputSection';
import { SidebarSection } from './SidebarSection';
import type { AgentViewProps } from './types';
import { useMultiSectionPagination } from './useMultiSectionPagination';
import { usePagination } from './usePagination';
import { useTextInputMap } from './useTextInputMap';

type InteractionState =
  | {
      status: 'loading' | 'success';
      interaction: Interaction;
      messagesById: Map<string, Message>;
      hasMore: boolean;
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
      interaction?: Interaction;
      messagesById: Map<string, Message>;
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

  const sortedInteractions = useMemo(() => {
    const filteredInteractions = Object.values(interactionStatesById)
      .map((s) => (s.status === 'success' ? s.interaction : null))
      .filter((i) => !!i) as Interaction[];
    return filteredInteractions.sort((i1, i2) => i2.updated_at - i1.updated_at);
  }, [interactionStatesById]);

  const sortedMessages = useMemo(() => {
    if (interactionState?.status === 'success') {
      const { messagesById } = interactionState;
      return Array.from(messagesById.values()).sort((m1, m2) => m2.index - m1.index);
    }
    return [];
  }, [interactionState]);

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
              status: 'success',
              hasMore: true,
              interaction: i,
              messagesById: new Map(),
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
      const oldestInteraction = receivedInteractions[receivedInteractions.length - 1];
      updateOldestInteraction(oldestInteraction?.id ?? null, hasMore);
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
          receivedMessages.forEach((m) => {
            intState.messagesById.set(m.id, m);
          });
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
    if (!interactionState || interactionState.status !== 'success') {
      // TODO: Confirm
      return;
    }
    const {
      interaction: { id: interactionId },
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
      intState.messagesById.set('provisional', {
        id: 'provisional',
        index: intState.messagesById.size,
        content,
        created_at: Date.now(),
        interaction_id: interactionId,
        object: 'message',
        sent_by: 'user',
      });
      return next;
    });

    const api = await getApi();
    const [firstMessage] = sortedMessages;
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
      intState.messagesById.delete('provisional');
      intState.messagesById.set(sent.id, sent);
      intState.messagesById.set(received.id, received);
      return next;
    });
  }, [
    getApi,
    getInteractionInput,
    setInteractionInput,
    setTextAreaValue,
    interactionState,
    paginationMap,
    sortedMessages,
  ]);

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
        status: 'success',
        hasMore: true,
        interaction: newInteraction,
        messagesById: new Map(messages.map((m) => [m.id, m])),
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

  return (
    <div
      css={css`
        display: flex;
        border: 1px solid gray;
        font-size: 16px;
        border-radius: 4px;
      `}>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        `}
      />
      <SidebarSection
        description={agent.description}
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

        if (interactionState.status === 'error') {
          return <div>Error loading interaction: {interactionState.errorCode}</div>;
        }

        const { interaction, hasMore } = interactionState;

        return (
          <div
            css={css`
              width: 100%;
            `}>
            <HeaderSection onClickDelete={() => handleDeleteInteraction(interaction.id)} title={interaction.id} />

            <ChatSection
              hasMore={hasMore}
              messages={sortedMessages}
              next={() => loadNextMessagesBatch(interaction.id)}
            />

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

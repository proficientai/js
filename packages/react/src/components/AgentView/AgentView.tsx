/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import type { Agent, Interaction, Message } from '@proficient/client';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useApi } from '../../hooks';
import { ChatSection } from './ChatSection';
import { HeaderSection } from './HeaderSection';
import { InputSection } from './InputSection';
import { SidebarSection } from './SidebarSection';
import type { AgentViewProps } from './types';
import { useMultiSectionPagination } from './useMultiSectionPagination';
import { usePagination } from './usePagination';
import { useTextInputMap } from './useTextInputMap';

const PROVISIONAL_MESSAGE_ID = '_msg_provisional';

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

type InteractionState =
  | {
      status: 'loading';
      interaction?: Interaction;
    }
  | {
      status: 'success';
      interaction: Interaction;
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
    };

type MessagesState =
  | {
      status: 'loading' | 'success';
      messagesById: Map<string, Message>;
      hasMore: boolean;
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
      messagesById: Map<string, Message>;
      hasMore: boolean;
    };

type WritingState =
  | {
      status: 'nil' | 'writing';
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
    };

export function AgentView({
  apiKey,
  agentId,
  userExternalId,
  userHmac,
  autoRequestReply = true,
  sendOnEnter = true,
  inputPlaceholder = 'Type something...',
}: AgentViewProps) {
  const { getApi } = useApi({ apiKey, userExternalId, userHmac });

  const [agentState, setAgentState] = useState<AgentState>({ status: 'nil' });
  const [interactionStatesById, setInteractionStatesById] = useState<Record<string, InteractionState>>({});
  const [messagesStatesById, setMessagesStatesById] = useState<Record<string, MessagesState>>({});
  const [writingStatesById, setWritingStatesById] = useState<Record<string, WritingState>>({});
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
  const messagesState = interactionId ? messagesStatesById[interactionId] ?? null : null;
  const writingState = interactionId ? writingStatesById[interactionId] ?? null : null;

  const sortedInteractions = useMemo(() => {
    const filteredInteractions = Object.values(interactionStatesById)
      .map((s) => (s.status === 'success' ? s.interaction : null))
      .filter((i) => !!i) as Interaction[];
    return filteredInteractions.sort((i1, i2) => i2.updated_at - i1.updated_at);
  }, [interactionStatesById]);

  const sortedMessages = useMemo(() => {
    if (messagesState?.status === 'success') {
      const { messagesById } = messagesState;
      return Array.from(messagesById.values()).sort((m1, m2) => m2.index - m1.index);
    }
    return [];
  }, [messagesState]);

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
          let interactionState = next[i.id];
          if (!interactionState) {
            interactionState = {
              status: 'success',
              interaction: i,
            };
          } else {
            // TODO: See if we want to update existing object
          }
          next[i.id] = interactionState;
        });
        return next;
      });
      setMessagesStatesById((prev) => {
        const next = cloneDeep(prev);
        receivedInteractions.forEach((i) => {
          let messagesState = next[i.id];
          if (!messagesState) {
            messagesState = {
              status: 'success',
              hasMore: true,
              messagesById: new Map(),
            };
          } else {
            // TODO: See if we want to update existing object
          }
          next[i.id] = messagesState;
        });
        return next;
      });
      setWritingStatesById((prev) => {
        const next = cloneDeep(prev);
        receivedInteractions.forEach((i) => {
          let writingState = next[i.id];
          if (!writingState) {
            writingState = {
              status: 'nil',
            };
          } else {
            // TODO: See if we want to update existing object
          }
          next[i.id] = writingState;
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

        setMessagesStatesById((prev) => {
          const next = cloneDeep(prev);
          const messageState = next[interactionId];
          if (!messageState) {
            console.warn(
              'Could not find interaction state. This indicates an unexpected behavior in application flow:',
              {
                interactionId,
              }
            );
            return next;
          }
          messageState.hasMore = hasMore;
          receivedMessages.forEach((m) => {
            messageState.messagesById.set(m.id, m);
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

  const handleRequestAnswer = useCallback(
    async (interactionId: string, lastMessage?: Message) => {
      if (interactionId === null) return;
      lastMessage ??= sortedMessages[0];

      console.log('LAST MESSAGE=', lastMessage);

      if (!lastMessage || lastMessage.sent_by !== 'user') {
        alert('Last message must be sent by user to request answer.');
        return;
      }

      const api = await getApi();

      setWritingStatesById((prev) => {
        const next = cloneDeep(prev);
        const writingState = next[interactionId];
        if (!writingState) {
          console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
            interactionId,
          });
          return next;
        }
        writingState.status = 'writing';
        return next;
      });

      try {
        const received = await api.messages.reply(lastMessage.id, { interaction_id: interactionId });

        setMessagesStatesById((prev) => {
          const next = cloneDeep(prev);
          const messagesState = next[interactionId];
          if (!messagesState) {
            console.warn(
              'Could not find interaction state. This indicates an unexpected behavior in application flow:',
              {
                interactionId,
              }
            );
            return next;
          }
          messagesState.messagesById.set(received.id, received);
          return next;
        });
        setWritingStatesById((prev) => {
          const next = cloneDeep(prev);
          const writingState = next[interactionId];
          if (!writingState) {
            console.warn(
              'Could not find interaction state. This indicates an unexpected behavior in application flow:',
              {
                interactionId,
              }
            );
            return next;
          }
          writingState.status = 'nil';
          return next;
        });
      } catch (e) {
        console.error('An unexpected error!');
        setWritingStatesById((prev) => {
          const next = cloneDeep(prev);
          const writingState = next[interactionId];
          if (!writingState) {
            console.warn(
              'Could not find interaction state. This indicates an unexpected behavior in application flow:',
              {
                interactionId,
              }
            );
            return next;
          }
          writingState.status = 'error';
          return next;
        });
      }
    },
    [getApi, sortedMessages]
  );

  const handleSendMessage = useCallback(async () => {
    if (interactionId === null) return;
    const content = getInteractionInput(interactionId);
    if (!content) {
      alert('No message');
      return;
    }
    setInteractionInput(interactionId, '');
    setTextAreaValue('');
    setMessagesStatesById((prev) => {
      const next = cloneDeep(prev);
      const messageState = next[interactionId];
      if (!messageState) {
        console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
          interactionId,
        });
        return next;
      }
      messageState.messagesById.set(PROVISIONAL_MESSAGE_ID, {
        id: PROVISIONAL_MESSAGE_ID,
        index: messageState.messagesById.size,
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
    const sent = await api.messages.create({
      content,
      interaction_id: interactionId,
      parent_id: parentId,
    });

    if (sent.index === 0) {
      paginationMap.setOldestItemFor(interactionId, sent.id);
    }

    setMessagesStatesById((prev) => {
      const next = cloneDeep(prev);
      const messagesState = next[interactionId];
      if (!messagesState) {
        console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
          interactionId,
        });
        return next;
      }
      messagesState.messagesById.delete(PROVISIONAL_MESSAGE_ID);
      messagesState.messagesById.set(sent.id, sent);
      return next;
    });

    if (autoRequestReply) {
      await handleRequestAnswer(interactionId, sent);
    }
  }, [
    interactionId,
    getApi,
    getInteractionInput,
    setInteractionInput,
    setTextAreaValue,
    paginationMap,
    sortedMessages,
    autoRequestReply,
    handleRequestAnswer,
  ]);

  const handleCreateInteraction = useCallback(async () => {
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
        interaction: newInteraction,
      };
      return next;
    });
    setMessagesStatesById((prev) => {
      const next = cloneDeep(prev);
      next[newInteraction.id] = {
        status: 'success',
        hasMore: true,
        messagesById: new Map(messages.map((m) => [m.id, m])),
      };
      return next;
    });
    setWritingStatesById((prev) => {
      const next = cloneDeep(prev);
      next[newInteraction.id] = {
        status: 'nil',
      };
      return next;
    });
    setInteractionId(newInteraction.id);
  }, [getApi, agentId, paginationMap]);

  const handleUpdateInteraction = useCallback(
    async (name: string) => {
      if (interactionId === null) return;
      const api = await getApi();
      const updatedInteraction = await api.interactions.update(interactionId, {
        name,
      });
      setInteractionStatesById((prev) => {
        const next = cloneDeep(prev);
        next[interactionId] = {
          status: 'success',
          interaction: updatedInteraction,
        };
        return next;
      });
    },
    [getApi, interactionId]
  );

  const handleDeleteInteraction = useCallback(
    async (interactionId: string) => {
      const shouldDelete = confirm(
        'Are you sure you want to delete this interaction? You will not be able to recover it as all the messages in it will be permanently deleted.'
      );
      if (!shouldDelete) return;
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
      setMessagesStatesById((prev) => {
        const { [interactionId]: _, ...next } = prev;
        return next;
      });
      setWritingStatesById((prev) => {
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
        onClickNewInteraction={handleCreateInteraction}
      />

      {(() => {
        if (!interactionState || !messagesState || !writingState) {
          return <div>No selected interaction...</div>;
        }

        if (interactionState.status === 'error') {
          return <div>Error loading interaction: {interactionState.errorCode}</div>;
        }

        if (messagesState.status === 'error') {
          return <div>Error loading messages: {messagesState.errorCode}</div>;
        }

        const { interaction } = interactionState;
        const { hasMore } = messagesState;
        const { status: writingStatus } = writingState;

        if (!interaction) return null;

        return (
          <div
            css={css`
              width: 100%;
            `}>
            <HeaderSection
              onClickDelete={() => handleDeleteInteraction(interaction.id)}
              onTitleBlur={async (text) => {
                if (interaction.name !== text) {
                  await handleUpdateInteraction(text);
                }
              }}
              title={interaction.name}
            />

            <ChatSection
              agentName={agent.name}
              autoRequestReply={autoRequestReply}
              hasMore={hasMore}
              messages={sortedMessages}
              next={() => loadNextMessagesBatch(interaction.id)}
              onClickRequestAnswer={() => handleRequestAnswer(interaction.id)}
              writingStatus={writingStatus}
            />

            <InputSection
              onClickSend={handleSendMessage}
              onInputChange={(text) => setInteractionInput(interaction.id, text)}
              placeholder={inputPlaceholder}
              sendOnEnter={sendOnEnter}
              textAreaRef={inputTextAreaRef}
            />
          </div>
        );
      })()}
    </div>
  );
}

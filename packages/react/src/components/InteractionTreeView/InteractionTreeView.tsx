/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import type { Proficient } from '@proficient/client';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { InteractionTree } from '../../ds/InteractionTree';
import { useApi } from '../../hooks';
import { ChatSection } from './ChatSection';
import { HeaderSection } from './HeaderSection';
import { InputSection } from './InputSection';
import { SidebarSection } from './SidebarSection';
import type { InteractionViewProps, MessageGroupInfo } from './types';
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
      agent: Proficient.Agent;
    };

type InteractionState =
  | {
      status: 'loading';
      interaction?: Proficient.Interaction;
    }
  | {
      status: 'success';
      interaction: Proficient.Interaction;
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
    };

type MessagesState =
  | {
      status: 'loading' | 'success';
      tree: InteractionTree;
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
      tree: InteractionTree;
    };

type WritingState =
  | {
      status: 'nil' | 'writing';
    }
  | {
      status: 'error';
      errorCode: 'not-found' | 'unknown';
    };

function cloneMessagesStateMap(prev: Record<string, MessagesState>) {
  const next: Record<string, MessagesState> = {};
  for (const interactionId in prev) {
    const state = prev[interactionId]!;
    if (state.status === 'success' || state.status === 'loading') {
      next[interactionId] = { status: state.status, tree: state.tree.clone() };
    } else if (state.status === 'error') {
      next[interactionId] = {
        status: 'error',
        errorCode: state.errorCode,
        tree: state.tree.clone(),
      };
    }
  }
  return next;
}

export function InteractionTreeView({
  apiKey,
  agentId,
  userExternalId,
  userHmac,
  autoRequestReply = true,
  sendOnEnter = true,
  inputPlaceholder = 'Type something...',
}: InteractionViewProps) {
  const { getApi } = useApi({ apiKey, userExternalId, userHmac });

  const [agentState, setAgentState] = useState<AgentState>({ status: 'nil' });
  const [interactionStatesById, setInteractionStatesById] = useState<Record<string, InteractionState>>({});
  const [messagesStatesById, setMessagesStatesById] = useState<Record<string, MessagesState>>({});
  const [writingStatesById, setWritingStatesById] = useState<Record<string, WritingState>>({});
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { get: getInteractionInput, set: setInteractionInput } = useTextInputMap();

  const interactionState = interactionId ? interactionStatesById[interactionId] ?? null : null;
  const messagesState = interactionId ? messagesStatesById[interactionId] ?? null : null;
  const writingState = interactionId ? writingStatesById[interactionId] ?? null : null;

  const sortedInteractions = useMemo(() => {
    const filteredInteractions = Object.values(interactionStatesById)
      .map((s) => (s.status === 'success' ? s.interaction : null))
      .filter((i) => !!i) as Proficient.Interaction[];
    return filteredInteractions.sort((i1, i2) => i2.updatedAt - i1.updatedAt);
  }, [interactionStatesById]);

  const [activeIndexesByDepth, setActiveIndexesByDepth] = useState<number[]>([]);

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

  const loadInteractions = useCallback(async () => {
    try {
      const api = await getApi();
      const { data: receivedInteractions } = await api.interactions.list({
        agentId,
        limit: '100',
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
        const next = cloneMessagesStateMap(prev);
        receivedInteractions.forEach((i) => {
          let messagesState = next[i.id];
          if (!messagesState) {
            messagesState = {
              status: 'success',
              tree: InteractionTree.create(),
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
    } catch (e: any) {
      // TODO: Handle properly
      console.log('Unexpected Error in Load Interactions Batch:', e.message);
      console.log(e.response.data);
    }
  }, [agentId, getApi, interactionId, selectInteraction]);

  useEffect(() => {
    loadInteractions();
    // TODO: Needs to change
  }, []);

  const loadMessages = useCallback(
    async (interactionId: string) => {
      try {
        const api = await getApi();
        const { data: receivedMessages } = await api.messages.list({
          interactionId,
        });
        setMessagesStatesById((prev) => {
          const next = cloneMessagesStateMap(prev);
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
          receivedMessages.forEach((m) => {
            messageState.tree.addMessage(m);
          });
          return next;
        });
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
      loadMessages(interactionId);
    }
  }, [getApi, interactionId, loadMessages]);

  const handleRequestAnswer = useCallback(
    async (interactionId: string, lastMessage?: Proficient.Message) => {
      if (interactionId === null) return;

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
        const lastMessageId = ''; // TODO: Implement
        const received = await api.messages.ask(lastMessageId, { interactionId });

        setMessagesStatesById((prev) => {
          const next = cloneMessagesStateMap(prev);
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
          messagesState.tree.addMessage(received);
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
    [getApi]
  );

  const messageGroups = useMemo<MessageGroupInfo[]>(() => {
    if (messagesState?.status === 'success') {
      const { tree } = messagesState;
      return tree
        .buildConversation()
        .reverse()
        .map((g) => {
          const [first] = g.messages;
          const activeIndex = activeIndexesByDepth[g.depth] ?? 0;
          return {
            id: first.id,
            activeIndex,
            depth: g.depth,
            messages: g.messages,
          };
        });
    }
    return [];
  }, [messagesState, activeIndexesByDepth]);

  const handleSendMessage = useCallback(async () => {
    if (interactionId === null) return;
    const content = getInteractionInput(interactionId);
    if (!content) {
      alert('No message');
      return;
    }
    const [firstMessageGroup] = messageGroups;
    const parentMessage = firstMessageGroup ? firstMessageGroup.messages[firstMessageGroup.activeIndex] : undefined;
    if (!parentMessage) {
      alert('Could not find the parent message.');
      return;
    }
    setInteractionInput(interactionId, '');
    setTextAreaValue('');
    setMessagesStatesById((prev) => {
      const next = cloneMessagesStateMap(prev);
      const messageState = next[interactionId];
      if (!messageState) {
        console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
          interactionId,
        });
        return next;
      }
      messageState.tree.addMessage({
        id: PROVISIONAL_MESSAGE_ID,
        object: 'message',
        depth: parentMessage.depth + 1,
        content,
        createdAt: Date.now(),
        interactionId,
        parentId: parentMessage.id,
        sentBy: 'user',
      });
      return next;
    });

    const api = await getApi();
    const sent = await api.messages.create({
      content,
      interactionId,
      parentId: parentMessage.id,
    });

    setMessagesStatesById((prev) => {
      const next = cloneMessagesStateMap(prev);
      const messagesState = next[interactionId];
      if (!messagesState) {
        console.warn('Could not find interaction state. This indicates an unexpected behavior in application flow:', {
          interactionId,
        });
        return next;
      }
      messagesState.tree.replaceMessage(PROVISIONAL_MESSAGE_ID, sent);
      return next;
    });

    if (autoRequestReply) {
      await handleRequestAnswer(interactionId, sent);
    }
  }, [
    interactionId,
    autoRequestReply,
    messageGroups,
    getApi,
    getInteractionInput,
    setInteractionInput,
    setTextAreaValue,
    handleRequestAnswer,
  ]);

  const handleCreateInteraction = useCallback(async () => {
    const api = await getApi();
    const { interaction: newInteraction, messages } = await api.interactions.create({ agentId });
    setInteractionStatesById((prev) => {
      const next = cloneDeep(prev);
      next[newInteraction.id] = {
        status: 'success',
        interaction: newInteraction,
      };
      return next;
    });
    setMessagesStatesById((prev) => {
      const next = cloneMessagesStateMap(prev);
      next[newInteraction.id] = {
        status: 'success',
        tree: InteractionTree.create(messages),
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
  }, [getApi, agentId]);

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

  console.log('MESSAGE GROUPS =', messageGroups);
  console.log('MESSAGES TREE =', messagesState?.tree);

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
              messageGroups={messageGroups}
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

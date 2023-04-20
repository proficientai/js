/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import type { Proficient } from '@proficient/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { InteractionTree } from '../../ds/InteractionTree';
import { useApi } from '../../hooks';
import { colors } from '../../styles';
import { BoltIcon } from '../icons/BoltIcon';
import { RetryIcon } from '../icons/RetryIcon';
import { ChatSection } from './ChatSection';
import { HeaderSection } from './HeaderSection';
import { InputSection } from './InputSection';
import { SidebarSection } from './SidebarSection';
import type {
  AgentState,
  InteractionState,
  InteractionViewProps,
  MessageGroupInfo,
  MessagesState,
  WritingState,
} from './types';
import { useTextInputMap } from './useTextInputMap';

const PROVISIONAL_MESSAGE_ID = '_msg_provisional';

function useActiveIndexes() {
  const [mapsByInteractionId, setMapsByInteractionId] = useState<Record<string, Map<number, number>>>({});

  function getActiveIndex(interactionId: string, depth: number) {
    const map = mapsByInteractionId[interactionId];
    return map?.get(depth) ?? 0;
  }

  function setActiveIndex(interactionId: string, depth: number, index: number) {
    setMapsByInteractionId((prev) => {
      const { [interactionId]: prevMap, ...rest } = prev;
      const next = prevMap ? new Map(prevMap) : new Map();
      next.set(depth, index);
      return { ...rest, [interactionId]: next };
    });
  }

  return { getActiveIndex, setActiveIndex };
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
  const { getActiveIndex, setActiveIndex } = useActiveIndexes();

  const interactionState = interactionId ? interactionStatesById[interactionId] ?? null : null;
  const messagesState = interactionId ? messagesStatesById[interactionId] ?? null : null;
  const writingState = interactionId ? writingStatesById[interactionId] ?? null : null;

  const sortedInteractions = useMemo(() => {
    const filteredInteractions = Object.values(interactionStatesById)
      .map((s) => (s.status === 'success' ? s.interaction : null))
      .filter((i) => !!i) as Proficient.Interaction[];
    return filteredInteractions.sort((i1, i2) => i2.updatedAt - i1.updatedAt);
  }, [interactionStatesById]);

  const messageGroups = useMemo(() => {
    const groups: MessageGroupInfo[] = [];
    if (interactionId && messagesState) {
      const tree = InteractionTree.create(messagesState.messageMap);
      tree.traverseFromRoot(
        (depth) => getActiveIndex(interactionId, depth),
        (message, currentIndex, depth, groupSize) => {
          if (!message) {
            throw new Error('Implementation Error: The tree has been constructed with an incomplete dataset.');
          }
          groups[depth] = {
            current: message,
            id: message.id,
            currentIndex,
            depth,
            size: groupSize,
          };
        }
      );
    }
    return groups.reverse();
  }, [interactionId, messagesState, getActiveIndex]);

  const mostRecentMessage = useMemo(() => {
    const [firstMessageGroup] = messageGroups;
    return firstMessageGroup?.current;
  }, [messageGroups]);

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

  // Load agent
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

  // Load interactions
  useEffect(() => {
    (async () => {
      try {
        const api = await getApi();
        const { data: receivedInteractions } = await api.interactions.list({
          agentId,
          limit: '100',
        });
        const newInteractionStatesById = receivedInteractions.reduce((acc, cur) => {
          acc[cur.id] = { status: 'success', interaction: cur };
          return acc;
        }, {} as Record<string, InteractionState>);
        setInteractionStatesById(newInteractionStatesById);

        const newMessagesStatesById = receivedInteractions.reduce((acc, cur) => {
          acc[cur.id] = { status: 'loading', messageMap: new Map() };
          return acc;
        }, {} as Record<string, MessagesState>);
        setMessagesStatesById(newMessagesStatesById);

        const newWritingStatesById = receivedInteractions.reduce((acc, cur) => {
          acc[cur.id] = { status: 'nil' };
          return acc;
        }, {} as Record<string, WritingState>);
        setWritingStatesById(newWritingStatesById);
      } catch (e) {
        // TODO: Handle errors
        alert('Error loading interactions!');
      }
    })();
  }, [agentId, getApi]);

  const loadMessages = useCallback(
    async (interactionId: string) => {
      console.log('Starting to load messages', Date.now());
      try {
        const api = await getApi();
        const { data: receivedMessages } = await api.messages.list({
          interactionId,
        });
        const receivedMessagesMap = new Map(receivedMessages.map((m) => [m.id, m]));
        setMessagesStatesById((prev) => {
          const { [interactionId]: _, ...rest } = prev;
          return {
            ...rest,
            [interactionId]: {
              status: 'success',
              messageMap: receivedMessagesMap,
            },
          };
        });
      } catch (e) {
        // TODO: Handle errors
        alert('Error loading messages!');
      }
    },
    [getApi]
  );

  // Load messages
  // TODO: We probably don't want to load every time `interactionId` changes
  useEffect(() => {
    if (interactionId) {
      loadMessages(interactionId);
    }
  }, [loadMessages, interactionId]);

  const handleRequestAnswer = useCallback(
    async (interactionId: string, toMessageId?: string) => {
      if (interactionId === null) return;
      const [firstMessageGroup] = messageGroups;
      toMessageId ??= firstMessageGroup?.current.id;
      if (!toMessageId) {
        alert('Could not find the message to which a reply is being asked for.');
        return;
      }
      setWritingStatesById((prev) => ({ ...prev, [interactionId]: { status: 'writing' } }));
      try {
        const api = await getApi();
        const received = await api.messages.ask(toMessageId, { interactionId });
        setMessagesStatesById((prev) => {
          const { [interactionId]: prevMessagesState, ...rest } = prev;
          const newMessageMap = new Map(prevMessagesState?.messageMap);
          newMessageMap.set(received.id, received);
          return {
            ...rest,
            [interactionId]: { status: 'success', messageMap: newMessageMap },
          };
        });
        setWritingStatesById((prev) => ({ ...prev, [interactionId]: { status: 'nil' } }));
      } catch (e) {
        console.error('An unexpected error!');
        setWritingStatesById((prev) => ({ ...prev, [interactionId]: { status: 'error', errorCode: 'unknown' } }));
      }
    },
    [getApi, messageGroups]
  );

  const handleSendMessage = useCallback(async () => {
    if (interactionId === null) return;
    const parentId = mostRecentMessage?.id;
    const content = getInteractionInput(interactionId);
    if (!content) {
      alert('No message');
      return;
    }
    setInteractionInput(interactionId, '');
    setTextAreaValue('');
    setMessagesStatesById((prev) => {
      const { [interactionId]: prevMessagesState, ...rest } = prev;
      const newMessageMap = new Map(prevMessagesState?.messageMap);
      newMessageMap.set(PROVISIONAL_MESSAGE_ID, {
        id: PROVISIONAL_MESSAGE_ID,
        object: 'message',
        content,
        createdAt: Date.now(),
        depth: Number.MAX_SAFE_INTEGER, // TODO: See if this breaks anything
        interactionId,
        parentId,
        sentBy: 'user',
      });
      return {
        ...rest,
        [interactionId]: {
          status: 'success',
          messageMap: newMessageMap,
        },
      };
    });

    const api = await getApi();
    try {
      const sent = await api.messages.create({
        content,
        interactionId,
        parentId,
      });

      setMessagesStatesById((prev) => {
        const { [interactionId]: prevMessagesState, ...rest } = prev;
        const newMessageMap = new Map(prevMessagesState?.messageMap);
        newMessageMap.delete(PROVISIONAL_MESSAGE_ID);
        newMessageMap.set(sent.id, sent);
        return {
          ...rest,
          [interactionId]: {
            status: 'success',
            messageMap: newMessageMap,
          },
        };
      });

      if (autoRequestReply) {
        await handleRequestAnswer(interactionId, sent.id);
      }
    } catch (e: any) {
      // TODO: Handle errors
      alert(`Api Error: ${e?.response?.data?.message}`);
    }
  }, [
    autoRequestReply,
    getApi,
    getInteractionInput,
    handleRequestAnswer,
    interactionId,
    setInteractionInput,
    setTextAreaValue,
    mostRecentMessage?.id,
  ]);

  const handleCreateInteraction = useCallback(async () => {
    try {
      const api = await getApi();
      const { interaction: newInteraction, messages } = await api.interactions.create({ agentId });
      setInteractionStatesById((prev) => ({
        ...prev,
        [newInteraction.id]: {
          status: 'success',
          interaction: newInteraction,
        },
      }));
      setMessagesStatesById((prev) => ({
        ...prev,
        [newInteraction.id]: {
          status: 'success',
          messageMap: new Map(messages.map((m) => [m.id, m])),
        },
      }));
      setWritingStatesById((prev) => ({
        ...prev,
        [newInteraction.id]: {
          status: 'nil',
        },
      }));
      setInteractionId(newInteraction.id);
    } catch (e) {
      // TODO: Handle errors
      console.error('Cannot create interaction', e);
    }
  }, [agentId, getApi]);

  const handleUpdateInteraction = useCallback(
    async (name: string) => {
      if (interactionId === null) return;
      try {
        const api = await getApi();
        const updatedInteraction = await api.interactions.update(interactionId, {
          name,
        });
        setInteractionStatesById((prev) => ({
          ...prev,
          [interactionId]: {
            status: 'success',
            interaction: updatedInteraction,
          },
        }));
      } catch (e) {
        // TODO: Handle errors
        console.error('Cannot update interaction', e);
      }
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
        // TODO: Handle errors
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
    // TODO: Update view
    return <div>Loading agent...</div>;
  }

  if (agentState.status === 'error') {
    // TODO: Update view
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
          // TODO: Update view
          return <div>No selected interaction...</div>;
        }

        if (interactionState.status === 'error') {
          // TODO: Update view
          return <div>Error loading interaction: {interactionState.errorCode}</div>;
        }

        if (interactionState.status === 'loading') {
          // TODO: Update view
          return <div>Loading interaction...</div>;
        }

        if (messagesState.status === 'error') {
          // TODO: Update view
          return <div>Error loading messages: {messagesState.errorCode}</div>;
        }

        const { interaction } = interactionState;
        const { status: writingStatus } = writingState;

        let generateButtonType: null | 'generate' | 'regenerate' | 'retry' = null;

        if (autoRequestReply) {
          if (mostRecentMessage) {
            if (mostRecentMessage.sentBy === 'agent') {
              if (writingState.status !== 'writing') {
                generateButtonType = 'regenerate';
              }
            } else if (writingState.status === 'error') {
              generateButtonType = 'retry';
            }
          }
        } else {
          if (mostRecentMessage) {
            if (mostRecentMessage.sentBy === 'agent') {
              if (writingState.status !== 'writing') {
                generateButtonType = 'regenerate';
              }
            } else {
              if (writingState.status === 'error') {
                generateButtonType = 'retry';
              } else if (writingState.status === 'nil') {
                generateButtonType = 'generate';
              }
            }
          }
        }

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

            <div
              css={css`
                width: 100%;
                position: relative;
              `}>
              <ChatSection
                agentName={agent.name}
                layout="boxes"
                messageGroups={messageGroups}
                onClickPrevious={(depth, activeIndex) => {
                  setActiveIndex(interaction.id, depth, activeIndex - 1);
                }}
                onClickNext={(depth, activeIndex) => {
                  setActiveIndex(interaction.id, depth, activeIndex + 1);
                }}
                writingStatus={writingStatus}
              />
              {generateButtonType && (
                <div
                  css={css`
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 50px;
                  `}>
                  <button
                    onClick={() =>
                      handleRequestAnswer(
                        interaction.id,
                        generateButtonType === 'regenerate' ? mostRecentMessage?.parentId : mostRecentMessage?.id
                      )
                    }
                    css={css`
                      display: flex;
                      border: 1px solid ${colors.gray[700]};
                      align-items: center;
                      color: ${colors.gray[100]};
                      background-color: ${colors.gray[800]};
                      outline: none;
                      cursor: pointer;
                      padding-top: 6px;
                      padding-bottom: 6px;
                      padding-left: 16px;
                      padding-right: 16px;
                      border-radius: 4px;

                      margin-top: 10px;
                      margin-bottom: 10px;
                      margin-left: auto;
                      margin-right: auto;

                      &:hover {
                        background-color: ${colors.gray[700]};
                      }
                    `}>
                    {generateButtonType === 'generate' ? <BoltIcon /> : <RetryIcon />}
                    <span
                      css={css`
                        margin-left: 10px;
                      `}>
                      {generateButtonType === 'generate'
                        ? 'Generate answer'
                        : generateButtonType === 'regenerate'
                        ? 'Regenerate answer'
                        : 'Retry'}
                    </span>
                  </button>
                </div>
              )}
            </div>

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

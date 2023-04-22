/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import type { Proficient } from '@proficient/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { ProficientThemeContext, createTheme } from '../../context';
import { InteractionTree } from '../../ds/InteractionTree';
import { useApi, useTheme } from '../../hooks';
import { Layout } from '../Layout';
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
import { useActiveIndexes } from './useActiveIndexes';
import { useTextInputMap } from './useTextInputMap';

const PROVISIONAL_MESSAGE_ID = '_msg_provisional';
const HEADER_SECTION_HEIGHT = 54;
const INPUT_SECTION_HEIGHT = 160;

function EmptyStateView({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-family: Inter, sans-serif;
        font-size: 14px;
        color: ${theme.colors.textSecondary};
      `}>
      {text}
    </div>
  );
}

export function InteractionView({
  apiKey,
  agentId,
  userExternalId,
  userHmac,
  layout = 'natural',
  height = 600,
  autoRequestReply = true,
  sendOnEnter = true,
  inputPlaceholder = 'Type something...',
  theme = createTheme(),
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
      } catch (e: any) {
        console.error('Cannot load interactions for agent', agentId);
        console.log(e?.message);
      }
    })();
  }, [agentId, getApi]);

  const loadMessages = useCallback(
    async (interactionId: string) => {
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
      } catch (e: any) {
        console.error('Error loading messages!');
        console.log(e?.message);
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
    if (!content) return;
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
      alert('Could not send the message due to an unknown error. Please try again later.');
      console.log(`Api Error: ${e?.response?.data?.message}`);
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
    } catch (e: any) {
      alert('Could not create interaction. Please try again later.');
      console.error('Cannot create interaction', e.message);
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
      } catch (e: any) {
        alert('Cannot update interaction. Please try again later.');
        console.log('Cannot update interaction', e.message);
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

  const isMd = useMediaQuery({
    query: `(min-width: 768px)`,
  });

  return (
    <ProficientThemeContext.Provider value={theme}>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        `}
      />
      {(() => {
        if (agentState?.status !== 'success') {
          return (
            <div
              css={css`
                background-color: ${theme.colors.backgroundPrimary};
                height: ${height}px;
              `}>
              <EmptyStateView text={agentState.status === 'error' ? 'Agent not found' : 'Loading agent...'} />;
            </div>
          );
        }

        return (
          <Layout
            version={isMd ? 'lg' : 'sm'}
            height={height}
            headerContent={
              interactionState?.status === 'success' ? (
                <HeaderSection
                  onClickDelete={() => handleDeleteInteraction(interactionState.interaction.id)}
                  onTitleBlur={async (text) => {
                    if (interactionState.interaction.name !== text) {
                      await handleUpdateInteraction(text);
                    }
                  }}
                  title={interactionState.interaction.name}
                />
              ) : null
            }
            headerHeight={HEADER_SECTION_HEIGHT}
            sidebarContent={
              <SidebarSection
                height={height}
                description={agentState.agent.description}
                header={agentState.agent.name}
                interactions={sortedInteractions}
                isSelectedInteraction={(i) => i.id === interactionId}
                onClickInteraction={(i) => {
                  selectInteraction(i.id);
                }}
                onClickNewInteraction={handleCreateInteraction}
              />
            }
            sidebarInitialWidth={300}
            sidebarMinWidth={200}
            sidebarMaxWidth={400}
            sidebarResizerWidth={8}>
            {() => {
              if (!interactionState || !messagesState || !writingState) {
                return <EmptyStateView text="No selected interaction" />;
              }
              if (messagesState.status === 'error') {
                return <EmptyStateView text="Error loading messages" />;
              }
              if (interactionState.status === 'error') {
                return <EmptyStateView text="Error loading interaction" />;
              }
              if (interactionState.status === 'loading') {
                return <EmptyStateView text="Loading interaction..." />;
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
                <div>
                  <div
                    css={css`
                      position: relative;
                    `}>
                    <ChatSection
                      height={height - HEADER_SECTION_HEIGHT - INPUT_SECTION_HEIGHT}
                      agentName={agentState?.status === 'success' ? agentState.agent.name : '...'}
                      layout={layout}
                      messageGroups={messageGroups}
                      onClickPrevious={(depth, activeIndex) => {
                        setActiveIndex(interaction.id, depth, activeIndex - 1);
                      }}
                      onClickNext={(depth, activeIndex) => {
                        setActiveIndex(interaction.id, depth, activeIndex + 1);
                      }}
                      writingStatus={writingStatus}
                    />
                  </div>

                  <InputSection
                    generateButtonType={generateButtonType}
                    height={INPUT_SECTION_HEIGHT}
                    onClickGenerate={() =>
                      handleRequestAnswer(
                        interaction.id,
                        generateButtonType === 'regenerate' ? mostRecentMessage?.parentId : mostRecentMessage?.id
                      )
                    }
                    onClickSend={handleSendMessage}
                    onInputChange={(text) => setInteractionInput(interaction.id, text)}
                    placeholder={inputPlaceholder}
                    sendOnEnter={sendOnEnter}
                    textAreaRef={inputTextAreaRef}
                  />
                </div>
              );
            }}
          </Layout>
        );
      })()}
    </ProficientThemeContext.Provider>
  );
}

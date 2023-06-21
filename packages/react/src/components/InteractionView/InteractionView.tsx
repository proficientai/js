/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import type { Proficient } from '@proficient/client-internal';
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

function EmptyStateView({ text, minHeight }: { text: string; minHeight?: number }) {
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
        min-height: ${minHeight}px;
        font-family: Inter, sans-serif;
        font-size: 14px;
        color: ${theme.colors.textSecondary};
      `}>
      {text}
    </div>
  );
}

function validateProps({
  apiKey,
  agentId,
  userExternalId,
  userHmac,
  layout,
  chatSectionHeight,
  headerSectionHeight,
  autoAsk,
  sendOnEnter,
  inputPlaceholder,
  theme,
}: InteractionViewProps) {
  if (typeof apiKey !== 'string') {
    throw new Error(`The 'apiKey' prop must be a string.`);
  }
  if (typeof agentId !== 'string') {
    throw new Error(`The 'agentId' prop must be a string.`);
  }
  if (typeof userExternalId !== 'string') {
    throw new Error(`The 'userExternalId' prop must be a string.`);
  }
  if (userHmac !== undefined && typeof userHmac !== 'string' && typeof userHmac !== 'function') {
    throw new Error(`The 'userHmac' prop must be a string or a function that returns a Promise resolving to a string.`);
  }
  if (layout !== undefined && layout !== 'casual' && layout !== 'formal') {
    throw new Error(`The 'layout' prop must be one of 'casual' and 'formal'.`);
  }
  if (chatSectionHeight !== undefined && (typeof chatSectionHeight !== 'number' || chatSectionHeight < 240)) {
    throw new Error(`The 'chatSectionHeight' prop must be a number greater than or equal to 240.`);
  }
  if (headerSectionHeight !== undefined && (typeof headerSectionHeight !== 'number' || headerSectionHeight < 54)) {
    throw new Error(`The 'headerSectionHeight' prop must be a number greater than or equal to 54.`);
  }
  if (autoAsk !== undefined && typeof autoAsk !== 'boolean') {
    throw new Error(`The 'autoAsk' prop must be a boolean.`);
  }
  if (sendOnEnter !== undefined && typeof sendOnEnter !== 'boolean') {
    throw new Error(`The 'sendOnEnter' prop must be a boolean.`);
  }
  if (inputPlaceholder !== undefined && typeof inputPlaceholder !== 'string') {
    throw new Error(`The 'inputPlaceholder' prop must be a string.`);
  }
  if (theme !== undefined && typeof theme !== 'object') {
    throw new Error(`The 'theme' prop must be an object.`);
  }
}

export function InteractionView(props: InteractionViewProps) {
  const {
    apiKey,
    agentId,
    userExternalId,
    userHmac,
    layout = 'casual',
    chatSectionHeight = 320,
    headerSectionHeight = 54,
    autoAsk = true,
    sendOnEnter = true,
    inputPlaceholder = 'Type something...',
    theme = createTheme(),
  } = props;

  validateProps(props);

  const { getApi } = useApi({ apiKey, userExternalId, userHmac });

  const [inputSectionHeight, setInputSectionHeight] = useState(0);
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
      } catch (e: any) {
        console.log('Error loading agent', e);
        setAgentState({
          status: 'error',
          code: e?.statusCode === 401 ? 'invalid-auth' : e?.statusCode === 404 ? 'not-found' : 'unknown',
        });
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

  useEffect(() => {
    const [firstInteraction] = sortedInteractions;
    if (interactionState === null && firstInteraction) {
      selectInteraction(firstInteraction.id);
    }
  }, [interactionState, sortedInteractions, selectInteraction]);

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

      if (autoAsk) {
        await handleRequestAnswer(interactionId, sent.id);
      }
    } catch (e: any) {
      alert('Could not send the message due to an unknown error. Please try again later.');
      console.log(`Api Error: ${e?.response?.data?.message}`);
    }
  }, [
    autoAsk,
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
      selectInteraction(newInteraction.id);
    } catch (e: any) {
      alert('Could not create interaction. Please try again later.');
      console.error('Cannot create interaction', e.message);
    }
  }, [agentId, getApi, selectInteraction]);

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
      setInteractionInput(interactionId, '');
    },
    [getApi, setInteractionInput]
  );

  const isMd = useMediaQuery({
    query: `(min-width: 768px)`,
  });

  // TODO: The 2 here is due to border widths of the inner elements. Make it dynamic so we don't have to hardcode it.
  const componentHeight = headerSectionHeight + chatSectionHeight + inputSectionHeight + 2;

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
                height: ${componentHeight}px;
              `}>
              <EmptyStateView
                text={
                  agentState.status === 'error'
                    ? agentState.code === 'invalid-auth'
                      ? 'Cannot load agent details due to invalid credentials.'
                      : agentState.code === 'not-found'
                      ? `Cannot find an agent with the id '${agentId}'`
                      : 'An unknown error occurred while loading agent details.'
                    : 'Loading agent...'
                }
              />
              ;
            </div>
          );
        }

        return (
          <Layout
            version={isMd ? 'lg' : 'sm'}
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
            headerHeight={headerSectionHeight}
            sidebarContent={
              <SidebarSection
                height={componentHeight}
                description={agentState.agent.displayDescription}
                header={agentState.agent.displayName}
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
                return (
                  <EmptyStateView
                    text={
                      sortedInteractions.length === 0
                        ? `You have no interactions with ${agentState.agent.displayName || 'the agent'}.`
                        : 'No selected interaction'
                    }
                    minHeight={chatSectionHeight}
                  />
                );
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

              let askButtonType: null | 'ask' | 'ask-again' | 'retry' = null;

              if (autoAsk) {
                if (mostRecentMessage) {
                  if (mostRecentMessage.sentBy === 'agent') {
                    if (writingState.status !== 'writing' && mostRecentMessage.depth > 0) {
                      askButtonType = 'ask-again';
                    }
                  } else if (writingState.status === 'error' || writingState.status === 'nil') {
                    askButtonType = 'retry';
                  }
                }
              } else {
                if (mostRecentMessage) {
                  if (mostRecentMessage.sentBy === 'agent') {
                    if (writingState.status !== 'writing' && mostRecentMessage.depth > 0) {
                      askButtonType = 'ask-again';
                    }
                  } else {
                    if (writingState.status === 'error') {
                      askButtonType = 'retry';
                    } else if (writingState.status === 'nil') {
                      askButtonType = 'ask';
                    }
                  }
                }
              }

              const isAgentInactive = agentState.status === 'success' && !agentState.agent.active;

              return (
                <>
                  <ChatSection
                    height={chatSectionHeight}
                    agentName={agentState.status === 'success' ? agentState.agent.displayName : '...'}
                    agentInactive={isAgentInactive}
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

                  <InputSection
                    agentInactive={isAgentInactive}
                    askButtonType={isAgentInactive ? null : askButtonType}
                    onClickAsk={() =>
                      handleRequestAnswer(
                        interaction.id,
                        askButtonType === 'ask-again' ? mostRecentMessage?.parentId : mostRecentMessage?.id
                      )
                    }
                    onClickSend={handleSendMessage}
                    onChangeHeight={setInputSectionHeight}
                    sendDisabled={writingState.status !== 'nil' || isAgentInactive}
                    onInputChange={(text) => setInteractionInput(interaction.id, text)}
                    placeholder={inputPlaceholder}
                    sendOnEnter={sendOnEnter}
                    textAreaRef={inputTextAreaRef}
                  />
                </>
              );
            }}
          </Layout>
        );
      })()}
    </ProficientThemeContext.Provider>
  );
}

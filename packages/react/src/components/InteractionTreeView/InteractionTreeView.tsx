/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import type { Proficient } from '@proficient/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { InteractionTree } from '../../ds/InteractionTree';
import { InteractionTree2 } from '../../ds/InteractionTree2';
import { useApi } from '../../hooks';
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
      const tree = InteractionTree2.create(messagesState.messageMap);
      tree.traverseFromRoot(
        (depth) => getActiveIndex(interactionId, depth),
        (message, currentIndex, depth, groupSize) => {
          if (!message) {
            throw new Error('Implementation Error: The tree has been constructed with an incomplete dataset. ');
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

  const handleRequestAnswer = useCallback(async (interactionId: string, lastMessage?: Proficient.Message) => {
    //
  }, []);

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
      const { [interactionId]: prevMessagesState, ...rest } = prev;
      const newMessageMap = new Map(prevMessagesState?.messageMap);
      newMessageMap.set(PROVISIONAL_MESSAGE_ID, {
        id: PROVISIONAL_MESSAGE_ID,
        depth: Number.MAX_SAFE_INTEGER, // TODO: See if this breaks anything
        content,
        createdAt: Date.now(),
        interactionId,
        object: 'message',
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
    const [firstMessageGroup] = messageGroups;
    const parentId = firstMessageGroup?.id;
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
        await handleRequestAnswer(interactionId, sent);
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
    messageGroups,
    setInteractionInput,
    setTextAreaValue,
  ]);

  const handleCreateInteraction = useCallback(async () => {}, []);
  const handleUpdateInteraction = useCallback(async (name: string) => {}, []);
  const handleDeleteInteraction = useCallback(async () => {}, []);

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

        return (
          <div
            css={css`
              width: 100%;
            `}>
            <HeaderSection
              onClickDelete={handleDeleteInteraction}
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
              layout="boxes"
              messageGroups={messageGroups}
              onClickPrevious={(depth, activeIndex) => {
                setActiveIndex(interaction.id, depth, activeIndex - 1);
              }}
              onClickNext={(depth, activeIndex) => {
                setActiveIndex(interaction.id, depth, activeIndex + 1);
              }}
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

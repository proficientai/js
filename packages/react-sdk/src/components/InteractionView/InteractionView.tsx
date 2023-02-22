import type { Agent, ClientApi, Message } from '@proficient/api';
import axios from 'axios';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextareaAutosize from 'react-textarea-autosize';

import { useKeyboardEnterEvent } from '../../hooks';
import { db } from './mockDB';
import type { InteractionViewProps } from './types';

export function InteractionView({
  apiKey,
  agentId,
  userExternalId,
  userHmac,
  inputPlaceholder = 'Type something...',
  contentMaxLength = 500,
}: InteractionViewProps) {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const oldestMessageId = React.useRef<string | undefined>(undefined);
  const [messageMap, setMessageMap] = React.useState<Record<string, Message>>({});
  const [hasMore, setHasMore] = React.useState(true);
  const cachedHmacRef = React.useRef<undefined | string>(undefined);

  const getCachedHmac = React.useCallback(async () => {
    if (!cachedHmacRef.current) {
      cachedHmacRef.current = typeof userHmac === 'function' ? await userHmac() : userHmac;
    }
    return cachedHmacRef.current;
  }, [userHmac]);

  const getAxiosInstance = React.useCallback(
    (hmac: string | undefined) => {
      return axios.create({
        baseURL: 'http://localhost:8080/client', // TODO: Update
        headers: {
          'Content-Type': 'application/json',
          'X-PROFICIENT-API-KEY': apiKey,
          'X-PROFICIENT-USER-EXTERNAL-ID': userExternalId,
          'X-PROFICIENT-USER-HMAC': hmac,
        },
      });
    },
    [apiKey, userExternalId]
  );

  const loadNextBatch = React.useCallback(async () => {
    try {
      const cachedHmac = await getCachedHmac();
      const axiosInstance = getAxiosInstance(cachedHmac);
      const { data: agent } = await axiosInstance.get<Agent>(`/agents/${agentId}`);
      const {
        data: { data: interactions },
      } = await axiosInstance.get<ClientApi.ResponseBody<'GetAgentsAgentInteractions'>>(
        `/agents/${agentId}/interactions`
      );
      console.log('AGENT:', agent);
      console.log('INTERACTIONS:', interactions);
      const { messages: receivedMessages, hasMore: hasMoreNext } = await db.getMessages(20, oldestMessageId.current);
      setMessageMap((prev) => {
        const next = { ...prev };
        receivedMessages.forEach((m) => {
          const message = next[m.id];
          if (!message) {
            next[m.id] = m;
          }
        });
        return next;
      });
      setHasMore(hasMoreNext);
      const oldestMessage = receivedMessages.length > 0 ? receivedMessages[receivedMessages.length - 1] : undefined;
      oldestMessageId.current = oldestMessage?.id;
    } catch (e: any) {
      console.log('Unexpected Error in Load Batch:', e.message);
    }
  }, [agentId, getAxiosInstance, getCachedHmac]);

  React.useEffect(() => {
    loadNextBatch();
  }, [loadNextBatch]);

  const handleSendMessage = React.useCallback(async () => {
    if (!textAreaRef.current) return;
    const content = textAreaRef.current.value;
    if (!content) return;
    const cachedHmac = await getCachedHmac();
    const axiosInstance = getAxiosInstance(cachedHmac);
    const body: ClientApi.RequestBody<'PostAgentsAgentInteractionsMessage'> = {
      content,
    };
    const { data: sentMessage } = await axiosInstance.post<
      ClientApi.ResponseBody<'PostAgentsAgentInteractionsMessage'>
    >(`/agents/${agentId}/interactions/message`, body);
    setMessageMap((prev) => ({ ...prev, [sentMessage.id]: sentMessage }));
    textAreaRef.current.value = '';
    // const reply = await replyPromise;
    // setMessageMap((prev) => ({ ...prev, [reply.id]: reply }));
  }, [getAxiosInstance, getCachedHmac, agentId]);

  useKeyboardEnterEvent(handleSendMessage);

  const messages = (() => {
    const arr: Array<Message> = [];
    Object.keys(messageMap).forEach((id) => {
      const message = messageMap[id];
      arr.push(message);
    });
    arr.sort((a, b) => b.created_at - a.created_at);
    return arr;
  })();

  return (
    <div style={{ border: '1px solid gray' }}>
      <InfiniteScroll
        dataLength={messages.length}
        next={loadNextBatch}
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          paddingLeft: 20,
          paddingRight: 20,
        }}
        inverse
        hasMore={hasMore}
        height={400}
        loader={<p style={{ textAlign: 'center' }}>Loading...</p>}
        endMessage={<p style={{ textAlign: 'center' }}>This marks the beginning of the interaction.</p>}>
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              style={{
                marginLeft: message.sent_by === 'agent' ? 0 : 'auto',
                padding: 10,
                border: '1px solid rgb(235, 235, 235)',
                backgroundColor: message.sent_by === 'agent' ? 'rgb(250, 250, 250)' : 'rgb(41, 87, 255)',
                color: message.sent_by === 'agent' ? 'black' : 'white',
                borderRadius: 10,
                marginBottom: 10,
                width: 'fit-content',
                maxWidth: '75ch',
                whiteSpace: 'pre-wrap',
              }}>
              {message.content}
            </div>
          );
        })}
      </InfiniteScroll>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: 'hsl(220, 30%, 80%)',
        }}>
        <TextareaAutosize
          ref={textAreaRef}
          maxLength={contentMaxLength}
          placeholder={inputPlaceholder}
          style={{
            width: '100%',
            overflowY: 'hidden',
            resize: 'none',
            marginBottom: 0,
          }}
          minRows={3}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

import axios from 'axios';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextareaAutosize from 'react-textarea-autosize';

import { useKeyboardEnterEvent } from '../../hooks';
import type { Message } from '../../types';
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

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/client', // TODO: Update
    headers: {
      'Content-Type': 'application/json',
      'X-PROFICIENT-API-KEY': apiKey,
      'X-PROFICIENT-USER-EXTERNAL-ID': userExternalId,
      'X-PROFICIENT-USER-HMAC': userHmac,
    },
  });

  React.useEffect(() => {
    (async () => {
      console.log(`Fetching Agent: ${agentId}`);
      // TODO: Should import from api package
      interface Agent {
        [key: string]: any;

        id: string;
        object: 'agent';
        active: boolean;
        name: string | null;
        description: string;
        created_at: number;
        updated_at: number;
      }
      try {
        const { data: agent } = await axiosInstance.get<Agent>(`/agents/${agentId}`);
        console.log('SUCCESS:', agent);
      } catch (err: any) {
        console.log('ERROR:', err?.response?.data);
      }
    })();
  }, [axiosInstance, agentId]);

  const loadNextBatch = React.useCallback(async () => {
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
  }, []);

  React.useEffect(() => {
    loadNextBatch();
  }, [loadNextBatch]);

  const handleSendMessage = React.useCallback(async () => {
    if (!textAreaRef.current) return;
    const content = textAreaRef.current.value;
    if (!content) return;
    const { sentMessage, replyPromise } = await db.sendMessage(content);
    setMessageMap((prev) => ({ ...prev, [sentMessage.id]: sentMessage }));
    textAreaRef.current.value = '';
    const reply = await replyPromise;
    setMessageMap((prev) => ({ ...prev, [reply.id]: reply }));
  }, []);

  useKeyboardEnterEvent(handleSendMessage);

  const messages = (() => {
    const arr: Array<Message> = [];
    Object.keys(messageMap).forEach((id) => {
      const message = messageMap[id];
      arr.push(message);
    });
    arr.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
                marginLeft: message.fromAgent ? 0 : 'auto',
                padding: 10,
                border: '1px solid rgb(235, 235, 235)',
                backgroundColor: message.fromAgent ? 'rgb(250, 250, 250)' : 'rgb(41, 87, 255)',
                color: message.fromAgent ? 'black' : 'white',
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

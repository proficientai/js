import type { Message } from '@proficient/api';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextareaAutosize from 'react-textarea-autosize';

import { ClientApi } from '../../api';
import { useKeyboardEnterEvent } from '../../hooks';
import type { InteractionViewProps } from './types';

const paginationLimit = 20; // TODO: Make dynamic

export function InteractionView({
  apiKey,
  interactionId,
  userExternalId,
  userHmac,
  inputPlaceholder = 'Type something...',
  contentMaxLength = 500,
}: InteractionViewProps) {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const oldestMessageId = React.useRef<string | undefined>(undefined);
  const lastAttemptedBatchId = React.useRef<null | undefined | string>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const cachedHmacRef = React.useRef<undefined | string>(undefined);

  const getClientApi = React.useCallback(async () => {
    if (!cachedHmacRef.current) {
      cachedHmacRef.current = typeof userHmac === 'function' ? await userHmac() : userHmac;
    }
    return new ClientApi({ apiKey, userExternalId, userHmac: cachedHmacRef.current });
  }, [apiKey, userExternalId, userHmac]);

  const loadNextBatch = React.useCallback(async () => {
    try {
      const api = await getClientApi();
      if (lastAttemptedBatchId.current === oldestMessageId.current) return;
      lastAttemptedBatchId.current = oldestMessageId.current;
      const { data: receivedMessages, has_more: hasMore } = await api.getMessages({
        interaction_id: interactionId,
        limit: paginationLimit,
        starting_after: oldestMessageId.current,
      });
      setMessages((prev) => [...prev, ...receivedMessages]);
      setHasMore(hasMore);
      const oldestMessage = receivedMessages.length > 0 ? receivedMessages[receivedMessages.length - 1] : undefined;
      oldestMessageId.current = oldestMessage?.id;
    } catch (e: any) {
      // TODO: Handle properly
      console.log('Unexpected Error in Load Batch:', e.message);
      console.log(e.response.data);
    }
  }, [getClientApi, interactionId]);

  React.useEffect(() => {
    loadNextBatch();
  }, [loadNextBatch]);

  const handleSendMessage = React.useCallback(async () => {
    if (!textAreaRef.current) return;
    const content = textAreaRef.current.value;
    if (!content) return;

    setMessages((prev) => [
      {
        id: 'provisional',
        index: -1,
        content,
        created_at: Date.now(),
        interaction_id: interactionId,
        object: 'message',
        sent_by: 'user',
      },
      ...prev,
    ]);
    textAreaRef.current.value = '';

    const api = await getClientApi();
    const [firstMessage] = messages;
    const parentId = firstMessage?.id ?? null;
    const { received, sent } = await api.createMessage({
      content,
      interaction_id: interactionId,
      parent_id: parentId,
    });
    setMessages((prev) => {
      const next = [...prev];
      const provisionalMessageIndex = prev.findIndex((m) => m.id === 'provisional');
      if (provisionalMessageIndex !== -1) {
        next[provisionalMessageIndex] = sent;
      }
      next.unshift(received);
      return next;
    });
  }, [getClientApi, interactionId, messages]);

  useKeyboardEnterEvent(handleSendMessage);

  console.log('Messages:', messages);

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

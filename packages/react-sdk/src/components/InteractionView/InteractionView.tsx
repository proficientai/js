import * as React from "react";
import { useKeyboardEnterEvent } from "../../hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import type { Message } from "../../types";
import { db } from "./mockDB";
import type { InteractionViewProps } from "./types";

export function InteractionView({
  apiKey,
  userId,
  inputPlaceholder = "Type something...",
  contentMaxLength = 500,
}: InteractionViewProps) {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const oldestMessageId = React.useRef<string | undefined>(undefined);
  const [messageMap, setMessageMap] = React.useState<Record<string, Message>>(
    {}
  );

  const loadNextBatch = React.useCallback(async () => {
    const receivedMessages = await db.getMessages(20, oldestMessageId.current);
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
    const oldestMessage =
      receivedMessages.length > 0
        ? receivedMessages[receivedMessages.length - 1]
        : undefined;
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
    textAreaRef.current.value = "";
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
    <div style={{ border: "1px solid gray" }}>
      <InfiniteScroll
        dataLength={messages.length}
        next={loadNextBatch}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        inverse
        hasMore={true}
        height={400}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              style={{
                marginLeft: message.fromAgent ? 0 : "auto",
                padding: 10,
                border: "1px solid rgb(235, 235, 235)",
                backgroundColor: "rgb(250, 250, 250)",
                borderRadius: 10,
                marginBottom: 10,
                width: "fit-content",
                maxWidth: "75ch",
              }}
            >
              {message.content}
            </div>
          );
        })}
      </InfiniteScroll>

      <div
        style={{
          display: "flex",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 10,
          backgroundColor: "transparent",
        }}
      >
        <textarea
          ref={textAreaRef}
          placeholder={inputPlaceholder}
          maxLength={contentMaxLength}
          style={{ width: "100%" }}
        />
        <button onClick={handleSendMessage}>Send message</button>
      </div>
    </div>
  );
}

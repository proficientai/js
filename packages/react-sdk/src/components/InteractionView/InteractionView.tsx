import * as React from "react";
import { useKeyboardEnterEvent } from "../../hooks";

import type { InteractionViewProps } from "./types";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
};

export function InteractionView({
  apiKey,
  userId,
  inputPlaceholder = "Type something...",
  contentMaxLength = 500,
}: InteractionViewProps) {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const handleSendMessage = React.useCallback(async () => {
    if (!textAreaRef.current) return;
    const content = textAreaRef.current.value;
    if (!content) return;
    setMessages((prev) => {
      const clone = [...prev];
      clone.unshift({
        id: Date.now().toString(),
        content,
        createdAt: new Date(),
      });
      return clone;
    });
    textAreaRef.current.value = "";
  }, []);

  useKeyboardEnterEvent(handleSendMessage);

  return (
    <div style={{ border: "1px solid gray" }}>
      <div style={{ overflow: "scroll", maxHeight: 400, padding: 20, backgroundColor: 'pink' }}>
        {messages
          .map((message) => {
            return (
              <div
                key={message.id}
                style={{
                  marginLeft: 'auto',
                  padding: 10,
                  border: "1px solid rgb(235, 235, 235)",
                  backgroundColor: "rgb(250, 250, 250)",
                  borderRadius: 10,
                  marginBottom: 10,
                  width: 'fit-content',
                  maxWidth: "75ch",
                }}
              >
                {message.content}
              </div>
            );
          })
          .reverse()}
      </div>

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

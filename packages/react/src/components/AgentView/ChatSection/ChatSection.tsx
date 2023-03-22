/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import type { ChatSectionProps } from './types';

export function ChatSection({ hasMore, messages, next }: ChatSectionProps) {
  return (
    <InfiniteScroll
      dataLength={messages.length}
      next={next}
      css={css`
        display: flex;
        flex-direction: column-reverse;
        padding-left: 20px;
        padding-right: 20px;
      `}
      inverse
      hasMore={hasMore}
      height={400}
      loader={
        <div
          css={css`
            text-align: center;
          `}>
          Loading...
        </div>
      }
      endMessage={
        <div
          css={css`
            text-align: center;
            padding: 10px;
            margin-bottom: 10px;
            margin-top: 10px;
            color: #444;
            font-size: 14px;
          `}>
          This marks the beginning of the interaction.
        </div>
      }>
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            css={css`
              padding: 10px;
              border-radius: 10px;
              margin-bottom: 10px;
              margin-left: ${message.sent_by === 'agent' ? 0 : 'auto'};
              width: fit-content;
              max-width: 75ch;
              white-space: pre-wrap;
              border: 1px solid rgb(235, 235, 235);
              background-color: ${message.sent_by === 'agent' ? 'rgb(250, 250, 250)' : 'rgb(41, 87, 255)'};
              color: ${message.sent_by === 'agent' ? 'black' : 'white'};
            `}>
            {message.content}
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

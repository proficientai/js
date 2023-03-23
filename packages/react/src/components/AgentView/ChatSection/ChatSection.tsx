/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { colors } from '../../../styles';
import type { ChatSectionProps } from './types';

export function ChatSection({ hasMore, messages, next }: ChatSectionProps) {
  return (
    <InfiniteScroll
      dataLength={messages.length}
      next={next}
      css={css`
        background-color: ${colors.gray[800]};
        display: flex;
        flex-direction: column-reverse;
        padding-left: 24px;
        padding-right: 24px;
      `}
      inverse
      hasMore={hasMore}
      height={400}
      loader={
        <div
          css={css`
            text-align: center;
            color: ${colors.gray[500]};
            font-size: 14px;
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
            color: ${colors.gray[500]};
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
              border-radius: 16px;
              margin-bottom: 12px;
              margin-left: ${message.sent_by === 'agent' ? 0 : 'auto'};
              width: fit-content;
              max-width: 60ch;
              white-space: pre-wrap;
              background-color: ${message.sent_by === 'agent' ? colors.gray[700] : colors.indigo[600]};
              color: ${colors.gray[100]};
            `}>
            {message.content}
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

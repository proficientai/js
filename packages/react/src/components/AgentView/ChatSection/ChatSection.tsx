/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { colors } from '../../../styles';
import { RetryIcon } from '../../icons/RetryIcon';
import type { ChatSectionProps } from './types';

export function ChatSection({
  agentName,
  hasMore,
  messages,
  next,
  onClickRequestAnswer,
  writingStatus,
}: ChatSectionProps) {
  const [lastMessage] = messages;
  const canRequestAnswer = lastMessage?.sent_by === 'user';

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
            font-family: Inter, sans-serif;
            font-size: 14px;
          `}>
          This marks the beginning of the interaction.
        </div>
      }>
      <div
        css={css`
          margin-top: 10px;
          margin-bottom: 6px;
        `}>
        {(() => {
          if (writingStatus === 'writing') {
            return (
              <span
                css={css`
                  text-align: center;
                  color: ${colors.gray[500]};
                  font-family: Inter, sans-serif;
                  font-size: 13px;
                `}>
                {agentName} is writing...
              </span>
            );
          }

          if (canRequestAnswer) {
            return (
              <button
                onClick={onClickRequestAnswer}
                css={css`
                  display: flex;
                  border: 1px solid ${colors.gray[700]};
                  align-items: center;
                  color: ${colors.gray[100]};
                  background-color: ${colors.gray[800]};
                  outline: none;
                  cursor: pointer;
                  padding-top: 6px;
                  padding-bottom: 6px;
                  padding-left: 16px;
                  padding-right: 16px;
                  border-radius: 4px;

                  margin-top: 10px;
                  margin-bottom: 10px;
                  margin-left: auto;
                  margin-right: auto;

                  &:hover {
                    background-color: ${colors.gray[700]};
                  }
                `}>
                <RetryIcon />
                <span
                  css={css`
                    margin-left: 10px;
                  `}>
                  Request answer
                </span>
              </button>
            );
          }
        })()}
      </div>
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
              font-family: Inter, sans-serif;
              font-size: 14px;
            `}>
            {message.content}
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { colors } from '../../../styles';
import type { ChatSectionProps } from './types';

export function ChatSection({
  agentName,
  hasMore,
  layout,
  messageGroups,
  next,
  onClickNext,
  onClickPrevious,
  writingStatus,
}: ChatSectionProps) {
  return (
    <InfiniteScroll
      dataLength={messageGroups.length}
      next={next ?? (() => {})}
      css={css`
        background-color: ${colors.gray[800]};
        display: flex;
        flex-direction: column-reverse;
        padding-left: ${layout === 'bubbles' ? '24px' : undefined};
        padding-right: ${layout === 'bubbles' ? '24px' : undefined};
        padding-bottom: 40px;
      `}
      inverse
      hasMore={!!hasMore}
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
        })()}
      </div>
      {messageGroups.map((messageGroup) => {
        const { id, current: message, size: groupSize, currentIndex } = messageGroup;
        if (layout === 'bubbles') {
          return (
            <div
              key={id}
              css={css`
                padding: 10px;
                border-radius: 16px;
                margin-bottom: 12px;
                margin-left: ${message.sentBy === 'agent' ? 0 : 'auto'};
                width: fit-content;
                max-width: 60ch;
                white-space: pre-wrap;
                background-color: ${message.sentBy === 'agent' ? colors.gray[700] : colors.indigo[600]};
                color: ${colors.gray[100]};
                font-family: Inter, sans-serif;
                font-size: 14px;
              `}>
              {message.content}
            </div>
          );
        }
        return (
          <div
            key={id}
            css={css`
              padding-left: 34px;
              padding-right: 34px;
              padding-top: 24px;
              padding-bottom: 24px;
              white-space: pre-wrap;
              background-color: ${message.sentBy === 'agent' ? colors.gray[800] : colors.gray[900]};
            `}>
            <div
              key={id}
              css={css`
                display: flex;
                flex-direction: row;
              `}>
              <div
                css={css`
                  color: ${colors.gray[500]};
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                  margin-right: 10px;
                `}>
                {message.sentBy === 'agent' ? agentName : 'You'}
              </div>
              <div
                css={css`
                  color: ${colors.gray[100]};
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                `}>
                {message.content}
              </div>
            </div>
            {groupSize > 1 && (
              <div
                css={css`
                  display: flex;
                  color: ${colors.gray[100]};
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                  margin-top: 12px;
                `}>
                {/* TODO: Improve designs */}
                <button onClick={() => onClickPrevious?.(message.depth, currentIndex)} disabled={currentIndex === 0}>
                  {'<'}
                </button>
                <span
                  css={css`
                    margin-left: 6px;
                    margin-right: 6px;
                  `}>
                  {currentIndex + 1} / {groupSize}
                </span>
                <button
                  onClick={() => onClickNext?.(message.depth, currentIndex)}
                  disabled={currentIndex === groupSize - 1}>
                  {'>'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

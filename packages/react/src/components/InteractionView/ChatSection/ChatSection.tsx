/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useTheme } from '../../../hooks';
import { TertiaryButton } from '../../TertiaryButton';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../../icons/ChevronRightIcon';
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
  const theme = useTheme();

  return (
    <InfiniteScroll
      dataLength={messageGroups.length}
      next={next ?? (() => {})}
      css={css`
        background-color: ${theme.colors.backgroundPrimary};
        display: flex;
        flex-direction: column-reverse;
        padding-left: ${layout === 'natural' ? '24px' : undefined};
        padding-right: ${layout === 'natural' ? '24px' : undefined};
        padding-bottom: 50px;
      `}
      inverse
      hasMore={!!hasMore}
      height={400} // TODO: Make dynamic
      loader={
        <div
          css={css`
            text-align: center;
            color: ${theme.colors.textSecondary};
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
            color: ${theme.colors.textSecondary};
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
          padding-left: ${layout === 'tree' ? '24px' : undefined};
          padding-right: ${layout === 'tree' ? '24px' : undefined};
        `}>
        {(() => {
          if (writingStatus === 'writing') {
            return (
              <span
                css={css`
                  text-align: center;
                  color: ${theme.colors.textSecondary};
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
        if (layout === 'natural') {
          return (
            <div
              key={id}
              css={css`
                padding: 12px;
                border-radius: 16px;
                margin-bottom: 12px;
                margin-left: ${message.sentBy === 'agent' ? 0 : 'auto'};
                width: fit-content;
                max-width: 60ch;
                white-space: pre-wrap;
                background-color: ${message.sentBy === 'agent' ? theme.colors.hoverActive : theme.colors.primary};
                color: ${theme.colors.textPrimary};
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
              padding-left: 24px;
              padding-right: 24px;
              padding-top: 24px;
              padding-bottom: 24px;
              white-space: pre-wrap;
              &:hover {
                background-color: ${theme.colors.hover};
              }
            `}>
            <div
              key={id}
              css={css`
                display: flex;
                flex-direction: row;
              `}>
              <div
                css={css`
                  color: ${theme.colors.textSecondary};
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                  min-width: 60px;
                  max-width: 60px;
                  margin-right: 10px;
                  text-align: right;
                `}>
                {message.sentBy === 'agent' ? agentName : 'Me'}
              </div>
              <div
                css={css`
                  color: ${theme.colors.textPrimary};
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
                  align-items: center;
                  color: ${theme.colors.textPrimary};
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                  margin-top: 12px;
                `}>
                <TertiaryButton
                  onClick={() => onClickPrevious?.(message.depth, currentIndex)}
                  disabled={currentIndex === 0}>
                  <ChevronLeftIcon />
                </TertiaryButton>
                <span
                  css={css`
                    margin-left: 6px;
                    margin-right: 6px;
                  `}>
                  {currentIndex + 1} / {groupSize}
                </span>
                <TertiaryButton
                  onClick={() => onClickNext?.(message.depth, currentIndex)}
                  disabled={currentIndex === groupSize - 1}>
                  <ChevronRightIcon />
                </TertiaryButton>
              </div>
            )}
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

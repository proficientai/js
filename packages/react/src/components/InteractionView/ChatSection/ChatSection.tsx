/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useStyles, useTheme } from '../../../hooks';
import { TertiaryButton } from '../../TertiaryButton';
import { ChevronLeftIcon } from '../../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../../icons/ChevronRightIcon';
import type { ChatSectionProps } from './types';

export function ChatSection({
  loading,
  height,
  agentName,
  agentInactive,
  hasMore,
  layout,
  messageGroups,
  next,
  onClickNext,
  onClickPrevious,
  writingStatus,
}: ChatSectionProps) {
  const theme = useTheme();
  const { secondaryTextCss } = useStyles();

  return (
    <InfiniteScroll
      dataLength={messageGroups.length}
      next={next ?? (() => {})}
      css={css`
        background-color: ${theme.colors.backgroundPrimary};
        display: flex;
        flex-direction: column-reverse;
        padding-left: ${layout === 'casual' ? '24px' : undefined};
        padding-right: ${layout === 'casual' ? '24px' : undefined};
      `}
      inverse
      hasMore={!!hasMore}
      height={height}
      loader={
        <div
          css={css`
            text-align: center;
            font-family: Inter, sans-serif;
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
      {loading && (
        <div
          css={css`
            text-align: center;
            margin-bottom: 24px;
            color: ${theme.colors.textSecondary};
            font-family: Inter, sans-serif;
            font-size: 14px;
          `}>
          Loading messages...
        </div>
      )}

      <div
        css={css`
          margin-top: 10px;
          margin-bottom: ${agentInactive || writingStatus === 'writing' ? '24px' : '6px'};
          padding-left: ${layout === 'formal' ? '24px' : undefined};
          padding-right: ${layout === 'formal' ? '24px' : undefined};
        `}>
        {(() => {
          if (agentInactive) {
            return (
              <div
                css={css`
                  text-align: center;
                  color: ${theme.colors.textSecondary};
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                `}>
                {agentName || 'The agent'} is currently not active and cannot respond to messages.
              </div>
            );
          }
          if (writingStatus === 'writing') {
            return (
              <div
                css={css`
                  color: ${theme.colors.textSecondary};
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                `}>
                {agentName || 'Agent'} is writing...
              </div>
            );
          }
        })()}
      </div>

      {messageGroups.map((messageGroup) => {
        const { id, current: message, size: groupSize, currentIndex } = messageGroup;

        const chevronButtons = (
          <div
            css={css`
              display: flex;
              align-items: center;
              color: ${theme.colors.textPrimary};
              font-family: Inter, sans-serif;
              font-size: 14px;
              margin-top: ${layout === 'formal' ? '12px' : 0};
            `}>
            <TertiaryButton
              onClick={() => onClickPrevious?.(message.depth, currentIndex)}
              disabled={currentIndex === 0}
              style={{
                paddingLeft: 0,
                paddingRight: 3,
              }}>
              <ChevronLeftIcon />
            </TertiaryButton>
            <span
              css={css`
                ${secondaryTextCss}
                font-size: 13px;
              `}>
              {currentIndex + 1} / {groupSize}
            </span>
            <TertiaryButton
              onClick={() => onClickNext?.(message.depth, currentIndex)}
              disabled={currentIndex === groupSize - 1}
              style={{
                paddingLeft: 3,
                paddingRight: 0,
              }}>
              <ChevronRightIcon />
            </TertiaryButton>
          </div>
        );

        if (layout === 'casual') {
          return (
            <div
              key={id}
              css={css`
                margin-bottom: 12px;
              `}>
              <div
                css={css`
                  padding: 12px;
                  border-radius: 16px;
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
              {groupSize > 1 && chevronButtons}
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
                  text-align: left;
                  padding-left: 4px;
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
            {groupSize > 1 && chevronButtons}
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

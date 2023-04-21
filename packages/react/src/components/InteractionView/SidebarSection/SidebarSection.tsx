/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useTheme } from '../../../context';
import { boxCss, colors, primaryTextCss, secondaryTextCss } from '../../../styles';
import { InteractionIcon } from '../../icons/InteractionIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import type { SidebarSectionProps } from './types';

export function SidebarSection({
  description,
  header,
  interactions,
  isSelectedInteraction,
  onClickInteraction,
  onClickNewInteraction,
}: SidebarSectionProps) {
  const theme = useTheme();
  return (
    <div
      css={css`
        border-right: 1px solid ${colors.gray[700]};
        background-color: ${theme.colors.background};
      `}>
      <div
        css={css`
          ${boxCss}
          flex-direction: column;
        `}>
        <div css={primaryTextCss}>{header}</div>
        <div
          css={css`
            margin-top: 6px;
            ${secondaryTextCss}
          `}>
          {description}
        </div>
      </div>

      {interactions.length === 0 ? (
        <div
          css={css`
            padding-left: 12px;
            padding-right: 12px;
            min-height: 500px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          `}>
          <button
            onClick={onClickNewInteraction}
            css={css`
              display: flex;
              width: 100%;
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

              &:hover {
                background-color: ${colors.gray[700]};
              }
            `}>
            <PlusIcon />
            <span
              css={css`
                margin-left: 10px;
                white-space: nowrap;
                font-family: Inter, sans-serif;
                font-size: 13px;
              `}>
              Create new interaction
            </span>
          </button>

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
            No interactions.
          </div>
        </div>
      ) : (
        <div
          css={css`
            padding-left: 12px;
            padding-right: 12px;
          `}>
          <button
            onClick={onClickNewInteraction}
            css={css`
              display: flex;
              width: 100%;
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

              &:hover {
                background-color: ${colors.gray[700]};
              }
            `}>
            <PlusIcon />
            <span
              css={css`
                margin-left: 10px;
                white-space: nowrap;
                font-family: Inter, sans-serif;
                font-size: 13px;
              `}>
              Create new interaction
            </span>
          </button>
        </div>
      )}

      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}>
        {interactions.map((i) => {
          return (
            <div
              key={i.id}
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                border-top: 1px solid ${colors.gray[700]};
                padding-top: 12px;
                padding-bottom: 12px;
                padding-left: 12px;
                padding-right: 12px;
                cursor: pointer;
                background-color: ${isSelectedInteraction(i) ? colors.gray[700] : 'transparent'};
                color: ${colors.gray[100]};

                &:hover {
                  background-color: ${colors.gray[700]};
                }
              `}
              onClick={() => onClickInteraction(i)}>
              <InteractionIcon />
              <span
                css={css`
                  margin-left: 10px;
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                  color: ${i.name ? colors.gray[100] : colors.gray[500]};
                `}>
                {i.name || 'New interaction'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

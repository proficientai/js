/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useStyles, useTheme } from '../../../hooks';
import { SecondaryButton } from '../../SecondaryButton';
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
  const { boxCss, primaryTextCss, secondaryTextCss } = useStyles();
  return (
    <div
      css={css`
        border-right: 1px solid ${theme.colors.border};
        background-color: ${theme.colors.primaryBackground};
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
      <div
        css={css`
          padding-left: 12px;
          padding-right: 12px;
        `}>
        <SecondaryButton onClick={onClickNewInteraction} style={{ marginTop: 10, marginBottom: 10 }}>
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
        </SecondaryButton>
      </div>

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
                border-top: 1px solid ${theme.colors.border};
                padding-top: 12px;
                padding-bottom: 12px;
                padding-left: 12px;
                padding-right: 12px;
                cursor: pointer;
                background-color: ${isSelectedInteraction(i) ? theme.colors.primaryBackground : 'transparent'};
                color: ${theme.colors.primaryText};

                &:hover {
                  background-color: ${theme.colors.primaryBackground};
                }
              `}
              onClick={() => onClickInteraction(i)}>
              <InteractionIcon />
              <span
                css={css`
                  margin-left: 10px;
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                  color: ${i.name ? theme.colors.primaryText : theme.colors.secondaryText};
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

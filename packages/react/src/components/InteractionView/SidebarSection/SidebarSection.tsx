/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useStyles, useTheme } from '../../../hooks';
import { SecondaryButton } from '../../SecondaryButton';
import { InteractionIcon } from '../../icons/InteractionIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { ProficientIcon } from '../../icons/ProficientIcon';
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
    <div>
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
          padding-right: 4px;
        `}>
        <SecondaryButton
          onClick={onClickNewInteraction}
          style={{
            width: '100%',
            marginTop: 10,
            marginBottom: 10,
          }}>
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
          padding-left: 8px;
        `}>
        {interactions.map((i) => {
          return (
            <div
              key={i.id}
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                padding-top: 12px;
                padding-bottom: 12px;
                padding-left: 12px;
                padding-right: 12px;
                cursor: pointer;
                background-color: ${isSelectedInteraction(i) ? theme.colors.backgroundPrimary : 'transparent'};
                color: ${theme.colors.textPrimary};

                &:hover {
                  background-color: ${theme.colors.backgroundPrimary};
                }
              `}
              onClick={() => onClickInteraction(i)}>
              <InteractionIcon />
              <span
                css={css`
                  margin-left: 10px;
                  font-family: Inter, sans-serif;
                  font-size: 14px;
                  color: ${i.name ? theme.colors.textPrimary : theme.colors.textSecondary};
                `}>
                {i.name || 'New interaction'}
              </span>
            </div>
          );
        })}
      </div>

      <a
        css={css`
          ${boxCss}
          display: flex;
          align-items: center;
          color: ${theme.colors.watermarkColor};
          text-decoration: none;
        `}
        href="https://proficientai.com">
        <ProficientIcon />

        <div
          css={css`
            font-family: Inter, sans-serif;
            font-size: 13px;
            margin-left: 10px;
          `}>
          <span
            css={css`
              font-size: 10px;
            `}>
            powered by
          </span>
          <br />
          <span
            css={css`
              font-size: 13px;
            `}>
            Proficient AI
          </span>
        </div>
      </a>
    </div>
  );
}

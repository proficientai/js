/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useStyles, useTheme } from '../../../hooks';
import { SecondaryButton } from '../../SecondaryButton';
import { InteractionIcon } from '../../icons/InteractionIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { ProficientIcon } from '../../icons/ProficientIcon';
import type { SidebarSectionProps } from './types';

export function SidebarSection({
  height,
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
    <div style={{ height, display: 'flex', flexDirection: 'column' }}>
      <div
        css={css`
          padding-bottom: 10px;
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
            padding-right: 4px;
          `}>
          <SecondaryButton
            onClick={onClickNewInteraction}
            style={{
              width: '100%',
              marginTop: 10,
            }}>
            <div
              css={css`
                display: flex;
                align-items: center;
              `}>
              <PlusIcon />
            </div>
            <div
              css={css`
                margin-left: 10px;
                white-space: nowrap;
                font-family: Inter, sans-serif;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}>
              Create new interaction
            </div>
          </SecondaryButton>
        </div>
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
        `}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 8px; // Should equal resizer width
            overflow-y: scroll;
            border-top: 1px solid ${theme.colors.border};
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
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}>
                  <InteractionIcon />
                </div>
                <div
                  css={css`
                    margin-left: 10px;
                    font-family: Inter, sans-serif;
                    font-size: 14px;
                    line-height: 24px;
                    color: ${i.name ? theme.colors.textPrimary : theme.colors.textSecondary};
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}>
                  {i.name || 'New interaction'}
                </div>
              </div>
            );
          })}
        </div>

        <a
          css={css`
            ${boxCss}
            padding-bottom: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            color: ${theme.colors.watermarkColor};
            border-top: 1px solid ${theme.colors.border};
            text-decoration: none;
          `}
          href="https://proficientai.com">
          <div
            css={css`
              margin-top: 5px;
            `}>
            <ProficientIcon />
          </div>

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
    </div>
  );
}

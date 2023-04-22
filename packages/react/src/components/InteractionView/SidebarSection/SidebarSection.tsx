/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import useSize from '@react-hook/size';
import { useRef } from 'react';

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
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [, headerHeight] = useSize(headerRef);
  const [, footerHeight] = useSize(footerRef);
  return (
    <div>
      <div
        ref={headerRef}
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
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 8px; // Should equal resizer width
          height: ${height - headerHeight - footerHeight - 20}px; // 20 is for padding
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
        ref={footerRef}
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
  );
}

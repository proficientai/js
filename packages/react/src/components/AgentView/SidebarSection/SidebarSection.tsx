/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { colors } from '../../../styles';
import type { SidebarSectionProps } from './types';

export function SidebarSection({
  description,
  header,
  interactions,
  isSelectedInteraction,
  onClickInteraction,
  onClickNewInteraction,
}: SidebarSectionProps) {
  return (
    <div
      css={css`
        border-right: 1px solid ${colors.gray[700]};
        background-color: ${colors.gray[800]};
      `}>
      <div
        css={css`
          padding-left: 12px;
          padding-right: 12px;
          padding-top: 12px;
          padding-bottom: 12px;
        `}>
        <div
          css={css`
            color: ${colors.gray[100]};
          `}>
          {header}
        </div>
        <div
          css={css`
            color: ${colors.gray[500]};
            font-size: 14px;
            margin-top: 6px;
          `}>
          {description}
        </div>
      </div>

      <div
        css={css`
          padding-left: 12px;
          padding-right: 12px;
        `}>
        <button
          css={css`
            margin-top: 10px;
            margin-bottom: 10px;
          `}
          onClick={onClickNewInteraction}>
          + Create new interaction
        </button>
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
                border-bottom: 1px solid ${colors.gray[700]};
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
              {i.id}
            </div>
          );
        })}
      </div>
    </div>
  );
}

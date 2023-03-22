/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import type { SidebarSectionProps } from './types';

export function SidebarSection({
  header,
  interactions,
  isSelectedInteraction,
  onClickInteraction,
  onClickNewInteraction,
}: SidebarSectionProps) {
  return (
    <div
      css={css`
        border-right: 1px solid gray;
        padding: 12px;
      `}>
      <div>{header}</div>

      <button
        css={css`
          margin-top: 20px;
          margin-bottom: 20px;
        `}
        onClick={onClickNewInteraction}>
        + Create new interaction
      </button>
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
                border-bottom: 1px solid gray;
                padding-top: 12px;
                padding-bottom: 12px;
                padding-left: 12px;
                padding-right: 12px;
                cursor: pointer;
                background-color: ${isSelectedInteraction(i) ? 'lightblue' : 'transparent'};

                &:hover {
                  background-color: ${isSelectedInteraction(i) ? 'lightblue' : 'rgb(240, 240, 240)'};
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

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { colors } from '../../../styles';
import { TrashIcon } from '../../icons/TrashIcon';
import type { HeaderSectionProps } from './types';

export function HeaderSection({ title, onClickDelete }: HeaderSectionProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid ${colors.gray[700]};
        background-color: ${colors.gray[800]};
      `}>
      <div
        css={css`
          color: ${colors.gray[100]};
        `}>
        {title}
      </div>
      <button
        onClick={onClickDelete}
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${colors.gray[100]};
          background-color: ${colors.gray[800]};
          outline: none;
          border: none;
          cursor: pointer;
          padding-top: 6px;
          padding-bottom: 6px;
          padding-left: 8px;
          padding-right: 8px;
          border-radius: 6px;
          &:hover {
            background-color: ${colors.gray[700]};
          }
        `}>
        <TrashIcon />
      </button>
    </div>
  );
}

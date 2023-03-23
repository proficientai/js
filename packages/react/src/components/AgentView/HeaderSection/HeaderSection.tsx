/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { colors } from '../../../styles';
import type { HeaderSectionProps } from './types';

export function HeaderSection({ title, onClickDelete }: HeaderSectionProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
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
      <button onClick={onClickDelete}>Delete interaction</button>
    </div>
  );
}

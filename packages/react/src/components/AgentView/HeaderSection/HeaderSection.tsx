/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import type { HeaderSectionProps } from './types';

export function HeaderSection({ title, onClickDelete }: HeaderSectionProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 12px;
        border-bottom: 1px solid gray;
      `}>
      <div>{title}</div>
      <button onClick={onClickDelete}>Delete interaction</button>
    </div>
  );
}

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useTheme } from '../../hooks';
import { lighten } from '../../styles';
import type { SecondaryButtonProps } from './types';

export function SecondaryButton({ children, onClick, style }: SecondaryButtonProps) {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      css={css`
        display: flex;
        border: 1px solid ${theme.colors.border};
        align-items: center;
        color: ${theme.colors.primaryText};
        background-color: ${theme.colors.primaryBackground};
        outline: none;
        cursor: pointer;
        padding-top: 6px;
        padding-bottom: 6px;
        padding-left: 16px;
        padding-right: 16px;
        border-radius: 4px;

        &:hover {
          background-color: ${lighten(theme.colors.primaryBackground, 1)};
        }
      `}
      style={style}>
      {children}
    </button>
  );
}

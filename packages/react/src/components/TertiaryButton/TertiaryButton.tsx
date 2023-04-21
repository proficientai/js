/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useTheme } from '../../hooks';
import type { TertiaryButtonProps } from './types';

export function TertiaryButton({ children, disabled, onClick, style }: TertiaryButtonProps) {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      css={css`
        display: flex;
        align-items: center;
        color: ${theme.colors.textSecondary};
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        padding-top: 6px;
        padding-bottom: 6px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 4px;

        &:hover {
          color: ${theme.colors.textPrimary};
        }
      `}
      style={style}>
      {children}
    </button>
  );
}

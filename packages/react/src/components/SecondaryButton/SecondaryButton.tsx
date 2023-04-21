/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useTheme } from '../../hooks';
import type { SecondaryButtonProps } from './types';

export function SecondaryButton({ children, disabled, onClick, style }: SecondaryButtonProps) {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      css={css`
        display: flex;
        border: 1px solid ${theme.colors.border};
        align-items: center;
        color: ${theme.colors.textPrimary};
        background-color: ${theme.colors.backgroundPrimary};
        outline: none;
        cursor: pointer;
        padding-top: 6px;
        padding-bottom: 6px;
        padding-left: 16px;
        padding-right: 16px;
        border-radius: 4px;

        &:hover {
          background-color: ${theme.colors.hover};
        }
      `}
      style={style}>
      {children}
    </button>
  );
}

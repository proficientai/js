/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useTheme } from '../../hooks';
import type { PrimaryButtonProps } from './types';

export function PrimaryButton({ children, disabled, onClick, style }: PrimaryButtonProps) {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: ${theme.colors.primary};
        outline: none;
        border: none;
        cursor: pointer;
        padding-top: 6px;
        padding-bottom: 6px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 6px;

        &:disabled {
          background-color: ${theme.colors.primaryLighter};
        }

        &:hover {
          background-color: ${theme.colors.primaryDarker};
        }

        &:active {
          background-color: ${theme.colors.primaryDarkest};
        }
      `}
      style={style}>
      {children}
    </button>
  );
}

import { css } from '@emotion/react';
import { useMemo } from 'react';

import { useTheme } from './useTheme';

export function useStyles() {
  const theme = useTheme();

  return useMemo(() => {
    const primaryTextCss = css`
      font-family: Inter, sans-serif;
      font-size: 14px;
      color: ${theme.colors.textPrimary};
    `;

    const secondaryTextCss = css`
      font-family: Inter, sans-serif;
      font-size: 14px;
      color: ${theme.colors.textSecondary};
    `;

    const tertiaryTextCss = css`
      font-family: Inter, sans-serif;
      font-size: 14px;
      color: ${theme.colors.textTertiary};
    `;

    const inputCss = css`
      background-color: ${theme.colors.backgroundPrimary};
      padding-top: 8px;
      padding-bottom: 8px;
      padding-left: 12px;
      padding-right: 12px;
      color: ${theme.colors.textPrimary};
      font-family: Inter, sans-serif;
      font-size: 14px;
      line-height: 24px;
      outline: 2px solid transparent;
      outline-offset: 2px;

      &::placeholder {
        color: ${theme.colors.textSecondary};
      }
    `;

    const boxCss = css`
      display: flex;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 12px;
      padding-bottom: 12px;
    `;

    return { primaryTextCss, secondaryTextCss, tertiaryTextCss, inputCss, boxCss };
  }, [theme]);
}

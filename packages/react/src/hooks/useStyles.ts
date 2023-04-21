import { css } from '@emotion/react';
import { useMemo } from 'react';

import { lighten } from '../styles';
import { useTheme } from './useTheme';

export function useStyles() {
  const theme = useTheme();

  return useMemo(() => {
    const primaryTextCss = css`
      font-family: Inter, sans-serif;
      font-size: 14px;
      color: ${theme.colors.primaryText};
    `;

    const secondaryTextCss = css`
      font-family: Inter, sans-serif;
      font-size: 14px;
      color: ${theme.colors.secondaryText};
    `;

    const inputCss = css`
      background-color: transparent;
      padding-top: 8px;
      padding-bottom: 8px;
      padding-left: 12px;
      padding-right: 12px;
      color: ${theme.colors.primaryText};
      font-family: Inter, sans-serif;
      font-size: 14px;
      outline: 2px solid transparent;
      outline-offset: 2px;
    `;

    const boxCss = css`
      display: flex;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 12px;
      padding-bottom: 12px;
    `;

    const secondaryButtonCss = css`
      display: flex;
      justify-content: center;
      align-items: center;
      outline: none;
      border: none;
      cursor: pointer;
      padding-top: 6px;
      padding-bottom: 6px;
      padding-left: 8px;
      padding-right: 8px;
      border-radius: 6px;
      background-color: ${theme.colors.primaryBackground};
      color: ${theme.colors.primaryText};

      &:hover {
        background-color: ${lighten(theme.colors.primaryBackground, 1)};
      }
    `;

    return { primaryTextCss, secondaryTextCss, inputCss, boxCss, secondaryButtonCss };
  }, [theme]);
}

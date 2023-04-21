import { css } from '@emotion/react';

export const colors = {
  gray: {
    50: 'hsl(222, 9%, 98%)',
    100: 'hsl(222, 9%, 95%)',
    200: 'hsl(222, 9%, 90%)',
    300: 'hsl(222, 9%, 83%)',
    400: 'hsl(222, 9%, 64%)',
    500: 'hsl(222, 9%, 45%)',
    600: 'hsl(222, 9%, 33%)',
    700: 'hsl(222, 9%, 26%)',
    800: 'hsl(222, 9%, 15%)',
    900: 'hsl(222, 9%, 11%)',
    1000: 'hsl(222, 9%, 3%)',
  },
  indigo: {
    50: 'hsl(226, 100%, 97%)',
    100: 'hsl(226, 100%, 94%)',
    200: 'hsl(228, 96%, 89%)',
    300: 'hsl(230, 94%, 82%)',
    400: 'hsl(234, 89%, 74%)',
    500: 'hsl(239, 84%, 67%)',
    600: 'hsl(243, 75%, 59%)',
    700: 'hsl(245, 58%, 51%)',
    800: 'hsl(235, 22%, 22%)',
    900: 'hsl(226, 20%, 18%)',
  },
};

/*
 * Text styles
 */

export const primaryTextCss = css`
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: ${colors.gray[100]};
`;

export const secondaryTextCss = css`
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: ${colors.gray[500]};
`;

export const inputCss = css`
  background-color: transparent;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  color: ${colors.gray[100]};
  font-family: Inter, sans-serif;
  font-size: 14px;
  outline: 2px solid transparent;
  outline-offset: 2px;
`;

export const boxCss = css`
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const secondaryButtonCss = css`
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
  background-color: ${colors.gray[800]};
  color: ${colors.gray[100]};

  &:hover {
    background-color: ${colors.gray[700]};
  }
`;

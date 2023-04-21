import type { PartialDeep } from 'type-fest';

import { darken, lighten } from '../styles';

export interface ProficientTheme {
  colors: {
    border: string;
    primary: string;
    primaryBackground: string;
    primaryText: string;
    secondaryText: string;
  };
}

export interface CreateThemeParams {
  colors: {
    background: string;
    primary: string;
    text: string;
  };
}

const defaultParams: CreateThemeParams = {
  colors: {
    background: 'hsl(222, 9%, 15%)',
    primary: 'hsl(239, 84%, 67%)',
    text: 'hsl(222, 9%, 95%)',
  },
};

/**
 * Creates a custom theme.
 */
export function createTheme(providedParams?: PartialDeep<CreateThemeParams>): ProficientTheme {
  const params: CreateThemeParams = {
    colors: {
      ...defaultParams.colors,
      ...providedParams?.colors,
    },
  };

  const borderColor = lighten(params.colors.background, 1);
  const secondaryTextColor = darken(params.colors.text, 1);

  return {
    colors: {
      border: borderColor,
      primary: params.colors.primary,
      primaryBackground: params.colors.background,
      primaryText: params.colors.text,
      secondaryText: secondaryTextColor,
    },
  };
}

import type { PartialDeep } from 'type-fest';

import { darken, lighten } from '../styles';

export interface ProficientTheme {
  colors: {
    backgroundPrimary: string;
    backgroundSecondary: string;
    border: string;
    borderActive: string;
    primary: string;
    textPrimary: string;
    textSecondary: string;
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
    background: 'hsl(222, 9%, 13%)',
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

  const backgroundPrimaryColor = params.colors.background;
  const backgroundSecondaryColor = darken(backgroundPrimaryColor, 4);

  const borderColor = lighten(backgroundPrimaryColor, 5);
  const borderActiveColor = lighten(borderColor, 10);

  const textPrimaryColor = params.colors.text;
  const textSecondaryColor = darken(textPrimaryColor, 40);

  return {
    colors: {
      backgroundPrimary: backgroundPrimaryColor,
      backgroundSecondary: backgroundSecondaryColor,
      border: borderColor,
      borderActive: borderActiveColor,
      primary: params.colors.primary,
      textPrimary: textPrimaryColor,
      textSecondary: textSecondaryColor,
    },
  };
}

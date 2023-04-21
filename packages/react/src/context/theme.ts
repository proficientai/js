import tinycolor from 'tinycolor2';
import type { PartialDeep } from 'type-fest';

import { darken, lighten } from '../styles';

export interface ProficientTheme {
  colors: {
    backgroundPrimary: string;
    backgroundSecondary: string;
    border: string;
    borderActive: string;
    hover: string;
    primary: string;
    shadow: string;
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
  const isDark = tinycolor(backgroundPrimaryColor).isDark();

  const backgroundSecondaryColor = darken(backgroundPrimaryColor, 4);

  const borderColor = isDark ? lighten(backgroundPrimaryColor, 5) : darken(backgroundPrimaryColor, 10);
  const borderActiveColor = isDark ? lighten(borderColor, 10) : darken(borderColor, 10);

  const hoverColor = isDark ? lighten(backgroundPrimaryColor, 2) : darken(backgroundPrimaryColor, 3);

  const primaryColor = params.colors.primary;

  const shadowColor = isDark ? darken(backgroundPrimaryColor, 10) : darken(backgroundPrimaryColor, 20);

  const textPrimaryColor = params.colors.text;
  const textSecondaryColor = isDark ? darken(textPrimaryColor, 40) : lighten(textPrimaryColor, 40);

  return {
    colors: {
      backgroundPrimary: backgroundPrimaryColor,
      backgroundSecondary: backgroundSecondaryColor,
      border: borderColor,
      borderActive: borderActiveColor,
      hover: hoverColor,
      primary: primaryColor,
      shadow: shadowColor,
      textPrimary: textPrimaryColor,
      textSecondary: textSecondaryColor,
    },
  };
}

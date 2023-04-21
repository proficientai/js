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
    hoverActive: string;
    primary: string;
    primaryLighter: string;
    primaryDarker: string;
    primaryDarkest: string;
    shadow: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    watermarkColor: string;
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
    primary: 'hsl(239, 84%, 64%)',
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
  const hoverActiveColor = isDark ? lighten(hoverColor, 2) : darken(hoverColor, 3);

  const primaryColor = params.colors.primary;
  const primaryLighterColor = lighten(params.colors.primary, 5);
  const primaryDarkerColor = darken(primaryColor, 3);
  const primaryDarkestColor = darken(primaryDarkerColor, 3);

  const shadowColor = isDark ? darken(backgroundPrimaryColor, 10) : darken(backgroundPrimaryColor, 20);

  const textPrimaryColor = params.colors.text;
  const textSecondaryColor = isDark ? darken(textPrimaryColor, 40) : lighten(textPrimaryColor, 40);

  const textTertiaryColor = isDark ? darken(textSecondaryColor, 30) : lighten(textSecondaryColor, 30);
  const watermarkColor = isDark ? lighten(backgroundSecondaryColor, 10) : lighten(backgroundSecondaryColor, 30);

  return {
    colors: {
      backgroundPrimary: backgroundPrimaryColor,
      backgroundSecondary: backgroundSecondaryColor,
      border: borderColor,
      borderActive: borderActiveColor,
      hover: hoverColor,
      hoverActive: hoverActiveColor,
      primary: primaryColor,
      primaryLighter: primaryLighterColor,
      primaryDarker: primaryDarkerColor,
      primaryDarkest: primaryDarkestColor,
      shadow: shadowColor,
      textPrimary: textPrimaryColor,
      textSecondary: textSecondaryColor,
      textTertiary: textTertiaryColor,
      watermarkColor: watermarkColor,
    },
  };
}

import type { PartialDeep } from 'type-fest';

export interface ProficientTheme {
  colors: {
    background: string;
    primary: string;
    textFaded: string;
    textStark: string;
  };
}

const defaultTheme: ProficientTheme = {
  colors: {
    background: 'hsl(222, 9%, 15%)',
    primary: 'hsl(239, 84%, 67%)',
    textFaded: 'hsl(222, 9%, 45%)',
    textStark: 'hsl(222, 9%, 95%)',
  },
};

/**
 * Creates a custom theme.
 */
export function createTheme(params?: PartialDeep<ProficientTheme>): ProficientTheme {
  return {
    colors: {
      ...defaultTheme.colors,
      ...params?.colors,
    },
  };
}

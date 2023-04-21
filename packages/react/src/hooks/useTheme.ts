import { useContext } from 'react';

import { ProficientThemeContext } from '../context';

export function useTheme() {
  return useContext(ProficientThemeContext);
}

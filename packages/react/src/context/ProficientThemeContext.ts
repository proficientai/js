import { createContext, useContext } from 'react';

import { createTheme } from './theme';

export const ProficientThemeContext = createContext(createTheme());

export const useTheme = () => useContext(ProficientThemeContext);

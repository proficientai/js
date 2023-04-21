import { createContext } from 'react';

import { createTheme } from './theme';

export const ProficientThemeContext = createContext(createTheme());

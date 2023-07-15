import { createContext } from 'react';

interface ThemeContextType {
  PRIMARY: string;
  SECONDARY: string;
  TERTIARY: string;
  QUATERNARY: string;
  BACKGROUND: string;
  HINT: string;
  LIGHT_HINT: string;
  NEGATIVE: string;
  POSITIVE: string;
}

export const themeContext = createContext<ThemeContextType>(
  {} as ThemeContextType,
);

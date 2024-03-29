import { createContext, useContext } from 'react';

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

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType,
);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

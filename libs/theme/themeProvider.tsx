import { silverTheme, darkTheme, pinkTheme, mintTheme } from './theme';
import { createContext, useState, useContext, useCallback } from 'react';
import { ThemeContext, ThemeProvider as StyledProvider } from 'styled-components';

const getTheme = (find: string) => {
  const THEME = {
    pink: pinkTheme,
    dark: darkTheme,
    silver: silverTheme,
    mint: mintTheme,
  };
  let result;
  for (let [key, value] of Object.entries(THEME)) {
    if (key === find) result = value;
  }
  return result;
};

const ThemeProvider = ({ children }: any) => {
  const [ThemeMode, setThemeMode] = useState('pink');
  const themeObject = getTheme(ThemeMode);

  return (
    <ThemeContext.Provider value={{ ThemeMode, setThemeMode }}>
      <StyledProvider theme={themeObject}>{children}</StyledProvider>
    </ThemeContext.Provider>
  );
};

function useTheme() {
  const context = useContext(ThemeContext);
  const { ThemeMode, setThemeMode } = context;

  const setTheme = useCallback(
    (theme: string) => {
      setThemeMode(theme);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ThemeMode]
  );

  return [ThemeMode, setTheme];
}

export { ThemeProvider, useTheme };

import { useCallback, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { setCookie } from 'cookies-next';

function useTheme() {
  const context = useContext(ThemeContext);
  const { themeMode, setThemeMode } = context;

  const setTheme = useCallback(
    (theme: ThemeKey) => {
      setThemeMode(theme);
      setCookie('localTheme', theme);
    },
    [setThemeMode]
  );

  return [themeMode, setTheme];
}
export default useTheme;

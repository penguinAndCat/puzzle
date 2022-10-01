import { useCallback, useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import { ThemeContext } from 'styled-components';

function useTheme() {
  const themeKeys: ThemeKey[] = useMemo(() => ['pink', 'silver', 'mint', 'dark'], []);
  const context = useContext(ThemeContext);
  const { themeMode, setThemeMode } = context;
  const canUseDOM = typeof window !== 'undefined';
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  const setTheme = useCallback(
    (theme: ThemeKey) => {
      setThemeMode(theme);
      window.localStorage.setItem('localTheme', theme);
    },
    [setThemeMode]
  );

  useIsomorphicLayoutEffect(() => {
    const localTheme = window.localStorage.getItem('localTheme') as ThemeKey;
    if (themeKeys.includes(localTheme)) {
      setTheme(localTheme);
    }
  }, [setTheme, themeKeys]);

  return [themeMode, setTheme];
}
export default useTheme;

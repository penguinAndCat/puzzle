import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'libs/theme/themeProvider';
import { GlobalStyle } from 'libs/theme/GlobalStyle';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

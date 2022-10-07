import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'libs/theme/ThemeProvider';
import { GlobalStyle } from 'libs/theme/GlobalStyle';
import Toast from 'components/common/Toast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Component {...pageProps} />
      <Toast />
    </ThemeProvider>
  );
}

export default MyApp;

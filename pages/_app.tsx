import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'libs/theme/ThemeProvider';
import { GlobalStyle } from 'libs/theme/GlobalStyle';
import Toast from 'components/common/Toast';
import { SessionProvider } from 'next-auth/react';
import Loading from 'components/common/Loading';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <GlobalStyle />
        <Component {...pageProps} />
        <Toast />
        <Loading />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;

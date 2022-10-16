import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'libs/theme/ThemeProvider';
import { GlobalStyle } from 'libs/theme/GlobalStyle';
import Toast from 'components/common/Toast';
import Loading from 'components/common/Loading';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Component {...pageProps} />
      <Toast />
      <Loading />
    </ThemeProvider>
  );
}

export default MyApp;

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'libs/theme/ThemeProvider';
import { GlobalStyle } from 'libs/theme/GlobalStyle';
import Toast from 'components/common/Toast';
import Loading from 'components/common/Loading';
import Modal from 'components/common/Modal';
import axios from 'axios';
import { userStore } from 'libs/zustand/store';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const { setUser } = userStore();
  useEffect(() => {
    axios
      .get('/api/auth')
      .then((res) => setUser(res.data.user || null))
      .catch((err) => console.log(err));
  }, [setUser]);

  return (
    <ThemeProvider>
      <GlobalStyle />
      <Component {...pageProps} />
      <Toast />
      <Loading />
      <Modal />
    </ThemeProvider>
  );
}

export default MyApp;

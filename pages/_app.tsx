import { useEffect, useRef } from 'react';
import type { AppProps } from 'next/app';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { getCookie, setCookie } from 'cookies-next';

import '../styles/globals.css';
import '../styles/completeModal.css';
import { ThemeProvider } from 'libs/theme/ThemeProvider';
import { GlobalStyle } from 'libs/theme/GlobalStyle';
import { userStore } from 'libs/zustand/store';

// import Modal from 'components/common/Modal';
// import Loading from 'components/common/Loading';
// import SocketNotice from 'components/common/SocketNotice';
// import ToastList from 'components/common/Toast/ToastList';
// import PopupList from 'components/common/Popup/PopupList';

import dynamic from 'next/dynamic';
import apis from 'apis';

const Modal = dynamic(() => import('components/common/Modal'), {
  ssr: false,
});
const Loading = dynamic(() => import('components/common/Loading'), {
  ssr: false,
});
const SocketNotice = dynamic(() => import('components/common/SocketNotice'), {
  ssr: false,
});
const ToastList = dynamic(() => import('components/common/Toast/ToastList'), {
  ssr: false,
});
const PopupList = dynamic(() => import('components/common/Popup/PopupList'), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const { setUser } = userStore();

  useEffect(() => {
    if (pageProps.user) {
      setUser(pageProps.user);
    }
  }, [setUser, pageProps.user]);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider pageTheme={pageProps.theme}>
          <GlobalStyle />
          <Component {...pageProps} />
          <ToastList />
          <PopupList />
          <Loading />
          <Modal />
          <SocketNotice user={pageProps.user} />
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async ({ ctx, Component }: { ctx: any; Component: any }) => {
  const themeKeys: ThemeKey[] = ['pink', 'silver', 'mint', 'dark'];
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const cookie = ctx.req?.cookies;
  if (cookie) {
    const localTheme = getCookie('localTheme', ctx) as ThemeKey;
    if (themeKeys.includes(localTheme)) {
      Object.assign(pageProps, {
        theme: localTheme,
      });
    } else {
      Object.assign(pageProps, {
        theme: 'pink',
      });
    }
  }

  const { req, res } = ctx;
  const data = await apis.users.getAuth(req?.headers.cookie);
  if (data.accessToken) {
    setCookie('accessToken', data.accessToken, { req, res });
  }
  if (data.user) {
    Object.assign(pageProps, {
      user: data.user,
    });
  }

  return { pageProps };
};

export default MyApp;

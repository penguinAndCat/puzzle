import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'libs/theme/ThemeProvider';
import { GlobalStyle } from 'libs/theme/GlobalStyle';
import Toast from 'components/common/Toast';
import Loading from 'components/common/Loading';
import Modal from 'components/common/Modal';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getCookie, setCookie } from 'cookies-next';
import axios from 'libs/axios';
import { NEXT_SERVER } from 'config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider pageTheme={pageProps.theme}>
        <GlobalStyle />
        <Component {...pageProps} />
        <Toast />
        <Loading />
        <Modal />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async ({ ctx, Component }: { ctx: any; Component: any }) => {
  const themeKeys: ThemeKey[] = ['pink', 'silver', 'mint', 'dark'];
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const cookie = ctx.req.cookies;
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
  const { data } = await axios.get(`${NEXT_SERVER}/api/auth`, {
    headers: {
      Cookie: req.headers.cookie || '',
    },
  });
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

import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import styled, { ServerStyleSheet } from 'styled-components';
import Script from 'next/script';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: JSX.IntrinsicAttributes) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/* <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" /> */}
          <Script
            type="text/javascript"
            src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js"
            strategy="beforeInteractive"
            charSet="utf-8"
          ></Script>
          <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.0.0/kakao.min.js" strategy="beforeInteractive" />
          <Script
            type="text/javascript"
            src="http://code.jquery.com/jquery-1.11.3.min.js"
            strategy="beforeInteractive"
          ></Script>
          <div id="portal" />
        </body>
      </Html>
    );
  }
}

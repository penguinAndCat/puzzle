import React, { useEffect } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    naver: any;
    Kakao: any;
  }
}

export default function NaverAuthBtn() {
  const initializeNaverLogin = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
      // 팝업창으로 로그인을 진행할 것인지?
      isPopup: false,
      // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
      loginButton: { color: 'green', type: 1, height: 59 },
      callbackHandle: true,
    });
    naverLogin.init();
  };

  useEffect(() => {
    initializeNaverLogin();
  }, []);

  return <Btn id="naverIdLogin">네</Btn>;
}

const Btn = styled.button`
  z-index: 1;
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 0;
  line-height: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  border: none;
  &:hover {
    border: none;
  }
`;

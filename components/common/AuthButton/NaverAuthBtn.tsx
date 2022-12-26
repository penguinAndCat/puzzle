import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    naver: any;
    Kakao: any;
  }
}

export default function NaverAuthBtn() {
  const el = useRef<any>(null);
  const initializeNaverLogin = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
      // 팝업창으로 로그인을 진행할 것인지?
      isPopup: false,
      // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
      loginButton: { color: 'green', type: 1, height: 24, width: 240 },
      callbackHandle: true,
    });
    naverLogin.init();
  };

  const onClick = () => {
    el.current.children[0].click();
  }

  useEffect(() => {
    initializeNaverLogin();
  }, []);

  return (
    <BtnWrapper onClick={onClick}>
      <Btn id="naverIdLogin" ref={el} />
      <Img src='icon-login-naver-btn.svg' alt='naver_icon'/>
      <Span>네이버로 시작</Span>
    </BtnWrapper>
  )
}

const Btn = styled.div`
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  color: #000;
  background-color: #03c75a;
  z-index: 1;
`;

const BtnWrapper = styled.button`
  width: 185px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #03c75a;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
`;

const Img = styled.img`
  width: 20px;
  height: 20px;
`;

const Span = styled.span`
  margin-left: 8px;
`;
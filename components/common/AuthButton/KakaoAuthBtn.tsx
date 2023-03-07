import React, { useEffect } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    naver: any;
    Kakao: any;
  }
}

export default function KakaoAuthBtn() {
  const loginWithKakao = () => {
    window.Kakao.Auth.authorize({
      redirectUri: `${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`,
    });
  };

  useEffect(() => {
    if (window.Kakao?.isInitialized()) return;
    if (window.Kakao) window.Kakao.init(`${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`);
  }, []);

  return (
    <BtnWrapper onClick={loginWithKakao}>
      <Img src="icon-login-kakaotalk-btn.svg" alt="kakaotalk_icon" />
      <Span>카카오로 시작</Span>
    </BtnWrapper>
  );
}

const BtnWrapper = styled.button`
  width: 185px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  background-color: #fee500;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  margin-bottom: 8px;
`;

const Img = styled.img`
  width: 20px;
  height: 20px;
`;

const Span = styled.span`
  margin-left: 8px;
`;

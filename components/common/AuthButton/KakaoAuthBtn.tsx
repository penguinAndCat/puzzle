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
    if (window.Kakao.isInitialized()) return;
    window.Kakao.init(`${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`);
  }, []);

  return <KakaoAuth onClick={loginWithKakao}>카</KakaoAuth>;
}

const Btn = styled.button`
  z-index: 1;
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 0;
  line-height: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  border: 1px solid lightgray;
  &:hover {
    border: 1px solid skyblue;
  }
`;

const KakaoAuth = styled(Btn)`
  background-image: url('/btn_kakao.svg');
  background-color: yellow;
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center 58%;
`;

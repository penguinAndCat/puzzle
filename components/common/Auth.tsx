import { theme } from 'libs/theme/theme';
import React from 'react';
import styled from 'styled-components';

import NaverAuthBtn from './AuthButton/NaverAuthBtn';
import KakaoAuthBtn from './AuthButton/KakaoAuthBtn';
import GoogleAuthBtn from './AuthButton/GoogleAuthBtn';

declare global {
  interface Window {
    naver: any;
    Kakao: any;
  }
}
export default function Auth() {
  return (
    <Container>
      <GoogleAuthBtn />
      <KakaoAuthBtn />
      <NaverAuthBtn />
    </Container>
  );
}

const Container = styled.div`
  ${theme.common.flexCenter}
  gap: 10px;
  border-radius: 20px;
  background-color: lightgray;
  padding: 15px;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    width: 15px;
    height: 15px;
    background-color: lightgray;
    top: -5px;
    z-index: 0;
    transform: rotate(45deg);
  }
`;

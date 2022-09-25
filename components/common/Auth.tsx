import { theme } from 'libs/theme/theme';
import { signIn } from 'next-auth/react';
import React from 'react';
import styled from 'styled-components';

export default function Auth() {
  return (
    <Container>
      <GoogleAuth onClick={() => signIn('google')}>구</GoogleAuth>
      <KakaoAuth onClick={() => signIn('kakao')}>카</KakaoAuth>
      <NaverAuth onClick={() => signIn('naver')}>네</NaverAuth>
    </Container>
  );
}

const Container = styled.div`
  ${theme.common.flexCenter}
  gap: 10px;
  border-radius: 20px;
  background-color: lightgray;
  padding: 10px;
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

const Btn = styled.button`
  z-index: 1;
  background-color: white;
  border: none;
  cursor: pointer;
  border-radius: 99px;
  font-size: 0;
  line-height: 0;
  width: 40px;
  height: 40px;
  background-position: center;
  &:hover {
    border: 1px solid gray;
  }
`;

const NaverAuth = styled(Btn)`
  background-image: url('/btn_naver.svg');
  background-color: #00c60c;
`;

const GoogleAuth = styled(Btn)`
  background-image: url('/btn_google.svg');
`;

const KakaoAuth = styled(Btn)`
  background-image: url('/btn_kakao.svg');
  background-color: yellow;
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center 58%;
`;

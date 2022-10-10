import React from 'react';
import styled from 'styled-components';
import GoogleAuthBtn from './AuthButton/GoogleAuthBtn';
import KakaoAuthBtn from './AuthButton/KakaoAuthBtn';
import NaverAuthBtn from './AuthButton/NaverAuthBtn';

export default function AuthModal({ handleClose }: { handleClose: () => void }) {
  return (
    <Container onClick={handleClose}>
      <Wrapper
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      >
        <GoogleAuthBtn />
        <KakaoAuthBtn />
        <NaverAuthBtn />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
`;

const Wrapper = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

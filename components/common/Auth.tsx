import { theme } from 'libs/theme/theme';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'libs/axios';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    naver: any;
  }
}
export default function Auth() {
  const googleRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const onGoogleSignIn = async (user: any) => {
    const userCred = user.credential;
    const tokenParse: { name: string; email: string; picture: string; [key: string]: string } = jwtDecode(userCred);
    try {
      const response = await axios.post('/api/auth/google', {
        data: {
          name: tokenParse.name,
          email: tokenParse.email,
          picture: tokenParse.picture,
          provider: 'google',
        },
      });
      const token = response.data.token;

      if (!token) {
        setUserInfo(tokenParse);
        setShowModal(true);
      } else {
        router.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (nickname: string) => {
    if (!nickname) {
      alert('nickname is required');
      return;
    }
    const userData = {
      nickname,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
    try {
      const response = await axios.post('/api/auth/google', { data: userData });
      const token = response.data.token;
      setShowModal(false);
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: onGoogleSignIn,
      auto_select: false,
    });
    window.google?.accounts.id.renderButton(googleRef.current!, { type: 'icon', size: 'large' });
  }, []);

  const initializeNaverLogin = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
      // 팝업창으로 로그인을 진행할 것인지?
      isPopup: false,
      // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
      loginButton: { color: 'green', type: 1, height: 40 },
      callbackHandle: true,
    });
    naverLogin.init();
  };

  useEffect(() => {
    initializeNaverLogin();
  }, []);

  return (
    <>
      {showModal && <Modal onSubmit={handleSubmit}></Modal>}
      <Container>
        <GoogleAuth ref={googleRef}>구</GoogleAuth>
        <KakaoAuth onClick={async () => {}}>카</KakaoAuth>
        <NaverAuth id="naverIdLogin" onClick={() => {}}>
          네
        </NaverAuth>
      </Container>
    </>
  );
}

const Modal = ({ onSubmit }: { onSubmit: (nickname: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ModalContainer>
      <ModalWrapper>
        <h1>닉네임은 필수입니다.</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(inputRef.current?.value || '');
          }}
        >
          <input ref={inputRef} required minLength={2} />
          <button>제출</button>
        </form>
      </ModalWrapper>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;
const ModalWrapper = styled.div`
  width: 500px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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

const Btn = styled.button`
  z-index: 1;
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 0;
  line-height: 0;
  width: 40px;
  height: 40px;
  background-position: center;
  border: 1px solid lightgray;
  &:hover {
    border: 1px solid skyblue;
  }
`;

const NaverAuth = styled(Btn)`
  background-image: url('/btn_naver.svg');
  background-color: #00c60c;
`;

const GoogleAuth = styled(Btn)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const KakaoAuth = styled(Btn)`
  background-image: url('/btn_kakao.svg');
  background-color: yellow;
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center 58%;
`;

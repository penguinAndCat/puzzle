import { theme } from 'libs/theme/theme';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Script from 'next/script';
import axios from 'libs/axios';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useUser } from 'hooks/useUser';

export default function Auth() {
  const googleRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [user, setUser] = useUser();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const onGoogleSignIn = async (user: any) => {
    const userCred = user.credential;
    const tokenParse: { name: string; email: string; picture: string; [key: string]: string } = jwtDecode(userCred);
    setUserInfo({ name: tokenParse.name, email: tokenParse.email, provider: 'google' });
    try {
      const response = await axios.get('/api/auth/google', {
        params: {
          name: tokenParse.name,
          email: tokenParse.email,
          provider: 'google',
        },
      });
      const user = response.data;
      if (user) {
        const response = await axios.post('/api/auth/google', {
          data: { name: tokenParse.name, email: tokenParse.email, provider: 'google' },
        });
        const loginUser = response.data.user;
        setUser({
          name: loginUser.name,
          email: loginUser.email,
          id: loginUser._id,
          picture: loginUser.picture,
          nickname: loginUser.nickname,
        });
      } else {
        setShowModal(true);
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
      const data = response.data.user;
      const user = {
        nickname: data.nickname,
        id: data._id.toString(),
        email: data.email,
        name: data.name,
      };
      setUserInfo(user);
      setShowModal(false);
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          window.google?.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: onGoogleSignIn,
            auto_select: false,
          });
          window.google?.accounts.id.renderButton(googleRef.current!, { type: 'icon', size: 'large' });
        }}
      />
      {showModal && <Modal onSubmit={handleSubmit}></Modal>}
      <Container>
        <GoogleAuth ref={googleRef}>구</GoogleAuth>
        <KakaoAuth onClick={() => {}}>카</KakaoAuth>
        <NaverAuth onClick={() => {}}>네</NaverAuth>
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

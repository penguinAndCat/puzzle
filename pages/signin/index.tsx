import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: any) => {
    // 원래 실행되는 이벤트 취소
    e.preventDefault();
    // Form 안에서 이메일, 패스워드 가져오기
    try {
      const response = await signIn('custom-email', {
        email,
        password,
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (status === 'authenticated') {
    router.replace('/');
    return <Container>홈으로 이동중</Container>;
  }

  return (
    <Container>
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Input placeholder="email" type={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="password"
            type={'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FromBottom>
            <LoginBtn>로그인</LoginBtn>
            <SignupLink href={'/signup'}>회원가입</SignupLink>
          </FromBottom>
        </Form>
        <AuthBox>
          <AuthBtn onClick={() => signIn('google')}>구</AuthBtn>
          <AuthBtn onClick={() => signIn('kakao')}>카</AuthBtn>
          <AuthBtn onClick={() => signIn('naver')}>네</AuthBtn>
        </AuthBox>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 500px;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-shadow: 0 0 10px 1px black;
  border-radius: 10px;
  background-color: white;
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid black;
`;

const FromBottom = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
`;

const LoginBtn = styled.button`
  border: none;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  cursor: pointer;
  width: 100px;
  height: 30px;
  font-weight: bold;
`;

const SignupLink = styled.a`
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  cursor: pointer;
  width: 100px;
  height: 30px;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 10px;
  outline: none;
  border: none;
  border-radius: 10px;
  border: 1px solid gray;
  font-size: 1.25rem;
  &:focus {
    border: 1px solid skyblue;
  }
`;

const AuthBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  height: 100px;
`;

const AuthBtn = styled.div`
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  cursor: pointer;
  width: 100px;
  height: 30px;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

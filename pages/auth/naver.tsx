import React, { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'apis/axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AuthComponent } from 'components/common/Auth';
import LoginLoading from 'components/common/LoginLoading';
import { useToast } from 'hooks/views/useToast';

const Naver: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const accessCode = window.location.hash.substring(1).split('&')[0].split('=')[1];
    if (accessCode) {
      axios
        .get('/api/auth/naver/callback', {
          params: {
            code: accessCode,
          },
        })
        .then((res) => {
          if (res.data.user) {
            setUserInfo(res.data.user);
          } else {
            window.location.replace('/');
          }
        })
        .catch((err) => console.log(err));
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;
    if (inputRef.current?.value.length > 5) {
      toast({ content: '5글자 이하로 입력해주세요.', type: 'warning' });
      return;
    }
    try {
      await axios.post('/api/auth/naver', { nick: inputRef.current?.value, user: userInfo });
      window.location.replace('/');
    } catch (err: any) {
      if (err.response.status === 401) toast({ content: '중복된 닉네임입니다.', type: 'warning' });
      if (err.response.status === 400) toast({ content: '5글자 이하로 입력해주세요.', type: 'warning' });
    }
  };

  if (userInfo && userInfo.email) {
    return (
      <AuthComponent.Form onSubmit={handleSubmit}>
        <AuthComponent.Div>nickname</AuthComponent.Div>
        <AuthComponent.Input type="text" ref={inputRef} />
        <AuthComponent.Button>submit</AuthComponent.Button>
      </AuthComponent.Form>
    );
  }

  return <LoginLoading />;
};

export default Naver;

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'libs/axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AuthComponent } from 'components/common/Auth';
import Loading from 'components/common/Loading';
import { useLoading } from 'libs/zustand/store';
import LoginLoading from 'components/common/LoginLoading';

const Naver: NextPage = () => {
  const router = useRouter();
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;
    if (inputRef.current?.value.length > 5) {
      alert('닉네임은 5글자 이하입니다');
      return;
    }
    axios.post('/api/auth/google', { nick: inputRef.current?.value, user: userInfo });
    window.location.replace('/');
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

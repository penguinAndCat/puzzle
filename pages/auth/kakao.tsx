import React, { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'libs/axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AuthComponent } from 'components/common/Auth';
import Loading from 'components/common/Loading';
import { useLoading } from 'libs/zustand/store';
import LoginLoading from 'components/common/LoginLoading';

const Kakao: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (code) {
      axios
        .get('/api/auth/kakao/callback', {
          params: {
            code: code,
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
  }, [code, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;
    if (inputRef.current?.value.length > 5) {
      alert('닉네임은 5글자 이하입니다');
      return;
    }
    axios.post('/api/auth/kakao', { nick: inputRef.current?.value, user: userInfo });
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

export default Kakao;

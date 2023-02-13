import React, { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'apis/axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AuthComponent } from 'components/common/Auth';
import LoginLoading from 'components/common/LoginLoading';
import { useToast } from 'hooks/useToast';

const Kakao: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;
    if (inputRef.current?.value.length > 5) {
      toast({ content: '5글자 이하로 입력해주세요.', type: 'warning' });
      return;
    }
    try {
      await axios.post('/api/auth/kakao', { nick: inputRef.current?.value, user: userInfo });
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

export default Kakao;

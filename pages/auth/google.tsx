import React, { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'libs/axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AuthComponent } from 'components/common/Auth';

const Google: NextPage = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  useEffect(() => {
    const accessCode = window.location.hash.substring(1).split('&')[0].split('=')[1];
    if (accessCode) {
      axios
        .get('/api/auth/google/callback', {
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
  return <div>loading</div>;
};

export default Google;

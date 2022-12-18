import axios from 'libs/axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

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
    axios.post('/api/auth/naver', { nick: inputRef.current?.value, user: userInfo });
    window.location.replace('/');
  };

  if (userInfo && userInfo.email) {
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" ref={inputRef} />
        <button>submit</button>
      </form>
    );
  }
  return <div>loading</div>;
};

export default Naver;

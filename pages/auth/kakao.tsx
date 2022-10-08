import axios from 'libs/axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

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
            router.replace('/');
          }
        });
    }
  }, [code, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await axios.post('/api/auth/kakao', { nick: inputRef.current?.value, user: userInfo });
    router.replace('/');
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

export default Kakao;

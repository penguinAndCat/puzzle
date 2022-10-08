import axios from 'libs/axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useUser = (): [
  {
    nickname: string;
    email: string;
    name: string;
    picture: string;
    id: string;
  },
  Dispatch<
    SetStateAction<{
      nickname: string;
      email: string;
      name: string;
      picture: string;
      id: string;
    }>
  >
] => {
  const [user, setUser] = useState<{ nickname: string; email: string; name: string; picture: string; id: string }>({
    nickname: '',
    email: '',
    name: '',
    picture: '',
    id: '',
  });

  useEffect(() => {
    axios.get('/api/auth').then((res) => {
      const user = res.data.user;
      setUser({
        nickname: user.nickname,
        email: user.email,
        picture: user.picture,
        id: user._id,
        name: user.name,
      });
    });
  }, []);
  return [user, setUser];
};

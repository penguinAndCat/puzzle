import { setCookie } from 'cookies-next';
import dbConnect from 'libs/db/mongoose';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

interface UserInfo {
  email: string;
  name: string;
  picture: string;
  [key: string]: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await dbConnect();
  // 회원가입 or 로그인
  if (method === 'POST') {
    const nick = req.body.nick;
    const isExistNick = await User.exists({ nickname: nick });
    if (isExistNick) {
      res.status(500).json({ message: 'already Exist Nick' });
    } else {
      const { email, name, picture } = req.body.user;
      const accessToken = makeAccessToken({ name: name, nickname: nick, email: email, provider: 'google' });
      const refreshToken = makeRefreshToken({ name: name, nickname: nick, email: email, provider: 'google' });
      setCookie('accessToken', accessToken, {
        req,
        res,
        expires: new Date(new Date().getTime() + 1000 * 60 * 60),
        httpOnly: true,
        sameSite: true,
      });
      setCookie('refreshToken', refreshToken, {
        req,
        res,
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        sameSite: true,
      });
      const newUser = await User.create({
        name: name,
        email: email,
        picture: picture,
        provider: 'google',
        nickname: nick,
        refreshToken: refreshToken,
      });
      res.json({ message: 'success' });
    }
  }
}

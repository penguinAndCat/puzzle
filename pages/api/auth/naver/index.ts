import { setCookie } from 'cookies-next';
import axios from 'libs/axios';
import dbConnect from 'libs/db/mongoose';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await dbConnect();

  if (method === 'POST') {
    const nick = req.body.nick;
    const isExistNick = await User.exists({ nickname: nick });
    if (isExistNick) {
      res.status(500).json({ message: 'already Exist Nick' });
    } else {
      const user = req.body.user;
      const accessToken = makeAccessToken({ name: user.name, nickname: nick, email: user.email, provider: 'naver' });
      const refreshToken = makeRefreshToken({ name: user.name, nickname: nick, email: user.email, provider: 'naver' });
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
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: 'naver',
        nickname: nick,
        refreshToken: refreshToken,
      });
      res.json({ message: 'success' });
    }
  }
}

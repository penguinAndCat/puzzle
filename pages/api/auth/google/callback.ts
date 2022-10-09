import { setCookie } from 'cookies-next';
import axios from 'libs/axios';
import dbConnect from 'libs/db/mongoose';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  await dbConnect();
  if (method === 'GET') {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo ', {
      headers: {
        Authorization: `Bearer ${query.code}`,
      },
    });
    const { email, name, picture } = response.data;

    const isExist = await User.findOne({ provider: 'google', name: name, email: email });
    if (isExist) {
      const accessToken = makeAccessToken({ name: isExist.name, nickname: isExist.nickname, provider: 'google' });
      const refreshToken = makeRefreshToken({ name: isExist.name, nickname: isExist.nickname, provider: 'google' });
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
      res.json({ message: 'success' });
    } else {
      res.json({ message: 'start signup', user: { email, name, picture } });
    }
  }
}

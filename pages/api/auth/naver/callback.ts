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
    const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${query.code}`,
      },
    });
    const data = response.data.response;
    const userInfo = {
      name: data.name,
      email: data.email,
      picture: data.profile_image,
    };
    const isExist = await User.findOne({ provider: 'naver', name: userInfo.name, email: userInfo.email });
    if (isExist) {
      const accessToken = makeAccessToken({ name: isExist.name, nickname: isExist.nickname, provider: 'naver' });
      const refreshToken = makeRefreshToken({ name: isExist.name, nickname: isExist.nickname, provider: 'naver' });
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
      res.json({ message: 'success', user: userInfo });
    }
  }
}

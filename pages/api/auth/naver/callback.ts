import { setCookie } from 'cookies-next';
import axios from 'libs/axios';
import dbConnect from 'libs/db/mongoose';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import { login } from 'libs/login/login';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; user?: { name: string; email: string; picture: string }; error?: any }>
) {
  const { method, query } = req;
  await dbConnect();
  if (method === 'GET') {
    try {
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
        login({ name: isExist.name, nickname: isExist.nickname }, 'naver', req, res);
        return res.json({ message: 'success' });
      }
      res.json({ message: 'success', user: userInfo });
    } catch (err) {
      res.status(500).json({ message: 'fail', error: err });
    }
  }
}

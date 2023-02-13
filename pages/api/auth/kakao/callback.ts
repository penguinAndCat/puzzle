import { setCookie } from 'cookies-next';
import axios from 'apis/axios';
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
      const response = await axios.get('https://kauth.kakao.com/oauth/token', {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
          redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
          code: query.code,
          client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
        },
      });
      const token = response.data.access_token;
      const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = {
        name: userInfo.data.properties.nickname,
        email: userInfo.data.kakao_account.email,
        picture: userInfo.data.properties.profile_image,
      };
      const isExist = await User.findOne({ provider: 'kakao', name: userData.name, email: userData.email });
      if (isExist) {
        login({ name: isExist.name, nickname: isExist.nickname }, 'kakao', req, res);
        return res.json({ message: 'success' });
      }
      res.json({ message: 'success', user: userData });
    } catch (err) {
      res.status(500).json({ message: 'fail', error: err });
    }
  }
}

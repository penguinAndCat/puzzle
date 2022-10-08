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
      picture: userInfo.data.properties.profile_image_url,
    };
    const isExist = await User.findOne({ provider: 'kakao', name: userData.name, email: userData.email });
    if (isExist) {
      const accessToken = makeAccessToken({ name: isExist.name, nickname: isExist.nickname, provider: 'kakao' });
      const refreshToken = makeRefreshToken({ name: isExist.name, nickname: isExist.nickname, provider: 'kakao' });
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
      res.json({ message: 'success', user: userData });
    }
  }
}

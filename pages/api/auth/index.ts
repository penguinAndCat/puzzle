import type { NextApiRequest, NextApiResponse } from 'next';

import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import jwtDecode from 'jwt-decode';
import { makeAccessToken } from 'libs/jwt';
import dbConnect from 'libs/db/mongoose';
import User from 'models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    try {
      const accessToken = getCookie('accessToken', { req, res });
      const refreshToken = getCookie('refreshToken', { req, res });
      if (accessToken) {
        const user = jwtDecode<{
          nickname: string;
          email: string;
          name: string;
          picture: string;
          provider: string;
        }>(accessToken as string);
        const savedUser = await User.findOne({ name: user.name, provider: user.provider, nickname: user.nickname });
        return res.status(200).json({
          user: {
            id: savedUser._id,
            name: savedUser.name,
            nickname: savedUser.nickname,
            picture: savedUser.picture,
            email: savedUser.email,
          },
          message: 'success',
        });
      } else if (refreshToken) {
        const savedUser = await User.findOne({ refreshToken: refreshToken });
        if (!savedUser) {
          res.status(200).json({ message: 'fail' });
          res.end();
        }
        const accessToken = makeAccessToken({
          name: savedUser.name,
          provider: savedUser.provider,
          email: savedUser.email,
          nickname: savedUser.nickname,
          id: savedUser._id,
        });
        setCookie('accessToken', accessToken, {
          req,
          res,
          expires: new Date(new Date().getTime() + 1000 * 60 * 60),
          httpOnly: true,
          sameSite: true,
        });
        return res.status(200).json({
          user: {
            id: savedUser._id,
            name: savedUser.name,
            nickname: savedUser.nickname,
            picture: savedUser.picture,
            email: savedUser.email,
          },
          message: 'success',
        });
      }
      return res.json({ message: 'failed' });
    } catch (err) {
      console.log(err);
    }
  }
  if (method === 'DELETE') {
    try {
      deleteCookie('accessToken', { req, res });
      deleteCookie('refreshToken', { req, res });
      return res.status(200).json({ message: 'success' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'fail' });
    }
  }
}

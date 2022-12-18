import type { NextApiRequest, NextApiResponse } from 'next';

import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import jwtDecode from 'jwt-decode';
import { decodePayload, makeAccessToken } from 'libs/jwt';
import dbConnect from 'libs/db/mongoose';
import User from 'models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    try {
      const accessToken = getCookie('accessToken', { req, res });
      const refreshToken = getCookie('refreshToken', { req, res });
      if (accessToken && decodePayload(accessToken as string)) {
        const user: {
          nickname: string;
          name: string;
          provider: string;
        } = decodePayload(accessToken as string) as {
          nickname: string;
          name: string;
          provider: string;
        };

        const savedUser = await User.findOne({ name: user.name, provider: user.provider, nickname: user.nickname });
        if (!savedUser) {
          return res.status(500).json({ message: 'fail' });
        }
        return res.status(200).json({
          user: {
            id: savedUser._id.toString(),
            name: savedUser.name,
            nickname: savedUser.nickname,
            picture: savedUser.picture,
            email: savedUser.email,
          },
          message: 'success',
        });
      } else if (refreshToken && decodePayload(refreshToken as string)) {
        const user: {
          nickname: string;
          name: string;
          provider: string;
        } = decodePayload(refreshToken as string) as {
          nickname: string;
          name: string;
          provider: string;
        };
        const { name, provider, nickname } = user;
        const savedUser = await User.findOne({ name, nickname, provider });

        if (!savedUser) {
          return res.status(500).json({ message: 'fail' });
        }
        const accessToken = makeAccessToken({
          name: savedUser.name,
          nickname: savedUser.nickname,
          provider: savedUser.provider,
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
            id: savedUser._id.toString(),
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
      return res.json({ message: 'failed' });
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

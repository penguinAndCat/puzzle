import { setCookie } from 'cookies-next';
import axios from 'libs/axios';
import dbConnect from 'libs/db/mongoose';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import { signup } from 'libs/login/signup';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string; error?: any }>) {
  const { method } = req;
  await dbConnect();

  if (method === 'POST') {
    try {
      const nick = req.body.nick;
      if (nick.length > 5) {
        return res.status(500).json({ message: '닉네임은 5글자 이하입니다.' });
      }
      const isExistNick = await User.exists({ nickname: nick });
      if (isExistNick) {
        return res.status(500).json({ message: 'already Exist Nick' });
      }
      const { email, name, picture } = req.body.user;
      await signup({ name, email, picture, nickname: nick }, 'naver', req, res);
      res.json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ message: 'fail', error: err });
    }
  }
}

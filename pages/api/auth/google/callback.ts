import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/User';
import axios from 'apis/axios';
import dbConnect from 'libs/db/mongoose';
import { login } from 'libs/login/login';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; user?: { name: string; email: string; picture: string }; error?: any }>
) {
  const { method, query } = req;
  await dbConnect();
  if (method === 'GET') {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo ', {
        headers: {
          Authorization: `Bearer ${query.code}`,
        },
      });
      const { email, name, picture } = response.data;
      const isExist = await User.findOne({ provider: 'google', name: name, email: email });
      if (isExist) {
        login({ name: isExist.name, nickname: isExist.nickname }, 'google', req, res);
        return res.json({ message: 'success' });
      }
      return res.json({ message: 'start signup', user: { email, name, picture } });
    } catch (err) {
      res.status(500).json({ message: 'fail', error: err });
    }
  }
}

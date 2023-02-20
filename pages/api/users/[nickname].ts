import dbConnect from 'libs/db/mongoose';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  user?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    const { nickname } = req.query;
    try {
      const user = await User.findOne({ nickname: nickname }, { _id: 0, nickname: 1, picture: 1 });
      res.status(201).json({ user: user, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

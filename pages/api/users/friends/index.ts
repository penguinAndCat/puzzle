import dbConnect from 'libs/db/mongoose';
import Alarm from 'models/Alarm';
import Friend from 'models/Friend';
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

  if (method === 'POST') {
    const { userId, friendNickname } = req.body.data;
    try {
      const user: any = await User.findOne({ nickname: friendNickname });
      const friend: any = await Friend.findOne({ userId: userId, friend: user._id });
      if (friend !== null) {
        return res.status(201).json({ message: 'duplicated' });
      }
      await Friend.create({
        userId: userId,
        friend: user._id,
      });
      await Friend.create({
        userId: user._id,
        friend: userId,
      });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

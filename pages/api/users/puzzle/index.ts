import dbConnect from 'libs/db/mongoose';
import Notice from 'models/Notice';
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
    const { requester, requestedNickname } = req.body.data;
    try {
      const user: any = await User.findOne({ nickname: requestedNickname });
      const notice: any = await Notice.findOne({ requester: requester, requested: user._id });
      if (notice !== null) {
        return res.status(201).json({ message: 'duplicated' });
      }
      await Notice.create({
        requester: requester,
        requested: user._id,
        type: 'puzzle'
      });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

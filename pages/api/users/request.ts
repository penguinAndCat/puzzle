import dbConnect from 'libs/db/mongoose';
import Alarm from 'models/Alarm';
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
    const data = req.body.data;
    console.log(data);
    const { requester, requestedNickname } = req.body.data;
    console.log(requester, requestedNickname);
    try {
      const user: any = await User.findOne({ nickname: requestedNickname });
      const alarm: any = await Alarm.findOne({ requester: requester, requested: user._id });
      if (alarm !== null) {
        return res.status(201).json({ message: 'duplicated' });
      }
      await Alarm.create({
        requester: requester,
        requested: user._id,
      });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

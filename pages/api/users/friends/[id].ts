import dbConnect from 'libs/db/mongoose';
import Friend from 'models/Friend';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  friends?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    const { id } = req.query;
    try {
      const friends = await Friend.aggregate([
        { $match: { userId: id } },
        {
          $lookup: {
            from: 'users',
            let: { userObjId: { $toObjectId: '$friend' } },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userObjId'] } } }],
            as: 'user',
          },
        },
        { $unwind: '$user' },
        { $project: { _id: 0, nickname: '$user.nickname', picture: '$user.picture' } },
      ]);
      console.log(friends);
      res.status(201).json({ friends: friends, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

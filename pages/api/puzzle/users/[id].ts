import dbConnect from 'libs/db/mongoose';
import mongoose from 'mongoose';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  item?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  const { id } = req.query;
  const userId = new mongoose.Types.ObjectId(String(id));
  await dbConnect();
  if (method === 'GET') {
    try {
      const users = await Puzzle.aggregate([
        { $match: { _id: userId } },
        { $unwind: '$invitedUser' },
        {
          $lookup: {
            from: 'users',
            let: { userObjId: { $toObjectId: '$invitedUser' } },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userObjId'] } } }],
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'friends',
            let: { friendId: '$invitedUser' },
            pipeline: [{ $match: { $expr: { $eq: ['$friend', '$$friendId'] } } }],
            as: 'friend',
          },
        },
        { $unwind: '$user' },
        { 
          $project: {
            _id: 0, 
            nickname: '$user.nickname', 
            id: '$user._id', 
            picture: '$user.picture', 
            isFriend: { $size : '$friend' } 
          } 
        },
      ]);
      res.status(201).json({ item: users, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
  if (method === 'PUT') {
    try {
      return;
      res.status(201).json({ item: 'users', message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

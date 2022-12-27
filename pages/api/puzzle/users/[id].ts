import dbConnect from 'libs/db/mongoose';
import mongoose from 'mongoose';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  const { id, userId } = req.query;
  const puzzleId = new mongoose.Types.ObjectId(String(id));
  await dbConnect();
  if (method === 'GET') {
    try {
      const users = await Puzzle.aggregate([
        { $match: { _id: puzzleId } },
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
            pipeline: [{ 
              $match: { 
                $expr: { 
                  $and: [ 
                    { $eq: ['$friend', '$$friendId'] },
                    { $eq: ['$userId', userId] }
                  ] 
                } 
              } 
            }],
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
            isFriend: { $size : '$friend' },
          } 
        },
      ]);
      const host = await Puzzle.aggregate([
        { $match: { _id: puzzleId } },
        {
          $lookup: {
            from: 'users',
            let: { userObjId: { $toObjectId: '$userId' } },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userObjId'] } } }],
            as: 'user',
          },
        },
        { $unwind: '$user' },
        { 
          $project: {
            _id: 0, 
            nickname: '$user.nickname', 
            id: '$user._id', 
            picture: '$user.picture', 
          } 
        },
      ]);
      const data = {
        host: host[0],
        users: users,
      }
      res.status(201).json({ data: data, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

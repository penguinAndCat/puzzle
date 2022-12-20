import dbConnect from 'libs/db/mongoose';
import mongoose from 'mongoose';
import Friend from 'models/Friend';
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
    const { puzzleId } = req.query;
    try {
      if(puzzleId === undefined) {
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
          { 
            $project: { 
              _id: 0, 
              nickname: '$user.nickname', 
              picture: '$user.picture', 
            },
          },
        ]);
        return res.status(201).json({ friends: friends, message: 'success' });
      }
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
        {
          $lookup: {
            from: 'puzzles',
            let: { puzzleObjId: { $toObjectId: puzzleId } },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$puzzleObjId'] } } }],
            as: 'puzzle',
          },
        },
        { $unwind: '$puzzle' },
        { 
          $addFields: {
            'userId': { $toString: '$user._id' }
        }},
        { 
          $addFields: {
            'isInvited': {
              '$cond': [ { '$in': [ '$userId', '$puzzle.invitedUser' ] }, true, false ]
          }}
        },
        { 
          $project: { 
            _id: 0, 
            nickname: '$user.nickname', 
            picture: '$user.picture', 
            isInvited: '$isInvited',
          },
        },
      ]);
      res.status(201).json({ friends: friends, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

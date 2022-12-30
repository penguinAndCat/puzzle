import dbConnect from 'libs/db/mongoose';
import mongoose from 'mongoose';
import Friend from 'models/Friend';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import { decodePayload } from 'libs/jwt';
import User from 'models/User';

type Data = {
  friends?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    try {
      const accessToken = getCookie('accessToken', { req, res });
      if (!accessToken) {
        return res.status(401).json({ message: 'not authorizied' });
      }
      const userInfo = decodePayload<{
        name: string;
        nickname: string;
        provider: string;
        iat: number;
        exp: number;
        iss: string;
      }>(accessToken);

      const user = await User.findOne({ nickname: userInfo.nickname });
      const { puzzleId } = req.query;

      if (puzzleId === undefined) {
        const friends = await Friend.aggregate([
          { $match: { userId: user._id.toString() } },
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
        { $match: { userId: user._id.toString() } },
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
            userId: { $toString: '$user._id' },
          },
        },
        {
          $addFields: {
            isInvited: {
              $cond: [{ $in: ['$userId', '$puzzle.invitedUser'] }, true, false],
            },
          },
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

import dbConnect from 'libs/db/mongoose';
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
  if (method === 'DELETE') {
    try {
      const accessToken = getCookie('accessToken', { req, res });
      if (!accessToken) {
        return res.status(401).json({ message: 'not authorizied' });
      }

      const { friendNickname, id } = req.query;
      const friend = await User.findOne({ nickname: friendNickname });
      if (!friend) {
        res.status(500).json({ message: '존재하지 않는 유저입니다.' });
      }
      await Friend.deleteOne({ userId: id, friend: friend._id.toString() });
      await Friend.deleteOne({ userId: friend._id.toString(), friend: id });
      return res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
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
          $addFields: {
            isHost: {
              $eq: ['$user._id', '$puzzle.userId'],
            },
          },
        },
        {
          $project: {
            _id: 0,
            nickname: '$user.nickname',
            picture: '$user.picture',
            isInvited: '$isInvited',
            isHost: '$isHost',
          },
        },
      ]);
      res.status(201).json({ friends: friends, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

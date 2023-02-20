import dbConnect from 'libs/db/mongoose';
import Notice from 'models/Notice';
import Friend from 'models/Friend';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import { decodePayload } from 'libs/jwt';
import { pusher } from 'libs/pusher';

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
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
  if (method === 'DELETE') {
    try {
      const { userId, friendNickname } = req.query;
      const user: any = await User.findOne({ nickname: friendNickname });
      await Notice.deleteOne({
        requester: user._id,
        requested: userId,
      });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
  if (method === 'PUT') {
    const { userId, friendNickname } = req.body.data;
    try {
      const user: any = await User.findOne({ nickname: friendNickname });
      const friend: any = await Friend.findOne({ userId: userId, friend: user._id });
      if (friend !== null) {
        return res.status(202).json({ message: 'duplicated' });
      }
      await Friend.create({
        userId: userId,
        friend: user._id,
      });
      await Friend.create({
        userId: user._id,
        friend: userId,
      });
      await Notice.deleteOne({
        requester: user._id,
        requested: userId,
      });
      res.status(202).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
  if (method === 'POST') {
    const { requester, requestedNickname } = req.body.data;
    try {
      const requestedUser: any = await User.findOne({ nickname: requestedNickname });
      const requesterUser: any = await User.findOne({ _id: requester });
      const notice: any = await Notice.findOne({ requester: requester, requested: requestedUser._id });
      if (notice !== null) {
        return res.status(201).json({ message: 'duplicated' });
      }
      const newNotice = await Notice.create({
        requester: requester,
        requested: requestedUser._id,
        type: 'friend',
      });
      await pusher.trigger(`presence-${requestedUser._id}`, 'onNotice', {
        friend: true,
        nickname: requesterUser.nickname,
        picture: requesterUser.picture,
        noticeId: newNotice._id.toString(),
      });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

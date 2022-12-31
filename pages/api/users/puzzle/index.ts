import dbConnect from 'libs/db/mongoose';
import Notice from 'models/Notice';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import Puzzle from 'models/Puzzle';
import { pusher } from 'libs/pusher';

type Data = {
  user?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'PUT') {
    const { userId, puzzleId } = req.body.data;
    try {
      const checkedPuzzle = await Puzzle.find({ _id: puzzleId, invitedUser: userId });
      if (checkedPuzzle.length > 0) {
        return res.status(400).json({ message: 'failed' });
      }

      await Puzzle.updateOne({ _id: puzzleId }, { $push: { invitedUser: userId } });
      const puzzle = await Puzzle.findOne({ _id: puzzleId });
      const user = await User.findOne({ _id: userId });
      await Notice.deleteOne({
        requested: userId,
        puzzleId: puzzleId,
      });
      await pusher.trigger(`presence-${puzzle._id.toString()}`, 'invited', {
        puzzle: true,
        nickname: user.nickname,
      });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
  if (method === 'POST') {
    const { requester, requestedNickname, puzzleId } = req.body.data;
    try {
      const user = await User.findOne({ nickname: requestedNickname });
      const notice = await Notice.findOne({ requester: requester, requested: user._id });
      if (notice !== null) {
        return res.status(201).json({ message: 'duplicated' });
      }
      await Notice.create({
        requester: requester,
        requested: user._id,
        puzzleId: puzzleId,
        type: 'puzzle',
      });
      await pusher.trigger(`presence-${user._id}`, 'onNotice', {
        puzzle: true,
        nickname: requestedNickname,
      });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

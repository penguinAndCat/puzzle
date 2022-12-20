import dbConnect from 'libs/db/mongoose';
import mongoose from 'mongoose';
import Notice from 'models/Notice';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import Puzzle from 'models/Puzzle';

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
      const puzzle = await Puzzle.find(
        { _id: puzzleId, invitedUser: userId }
      );
      if(puzzle.length > 0) {
        return res.status(400).json({ message: 'failed' });
      }
      await Puzzle.updateOne(
        { _id: puzzleId },
        { $push: { invitedUser: userId } 
      });
      await Notice.deleteOne({
        requested: userId,
        puzzleId: puzzleId,
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
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

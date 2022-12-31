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
  await dbConnect();
  if (method === 'GET') {
    const { id } = req.query;
    try {
      const userId = new mongoose.Types.ObjectId(String(id));
      const info = await Puzzle.aggregate([
        { $match: { _id: userId } },
        { $project: { _id: 0, title: 1, secretRoom: 1, level: 1 } },
      ]);
      if (info.length > 0) {
        return res.status(201).json({ item: info[0], message: 'success' });
      }
      res.status(500).json({ error: 'none info', message: 'failed' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

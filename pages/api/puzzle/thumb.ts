import dbConnect from 'libs/db/mongoose';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  puzzle?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    try {
      const puzzle = await Puzzle.find({ thumbImage: { $exists: false } });
      res.status(201).json({ puzzle: puzzle, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
  if (method === 'PUT') {
    const { thumbImage, puzzleId } = req.body;
    try {
      await Puzzle.updateOne(
        { _id: puzzleId },
        {
          $set: {
            thumbImage: thumbImage,
          },
        }
      );
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
}

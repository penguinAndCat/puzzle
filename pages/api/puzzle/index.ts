// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from 'libs/db/mongoose';
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
  if (method === 'POST') {
    try {
      const puzzle = await Puzzle.create(req.body.data);
      res.status(201).json({ item: puzzle, message: 'success' });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
  if (method === 'GET') {
    const { id } = req.query;
    try {
      const puzzle = await Puzzle.findById(id);
      res.status(201).json({ item: puzzle, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

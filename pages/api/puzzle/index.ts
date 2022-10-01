import dbConnect from 'libs/db/mongoose';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = {
  item?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token = await getToken({ req });
  if (!token) {
    // Signed in
    res.status(401).json({ message: 'unauthorized' });
  }
  const { method } = req;
  await dbConnect();
  if (method === 'POST') {
    try {
      const puzzle = new Puzzle(req.body.data);
      puzzle.save((err: any, doc: any) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'failed', error: err });
        }
        res.status(201).json({ item: doc, message: 'success' });
      });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
  if (method === 'GET') {
    const { id } = req.query;
    try {
      const puzzle = await Puzzle.findById(id);
      console.log(puzzle);
      res.status(201).json({ item: puzzle, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

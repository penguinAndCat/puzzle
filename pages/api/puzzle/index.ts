import dbConnect from 'libs/db/mongoose';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth/next';
import authOptions from '../auth/[...nextauth]';

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
  console.log('JSON Web Token', JSON.stringify(token, null, 2));
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

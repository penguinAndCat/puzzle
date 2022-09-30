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
  if (method === 'PUT') {
    try {
      const { id } = req.query;
      console.log(req.body.data, id);
      await Puzzle.updateOne(
        { _id: id },
        {
          $set: {
            config: req.body.data.config,
          },
        }
      );
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
}

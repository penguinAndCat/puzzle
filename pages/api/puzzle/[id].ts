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

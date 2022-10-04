import dbConnect from 'libs/db/mongoose';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { NextApiResponseServerIO } from 'types/next';

type Data = {
  item?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
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
      await Puzzle.updateOne(
        { _id: id },
        {
          $set: {
            config: req.body.data.config,
          },
        }
      );
      const groupTiles = req.body.data.config.groupTiles;
      const socketCanvasSize = req.body.data.config.canvasSize;
      if (id !== undefined)
        res?.socket?.server?.io?.to(id).emit('groupTiles', {
          groupTiles: groupTiles,
          indexArr: req.body.data.indexArr,
          socketCanvasSize: socketCanvasSize,
        });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
}

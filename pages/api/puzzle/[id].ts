import dbConnect from 'libs/db/mongoose';
import { pusher } from 'libs/pusher';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from 'types/next';

type Data = {
  item?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  const { method } = req;
  const { id } = req.query;
  await dbConnect();
  if (method === 'PUT') {
    try {
      await Puzzle.updateOne(
        { _id: id },
        {
          $set: {
            config: req.body.data.config,
          },
        }
      );
      await Puzzle.updateOne(
        { _id: id },
        {
          $set: {
            perfection: req.body.data.perfection,
          },
        }
      );
      const groupTiles = req.body.data.config.groupTiles;
      const indexArr = req.body.data.indexArr;
      const socketCanvasSize = req.body.data.config.canvasSize;
      const userNickName = req.body.data.userNickName;
      const socketId = req.body.data.socketId;
      // if (id !== undefined)
      //   res?.socket?.server?.io?.to(id).emit('groupTiles', {
      //     groupTiles: groupTiles,
      //     indexArr: indexArr,
      //     socketCanvasSize: socketCanvasSize,
      //     socketId: socketId,
      //   });
      if (id !== undefined) {
        await pusher.trigger(`presence-${id}`, 'movePuzzle', {
          groupTiles: groupTiles,
          indexArr: indexArr,
          socketCanvasSize: socketCanvasSize,
          userNickName: userNickName,
          socketId: socketId,
        });
      }
      res.status(201).json({ message: 'success' });
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
  if (method === 'DELETE') {
    try {
      const { id } = req.query;
      await Puzzle.deleteOne({ _id: id });
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

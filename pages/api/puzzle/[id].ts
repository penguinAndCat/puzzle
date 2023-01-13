import dbConnect from 'libs/db/mongoose';
import { pusher } from 'libs/pusher';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from 'types/next';

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
            'config.groupTiles': req.body.data.groupTiles,
            'config.canvasSize': req.body.data.canvasSize,
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
      const groupTiles = req.body.data.groupTiles;
      const indexArr = req.body.data.indexArr;
      const socketCanvasSize = req.body.data.canvasSize;
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
          socketId: socketId,
        });
      }
      res.status(201).json({ message: 'success' });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
  if (method === 'POST') {
    try {
      await Puzzle.updateOne(
        { _id: id },
        {
          $set: {
            'config.groupTiles': req.body.data.groupTiles,
            'config.canvasSize': req.body.data.canvasSize,
          },
        }
      );
      const groupTiles = req.body.data.groupTiles;
      const socketId = req.body.data.socketId;
      if (id !== undefined) {
        await pusher.trigger(`presence-${id}`, 'movablePuzzle', {
          groupTiles: groupTiles,
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
      res.status(404).json({ error: err, message: 'failed' });
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

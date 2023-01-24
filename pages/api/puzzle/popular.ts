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
      const puzzle = await Puzzle.aggregate([
        {
          $addFields: {
            popular: { $multiply: ['$perfection', '$config.tilesPerColumn', '$config.tilesPerRow'] },
          },
        },
        {
          $addFields: {
            puzzleNumber: { $multiply: ['$config.tilesPerColumn', '$config.tilesPerRow'] },
          },
        },
        {
          $addFields: {
            src: '$config.puzzleImage.src',
          },
        },
        {
          $match: {
            perfection: { $not: { $eq: 1 } },
            secretRoom: false,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            perfection: 1,
            thumbImage: 1,
            puzzleNumber: '$puzzleNumber',
            popular: '$popular',
            src: '$src',
          },
        },
      ])
        .sort({
          popular: -1,
        })
        .limit(4);
      res.status(201).json({ puzzle: puzzle, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

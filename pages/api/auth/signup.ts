import dbConnect from 'libs/db/mongoose';
import User from 'model/User';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  if (method === 'POST') {
    const { name, email, password } = req.body;
    try {
      await dbConnect();
      const isExist = await User.findOne({ email, provider: 'custom-email' });
      if (isExist) {
        throw new Error('aleady exist user');
      }
      await User.create({ name, email, password, provider: 'custom-email' });
      res.status(200).json({ message: 'success' });
    } catch (err) {
      res.status(400).json({ message: 'fail', error: err });
    }
  }
}

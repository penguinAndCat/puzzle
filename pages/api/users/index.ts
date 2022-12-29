import { getCookie } from 'cookies-next';
import { saveImage } from 'libs/common/saveImage';
import dbConnect from 'libs/db/mongoose';
import { decodePayload } from 'libs/jwt';
import { login } from 'libs/login/login';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  user?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();

  if (method === 'PUT') {
    try {
      const body = req.body;
      const accessToken = getCookie('accessToken', { req, res });
      if (!accessToken) {
        return res.status(401).json({ message: 'not authorizied' });
      }
      const userInfo = decodePayload<{
        name: string;
        nickname: string;
        provider: string;
        iat: number;
        exp: number;
        iss: string;
      }>(accessToken);
      const user = await User.findOne({ nickname: userInfo.nickname });
      if (body.nickname) {
        const isExist = await User.exists({ nickname: body.nickname });
        if (isExist) {
          return res.status(400).json({ message: '이미 존재하는 닉네임입니다.' });
        }
        user.nickname = body.nickname;
      }
      if (body.profileImage) {
        const imageUrl = await saveImage(body.profileImage);
        user.picture = imageUrl;
      }
      await user.save();
      login({ name: user.name, nickname: user.nickname }, user.provider, req, res);
      res.status(200).json({ user: user, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

import { setCookie } from 'cookies-next';
import dbConnect from 'libs/db/mongoose';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

interface UserInfo {
  email: string;
  name: string;
  picture: string;
  [key: string]: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await dbConnect();
  // 회원가입 or 로그인
  if (method === 'POST') {
    try {
      const userInfo = req.body.data;
      const isExist = await User.findOne({
        name: userInfo.name,
        provider: 'google',
        email: userInfo.email,
      });
      if (isExist) {
        const tokenUser = {
          name: isExist.name,
          provider: 'google',
          nickname: isExist.nickname,
        };
        const accessToken = makeAccessToken(tokenUser);
        const refreshToken = makeRefreshToken(tokenUser);
        const savedUser = await User.findOneAndUpdate(
          { name: userInfo.name, provider: 'google', email: userInfo.email },
          { $set: { refreshToken: refreshToken } },
          { new: true }
        );
        setCookie('accessToken', accessToken, {
          req,
          res,
          expires: new Date(new Date().getTime() + 1000 * 60 * 60),
          httpOnly: true,
          sameSite: true,
        });
        setCookie('refreshToken', refreshToken, {
          req,
          res,
          expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
          httpOnly: true,
          sameSite: true,
        });
        return res.status(200).json({ message: 'success', token: accessToken });
      } else {
        if (userInfo.nickname) {
          const isExistUser = await User.exists({ nickname: userInfo.nickname });
          if (isExistUser) {
            return res.status(500).json({ message: 'aleady Exist User' });
          }
          const newUser = await User.create({
            name: userInfo.name,
            provider: 'google',
            email: userInfo.email,
            picture: userInfo.picture,
            nickname: userInfo.nickname,
          });
          const tokenUser = {
            name: newUser.name,
            provider: 'google',
            nickname: newUser.nickname,
          };
          const accessToken = makeAccessToken(tokenUser);
          const refreshToken = makeRefreshToken(tokenUser);
          const savedUser = await User.findOneAndUpdate(
            { name: userInfo.name, provider: 'google', email: userInfo.email },
            { $set: { refreshToken: refreshToken } },
            { new: true }
          );
          setCookie('accessToken', accessToken, {
            req,
            res,
            expires: new Date(new Date().getTime() + 1000 * 60 * 60),
            httpOnly: true,
            sameSite: true,
          });
          setCookie('refreshToken', refreshToken, {
            req,
            res,
            expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
            httpOnly: true,
            sameSite: true,
          });
          return res.status(200).json({ message: 'success', token: accessToken });
        } else {
          return res.status(200).json({ message: 'need nickname', token: null });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

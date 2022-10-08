import { getCookie, getCookies, setCookie } from 'cookies-next';
import dbConnect from 'libs/db/mongoose';
import { decodePayload, makeAccessToken, makeRefreshToken } from 'libs/jwt';
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

  // 유저 존재여부
  if (method === 'GET') {
    try {
      const { name, email, provider } = req.query;
      const user = await User.exists({
        name,
        email,
        provider,
      });
      if (user) {
        res.json({
          user: true,
          message: 'exist user',
        });
        res.end();
      } else {
        res.json({ message: 'not exist user', user: false });
        res.end();
      }
    } catch (err) {
      console.log(err);
    }
  }

  // 회원가입 or 로그인
  if (method === 'POST') {
    try {
      const userInfo = req.body.data;
      userInfo.provider = 'google';
      if (userInfo.nickname) {
        const nick = await User.exists({ nickname: userInfo.nickname });
        if (nick) {
          res.status(500).json({ message: 'already exist nickname' });
          res.end();
        }
      }
      //로그인
      const dbUser = await User.findOne({ provider: 'google', name: userInfo.name, email: userInfo.email });
      console.log(dbUser);
      if (dbUser) {
        const accessToken = makeAccessToken({
          nickname: dbUser.nickname,
          email: dbUser.email,
          name: dbUser.name,
          picture: dbUser.picture,
          provider: dbUser.provider,
        });
        const refreshToken = makeRefreshToken({
          nickname: dbUser.nickname,
          email: dbUser.email,
          name: dbUser.name,
          picture: dbUser.picture,
          provider: dbUser.provider,
        });
        const savedUser = await User.findOneAndUpdate(
          { nickname: dbUser.nickname },
          { refreshToken: refreshToken },
          {
            new: true,
          }
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
        res.status(200).json({ message: 'success', user: savedUser });
        res.end();
      }
      // 회원가입 & 최초 로그인
      const accessToken = makeAccessToken(userInfo);
      const refreshToken = makeRefreshToken(userInfo);
      userInfo.refreshToken = refreshToken;
      const user = await User.create(userInfo);
      const savedUser = await user.save();
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
      res.status(200).json({ message: 'success', user: savedUser });
      res.end();
    } catch (err) {
      console.log(err);
    }
  }
}

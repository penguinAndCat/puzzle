import { setCookie } from 'cookies-next';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import User from 'models/User';
import { NextApiRequest, NextApiResponse } from 'next';

export async function signup(
  user: { name: string; nickname: string; email: string; picture: string },
  provider: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, nickname, email, picture } = user;
  const accessToken = makeAccessToken({ name, nickname, provider });
  const refreshToken = makeRefreshToken({ name, nickname, provider });

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
  const newUser = await User.create({
    name: user.name,
    email: email,
    picture: picture,
    nickname,
    provider: provider,
    refreshToken: refreshToken,
  });
}

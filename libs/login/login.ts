import { setCookie } from 'cookies-next';
import { makeAccessToken, makeRefreshToken } from 'libs/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export function login(
  user: { name: string; nickname: string },
  provider: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = makeAccessToken({ ...user, provider });
  const refreshToken = makeRefreshToken({ ...user, provider });
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
}

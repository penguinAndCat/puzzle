import type { NextApiRequest, NextApiResponse } from 'next';

import { getCookie, setCookie } from 'cookies-next';
import jwtDecode from 'jwt-decode';
import { makeAccessToken } from 'libs/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const accessToken = getCookie('accessToken', { req, res });
      const refreshToken = getCookie('refreshToken', { req, res });
      if (accessToken) {
        const user = jwtDecode(accessToken as string);
        res.status(200).json({ user: user, message: 'success' });
        res.end();
      } else if (refreshToken) {
        const user = jwtDecode<{
          nickname: string;
          email: string;
          name: string;
          picture: string;
          provider: string;
        }>(refreshToken as string);
        const accessToken = makeAccessToken({
          name: user.name,
          provider: user.provider,
          email: user.email,
          nickname: user.nickname,
        });
        setCookie('accessToken', accessToken, {
          req,
          res,
          expires: new Date(new Date().getTime() + 1000 * 60 * 60),
          httpOnly: true,
          sameSite: true,
        });
        res.status(200).json({ user: user, message: 'success' });
        res.end();
      } else {
        res.status(500).json({ message: 'fail' });
        res.end();
      }
    } catch (err) {
      console.log(err);
    }
  }
}

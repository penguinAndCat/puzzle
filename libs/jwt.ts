import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;
const issuer = process.env.JWT_ISSUER;
const algorithm = 'HS384';
const accessTokenExp = '1hr';
const refreshTokenExp = '30d';

function makeAccessToken(payload: object) {
  return jwt.sign(payload, secretKey, { algorithm, expiresIn: accessTokenExp, issuer });
}
function makeRefreshToken(payload: object) {
  return jwt.sign(payload, secretKey, { algorithm, expiresIn: refreshTokenExp, issuer });
}

function decodePayload<T>(token: any): T {
  return jwt.verify(token, secretKey) as T;
}

export { makeAccessToken, makeRefreshToken, decodePayload };

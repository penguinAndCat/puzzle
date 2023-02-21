import { rest } from 'msw';
import friends from './api/users/friends.json';

export const handlers = [
  rest.get('/api/users/friends', (req, res, ctx) => {
    return res(ctx.json(friends));
  }),
];

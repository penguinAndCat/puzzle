import { rest } from 'msw';
import { friends, puzzleFriends, puzzleId } from '.mocks/api/users/friends';

export const handlers = [
  rest.get('/api/users/friends', (req, res, ctx) => {
    return res(ctx.json(friends));
  }),
  rest.get(`/api/users/friends/${puzzleId}`, (req, res, ctx) => {
    return res(ctx.json(puzzleFriends));
  }),
];

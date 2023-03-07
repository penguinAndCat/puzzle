import { rest } from 'msw';
import { friends, invitedUsers, puzzleFriends, puzzleId, user } from '.mocks/api/users/friends';
import { notices } from '.mocks/api/users/notices';

export const handlers = [
  rest.get('/api/users/friends', (req, res, ctx) => {
    return res(ctx.json(friends));
  }),
  rest.get(`/api/users/friends/${puzzleId}`, (req, res, ctx) => {
    return res(ctx.json(puzzleFriends));
  }),
  rest.get(`/api/users/notices`, (req, res, ctx) => {
    return res(ctx.json(notices));
  }),
  rest.get(`/api/puzzle/users/${puzzleId}?userId=${user.id}`, (req, res, ctx) => {
    return res(ctx.json(invitedUsers));
  }),
];

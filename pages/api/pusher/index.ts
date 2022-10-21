import { pusher } from 'libs/pusher';

export default async function handler(
  req: { body: { message: any; username: any } },
  res: { json: (arg0: { status: number }) => void }
) {
  const { message, username } = req.body;

  await pusher.trigger('presence-channel', 'chat-update', {
    message,
    username,
  });

  res.json({ status: 200 });
}

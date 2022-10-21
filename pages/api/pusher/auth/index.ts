import { pusher } from 'libs/pusher';
import { ChannelAuthResponse } from 'pusher';

export default async function handler(
  req: { body: { socket_id: any; channel_name: any; username: any } },
  res: { send: (arg0: ChannelAuthResponse) => void }
) {
  const { socket_id, channel_name, username } = req.body;
  const randomId = Math.random().toString(32).slice(2);
  console.log(socket_id, channel_name, username);
  const presenceData = {
    user_id: randomId,
    user_info: {
      username,
    },
  };

  // Now we need to authorize the user using try and catch block
  try {
    const auth = pusher.authorizeChannel(socket_id, channel_name, presenceData);
    res.send(auth);
  } catch (error) {
    console.error(error);
  }
}

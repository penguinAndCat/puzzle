import Pusher from 'pusher';

// create an instance of pusher.
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID ? process.env.PUSHER_APP_ID : '',
  key: process.env.PUSHER_APP_KEY ? process.env.PUSHER_APP_KEY : '',
  secret: process.env.PUSHER_APP_SECRET ? process.env.PUSHER_APP_SECRET : '',
  cluster: process.env.PUSHER_APP_CLUSTER ? process.env.PUSHER_APP_CLUSTER : '',
  useTLS: true,
});

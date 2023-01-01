import { useToast } from 'hooks/useToast';
import Pusher from 'pusher-js';
import { useNotice } from 'hooks/useNotice';
import { useEffect } from 'react';
import { NEXT_SERVER } from 'config';

const SocketNotice = ({ user }: { user: UserInfo | null }) => {
  const toast = useToast();
  const { notice, refetchNotice } = useNotice(user);

  useEffect(() => {
    if (user === undefined) return;
    let subscribe = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY ? process.env.NEXT_PUBLIC_KEY : '', {
      cluster: 'ap3',
      authEndpoint: `${NEXT_SERVER}/api/pusher/auth`,
      auth: {
        params: {
          id: user?.id,
        },
      },
    });
    if (subscribe) {
      // subscribe to the channel.
      const channel: any = pusher.subscribe(`presence-${user?.id}`);

      channel.bind('onNotice', (data: any) => {
        const { friend, puzzle, nickname } = data;
        if (friend) {
          refetchNotice();
          toast({ nickname: `${nickname}`, content: `님이 친구 요청 하였습니다.`, type: 'info' });
        }
        if (puzzle) {
          refetchNotice();
          toast({ nickname: `${nickname}`, content: `님이 퍼즐 방으로 초대 하였습니다.`, type: 'info' });
        }
      });
    }

    return () => {
      // last unsubscribe the user from the channel.
      pusher.unsubscribe(`presence-${user?.id}`);
      subscribe = false;
    };
  }, [user]);
  return null;
};

export default SocketNotice;

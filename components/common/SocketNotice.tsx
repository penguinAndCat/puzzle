import { useToast } from 'hooks/useToast';
import Pusher from 'pusher-js';
import { useNotice } from 'hooks/useNotice';
import { useEffect } from 'react';
import { NEXT_SERVER } from 'config';

const SocketNotice = ({ user }: { user: UserInfo | null }) => {
  const { fireToast } = useToast();
  const { data, refetch } = useNotice(user);
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
          refetch();
          fireToast({ nickname: `${nickname}`, content: `님이 친구 요청 하였습니다.`, top: 100 });
        }
        if (puzzle) {
          refetch();
          fireToast({ nickname: `${nickname}`, content: `님이 퍼즐 방에 초대 하였습니다.`, top: 100 });
        }
      });
    }

    return () => {
      // last unsubscribe the user from the channel.
      pusher.unsubscribe(`presence-notice`);
      subscribe = false;
    };
  }, [user]);
  return null;
};

export default SocketNotice;

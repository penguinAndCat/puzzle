import { useToast } from 'hooks/useToast';
import Pusher from 'pusher-js';
import { useNotice } from 'hooks/useReactQuery';
import { useEffect } from 'react';
import { NEXT_SERVER } from 'config';
import { useNotification } from 'hooks/useNotification';

const SocketNotice = ({ user }: { user: UserInfo | null }) => {
  const notification = useNotification();
  const { refetchNotice } = useNotice(user);

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
        const { friend, puzzle, nickname, picture, noticeId, puzzleId } = data;
        if (friend) {
          refetchNotice();
          notification({
            nickname: `${nickname}`,
            content: `저랑 친구하실래요?`,
            picture: `${picture}`,
            noticeId: noticeId,
            type: 'friend',
          });
        }
        if (puzzle) {
          refetchNotice();
          notification({
            nickname: `${nickname}`,
            content: `퍼즐 방에 들어오실래요?`,
            picture: `${picture}`,
            noticeId: noticeId,
            type: 'puzzle',
            puzzleId: puzzleId,
          });
        }
      });
    }

    return () => {
      // last unsubscribe the user from the channel.
      pusher.unsubscribe(`presence-${user?.id}`);
      subscribe = false;
    };
  }, [refetchNotice, notification, user]);
  return null;
};

export default SocketNotice;

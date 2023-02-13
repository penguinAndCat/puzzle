import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { NEXT_SERVER } from 'config';
import { useNotice } from 'hooks/apis/useReactQuery';
import { usePopup } from 'hooks/views/usePopup';

const SocketNotice = ({ user }: { user: UserInfo | null }) => {
  const popup = usePopup();
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
          popup({
            nickname: `${nickname}`,
            content: `저랑 친구하실래요?`,
            picture: `${picture}`,
            noticeId: noticeId,
            type: 'friend',
          });
        }
        if (puzzle) {
          refetchNotice();
          popup({
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
  }, [refetchNotice, popup, user]);
  return null;
};

export default SocketNotice;

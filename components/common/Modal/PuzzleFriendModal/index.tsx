import { useRouter } from 'next/router';

import * as User from 'components/common/User';
import { userStore } from 'libs/zustand/store';
import { usePuzzleFriend } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

const PuzzleFriendModal = () => {
  const router = useRouter();
  const toast = useToast();
  const { puzzleFriend } = usePuzzleFriend(router.query.id);
  const { user } = userStore();

  const inviteFriend = async (requestedNickname: string) => {
    if (!user?.id) return;
    const message = await apis.puzzles.requestInvitation(user.id, requestedNickname, router.query.id);
    if (message === 'success') {
      toast({ content: '초대 요청을 보냈습니다.', type: 'info' });
    }
    if (message === 'duplicated') {
      toast({ content: '이미 초대 요청을 보냈습니다.', type: 'warning' });
    }
  };

  return (
    <User.Ul>
      {puzzleFriend && puzzleFriend.length ? (
        puzzleFriend.map((item: { nickname: string; picture: string; isInvited: boolean; isHost: boolean }) => {
          return (
            <User.Li key={item.nickname}>
              <User.Img src={item.picture} />
              <User.Nickname>{item.nickname}</User.Nickname>
              {item.isHost ? (
                <User.Div>방장</User.Div>
              ) : item.isInvited ? (
                <User.Div>초대됨</User.Div>
              ) : (
                <User.Button onClick={() => inviteFriend(item.nickname)}>초대</User.Button>
              )}
            </User.Li>
          );
        })
      ) : (
        <User.NoData>친구가 없습니다.</User.NoData>
      )}
    </User.Ul>
  );
};

export default PuzzleFriendModal;

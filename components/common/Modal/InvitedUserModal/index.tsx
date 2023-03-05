import * as User from 'components/common/User';
import { useModal, userStore } from 'libs/zustand/store';
import { useInvitedUser } from 'hooks/apis/useReactQuery';
import { useToast } from 'hooks/views/useToast';
import apis from 'apis';

const InvitedUserModal = () => {
  const { user } = userStore();
  const { puzzleId } = useModal();
  const { invitedUser } = useInvitedUser(puzzleId, user);
  const toast = useToast();

  const requestFriend = async (requestedNickname: string) => {
    if (!user?.id) return;
    const message = await apis.friends.requestFriend(user.id, requestedNickname);
    if (message === 'success') {
      toast({ content: '친구 요청을 보냈습니다.', type: 'success' });
    }
    if (message === 'duplicated') {
      toast({ content: '이미 친구 요청을 보냈습니다.', type: 'warning' });
    }
  };

  if (invitedUser)
    return (
      <User.Ul>
        <User.Li>
          <User.Img src={invitedUser.host.picture} alt={invitedUser.host.nickname} />
          <User.Nickname>{invitedUser.host.nickname}</User.Nickname>
          <User.Div>방장</User.Div>
        </User.Li>
        {invitedUser.users.map(
          (participant: { picture: string; nickname: string; isFriend: number }, index: number) => {
            return (
              <User.Li key={index}>
                <User.Img src={participant.picture} alt={participant.nickname} />
                <User.Nickname>{participant.nickname}</User.Nickname>
                {user?.nickname === participant.nickname ? (
                  <User.Div>나</User.Div>
                ) : participant.isFriend > 0 ? (
                  <User.Div>친구</User.Div>
                ) : (
                  <User.Button onClick={() => requestFriend(participant.nickname)}>친구하기</User.Button>
                )}
              </User.Li>
            );
          }
        )}
      </User.Ul>
    );

  return null;
};

export default InvitedUserModal;

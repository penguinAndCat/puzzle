import * as User from 'components/common/User';
import { userStore } from 'libs/zustand/store';

const View = ({
  invitedUser,
  requestFriend,
}: {
  invitedUser: any;
  requestFriend: (requestedNickname: string) => void;
}) => {
  const { user } = userStore();

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

export default View;

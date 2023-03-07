import * as User from 'components/common/User';

const View = ({
  puzzleFriend,
  inviteFriend,
}: {
  puzzleFriend?: { nickname: string; picture: string; isInvited: boolean; isHost: boolean }[];
  inviteFriend: (arg0: string) => void;
}) => {
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

export default View;

import * as User from 'components/common/User';
import styled from 'styled-components';
import { theme } from 'libs/theme/theme';

const FriendModal = ({
  friends,
  deleteFriend,
  children,
}: {
  friends?: { nickname: string; picture: string }[];
  deleteFriend: (arg0: string) => void;
  children?: React.ReactNode;
}) => {
  return (
    <Wrapper>
      {children}
      <div>친구 목록</div>
      <User.Ul height={290}>
        {friends && friends.length ? (
          friends.map((item: { nickname: string; picture: string }, index: number) => {
            return (
              <User.Li key={index}>
                <User.Img src={item.picture} />
                <User.Nickname>{item.nickname}</User.Nickname>
                <User.Button onClick={() => deleteFriend(item.nickname)} data-testid="deleteFriend-button">
                  삭제
                </User.Button>
              </User.Li>
            );
          })
        ) : (
          <User.NoData>친구가 없습니다.</User.NoData>
        )}
      </User.Ul>
    </Wrapper>
  );
};

export default FriendModal;

const Wrapper = styled.div`
  ${theme.common.flexCenterColumn};
`;

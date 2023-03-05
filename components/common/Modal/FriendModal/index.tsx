import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import * as User from 'components/common/User';
import { theme } from 'libs/theme/theme';
import { userStore } from 'libs/zustand/store';
import apis from 'apis';

const FriendModal = ({ children }: { children?: React.ReactNode }) => {
  const [friends, setFriends] = useState([]);
  const { user } = userStore();

  useEffect(() => {
    (async function () {
      const friends = await apis.friends.getFriend();
      setFriends(friends);
    })();
  }, []);

  const deleteFriend = async (friendNickname: string) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await apis.friends.deleteFriend(user.id, friendNickname);
        setFriends((prev) => prev.filter((data: any) => data.nickname !== friendNickname));
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <Wrapper>
      {children}
      <div>친구 목록</div>
      <User.Ul height={290}>
        {friends && friends.length ? (
          friends.map((item: { nickname: string; picture: string }, index) => {
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

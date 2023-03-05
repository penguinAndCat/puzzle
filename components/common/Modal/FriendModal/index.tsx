import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
      <Ul>
        {friends && friends.length ? (
          friends.map((item: { nickname: string; picture: string }, index) => {
            return (
              <Li key={index}>
                <Img src={item.picture} />
                <Nickname>{item.nickname}</Nickname>
                <DeleteButton onClick={() => deleteFriend(item.nickname)} data-testid="deleteFriend-button">
                  삭제
                </DeleteButton>
              </Li>
            );
          })
        ) : (
          <NoData>친구가 없습니다.</NoData>
        )}
      </Ul>
    </Wrapper>
  );
};

export default FriendModal;

const Wrapper = styled.div`
  ${theme.common.flexCenterColumn};
`;

const Img = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

const Ul = styled.ul`
  height: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #cccccc;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.modalTextColor};
  }
`;

const Li = styled.li`
  width: 300px;
  min-height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nickname = styled.div`
  width: 140px;
  font-size: 12px;
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 20px;
  font-size: 12px;
  line-height: 50%;
  background-color: ${({ theme }) => theme.modalColor};
  color: ${({ theme }) => theme.modalTextColor};
  border: solid 1px ${({ theme }) => theme.modalTextColor};
  cursor: pointer;
`;

const NoData = styled.div`
  margin-top: 12px;
  font-size: 12px;
`;

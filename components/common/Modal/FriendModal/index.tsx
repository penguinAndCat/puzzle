import React, { useEffect, useState } from 'react';
import View from './View';
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
    <View friends={friends} deleteFriend={deleteFriend}>
      {children}
    </View>
  );
};

export default FriendModal;

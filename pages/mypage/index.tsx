import Header from 'components/common/Header';
import Profile from 'components/profile/Profile';
import RoomList from 'components/profile/RoomList';
import Seo from 'components/Seo';
import React, { useEffect } from 'react';
import styled from 'styled-components';

export default function MyPage({ user }: { user: UserInfo | null }) {
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <>
      <Seo title={`${user?.nickname} 프로필`} description="프로필 보기 및 변경 페이지" />
      <Header user={user} />
      <Wrapper>
        <Profile user={user} />
        <RoomList user={user} />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  padding: 10px;
  width: 100%;
`;

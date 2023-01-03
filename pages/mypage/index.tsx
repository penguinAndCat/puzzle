import Header from 'components/common/Header';
import RoomCard from 'components/common/RoomCard';
import Profile from 'components/profile/Profile';
import Seo from 'components/Seo';
import { NEXT_SERVER } from 'config';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import axios from 'libs/axios';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

export default function MyPage({ user }: { user: UserInfo | null }) {
  const [tab, setTab] = useState<'my' | 'invited'>('my');

  const [{ data: myPuzzle, refetch: refetchMyPuzzle }, myPuzzleRef] = useInfiniteScroll({
    queryKey: 'myPuzzle',
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get('/api/puzzle/myPuzzle', {
        params: {
          id: user?.id,
          page: pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.page + 1),
  });

  const puzzleData = useMemo(() => {
    return myPuzzle?.pages.reduce((acc, cur) => [...acc, ...cur.item], []);
  }, [myPuzzle?.pages]);

  const [{ data: invitedPuzzle }, invitedRef] = useInfiniteScroll({
    queryKey: 'invitedPuzzle',
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get('/api/puzzle/invited', {
        params: {
          id: user?.id,
          page: pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.page + 1),
  });

  const invitedPuzzleData = useMemo(() => {
    return invitedPuzzle?.pages.reduce((acc, cur) => [...acc, ...cur.item], []);
  }, [invitedPuzzle?.pages]);

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
        <TabBox>
          <li
            onClick={() => {
              if (tab === 'my') return;
              setTab('my');
            }}
          >
            나의 방
          </li>
          <li
            onClick={() => {
              if (tab === 'invited') return;
              setTab('invited');
            }}
          >
            초대된 방
          </li>
        </TabBox>
        <Title>{tab === 'my' ? '나의 방' : '초대된 방'}</Title>
        <PuzzleContainer>
          {tab == 'my' && (
            <>
              {puzzleData?.map((item: any, index: number) => (
                <RoomCard
                  key={index}
                  src={item.config.puzzleImage.src}
                  progress={Number((item.perfection * 100).toFixed(3))}
                  title={item.title}
                  userId={user?.id}
                  isPrivate={item.secretRoom}
                  puzzleId={item._id}
                  onClick={() => {
                    window.location.href = `${NEXT_SERVER}/puzzle/${item._id}`;
                  }}
                  onDelete={() => {
                    axios.delete(`/api/puzzle/${item._id}`).then(() => {
                      refetchMyPuzzle();
                    });
                  }}
                />
              ))}
              <div ref={myPuzzleRef} />
            </>
          )}
          {tab === 'invited' && (
            <>
              {invitedPuzzleData?.map((item: any, index: number) => (
                <RoomCard
                  key={index}
                  src={item.config.puzzleImage.src}
                  progress={Number((item.perfection * 100).toFixed(3))}
                  title={item.title}
                  userId={user?.id}
                  puzzleId={item._id}
                  isPrivate={item.secretRoom}
                  onClick={() => {
                    window.location.href = `${NEXT_SERVER}/puzzle/${item._id}`;
                  }}
                />
              ))}
              <div ref={invitedRef} />
            </>
          )}
        </PuzzleContainer>
      </Wrapper>
    </>
  );
}

const PuzzleContainer = styled.div`
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  @media (max-width: 1440px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 1.5;
  text-align: center;
  width: 100%;
`;

const TabBox = styled.ul`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  & > li {
    padding: 10px;
    background-color: white;
    color: black;
    cursor: pointer;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  border-bottom: 1px solid black;
`;

const Wrapper = styled.div`
  padding: 10px;
  width: 100%;
`;

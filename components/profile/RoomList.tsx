import RoomCard from 'components/common/Card/RoomCard';
import { NEXT_SERVER } from 'config';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import axios from 'libs/axios';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

export default function RoomList({ user }: { user: UserInfo | null }) {
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

  return (
    <Wrapper>
      <PuzzleContainer>
        <TabBox>
          <Li
            onClick={() => {
              if (tab === 'my') return;
              setTab('my');
            }}
            tab={'my'}
            current={tab}
          >
            나의 방
          </Li>
          <Li
            onClick={() => {
              if (tab === 'invited') return;
              setTab('invited');
            }}
            tab={'invited'}
            current={tab}
          >
            초대된 방
          </Li>
        </TabBox>
        <PuzzleWrapper>
          {tab == 'my' && (
            <>
              {puzzleData && puzzleData.length > 0 ? (
                puzzleData?.map((item: any, index: number) => (
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
                      if (window.confirm('정말로 삭제하시겠습니까?')) {
                        axios.delete(`/api/puzzle/${item._id}`).then(() => {
                          refetchMyPuzzle();
                        });
                      }
                    }}
                  />
                ))
              ) : (
                <div>hello</div>
              )}
              <div ref={myPuzzleRef} />
            </>
          )}
          {tab === 'invited' && (
            <>
              {invitedPuzzleData && invitedPuzzleData.length > 0 ? (
                invitedPuzzleData?.map((item: any, index: number) => (
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
                ))
              ) : (
                <div>hi</div>
              )}
              <div ref={invitedRef} />
            </>
          )}
        </PuzzleWrapper>
      </PuzzleContainer>
    </Wrapper>
  );
}

const PuzzleContainer = styled.div`
  width: 1024px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PuzzleWrapper = styled.div`
  display: grid;
  padding: 1rem 0;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  // @media (max-width: 1440px) {
  //   grid-template-columns: repeat(6, 1fr);
  // }
  // @media (max-width: 1024px) {
  //   grid-template-columns: repeat(4, 1fr);
  // }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TabBox = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  border-top: 1px solid #9d9d9d;
`;

const Li = styled.li<{ tab: string; current: string }>`
  width: 90px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
  color: ${({ tab, current, theme }) => (tab === current ? theme.textColor : '#9d9d9d')};
  border-top: 1px solid ${({ tab, current, theme }) => (tab === current ? theme.textColor : theme.bgColor)};
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

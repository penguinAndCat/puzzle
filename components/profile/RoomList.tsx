import RoomCard from 'components/common/Card/RoomCard';
import { NEXT_SERVER } from 'config';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import axios from 'libs/axios';
import { useModal, usePuzzle } from 'libs/zustand/store';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

export default function RoomList({ user }: { user: UserInfo | null }) {
  const [tab, setTab] = useState<'my' | 'invited'>('my');
  const { addModal } = useModal();
  const { initialModal } = usePuzzle();
  const openModal = () => {
    initialModal();
    addModal('puzzle');
  };

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
            ?????? ???
          </Li>
          <Li
            onClick={() => {
              if (tab === 'invited') return;
              setTab('invited');
            }}
            tab={'invited'}
            current={tab}
          >
            ????????? ???
          </Li>
        </TabBox>

        {tab == 'my' && (
          <>
            {puzzleData && puzzleData.length > 0 ? (
              <PuzzleWrapper>
                {puzzleData?.map((item: any, index: number) => (
                  <RoomCard
                    key={item._id}
                    src={item.config.puzzleImage.src}
                    progress={Number((item.perfection * 100).toFixed(3))}
                    title={item.title}
                    isPrivate={item.secretRoom}
                    puzzleId={item._id}
                    onClick={() => {
                      window.location.href = `${NEXT_SERVER}/puzzle/${item._id}`;
                    }}
                    onDelete={() => {
                      if (window.confirm('????????? ?????????????????????????')) {
                        axios.delete(`/api/puzzle/${item._id}`).then(() => {
                          refetchMyPuzzle();
                        });
                      }
                    }}
                    puzzleNumber={item.config.tilesPerColumn * item.config.tilesPerRow}
                  />
                ))}
              </PuzzleWrapper>
            ) : (
              <CreateWrapper>
                <CreateInfo>????????? ?????? ????????????.????</CreateInfo>
                <CreateInfo>?????? ????????? ????????? ?????? ?????????.</CreateInfo>
                <CreateButton onClick={openModal}>????????? ?????? ?????????</CreateButton>
              </CreateWrapper>
            )}
            <div ref={myPuzzleRef} />
          </>
        )}
        {tab === 'invited' && (
          <>
            {invitedPuzzleData && invitedPuzzleData.length > 0 ? (
              <PuzzleWrapper>
                {invitedPuzzleData?.map((item: any, index: number) => (
                  <RoomCard
                    key={item._id}
                    src={item.config.puzzleImage.src}
                    progress={Number((item.perfection * 100).toFixed(3))}
                    title={item.title}
                    puzzleId={item._id}
                    isPrivate={item.secretRoom}
                    onClick={() => {
                      window.location.href = `${NEXT_SERVER}/puzzle/${item._id}`;
                    }}
                    puzzleNumber={item.config.tilesPerColumn * item.config.tilesPerRow}
                  />
                ))}
              </PuzzleWrapper>
            ) : (
              <div style={{ marginTop: '36px' }}>????????? ?????? ????????????.????</div>
            )}
            <div ref={invitedRef} />
          </>
        )}
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

const CreateWrapper = styled.div`
  width: 100%;
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;

const CreateInfo = styled.div`
  margin-bottom: 12px;
`;

const CreateButton = styled.button`
  width: 240px;
  height: 40px;
  background-color: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
  border: 3px solid ${({ theme }) => theme.textColor};
  font-size: 19px;
  font-weight: 600;
  cursor: pointer;
`;

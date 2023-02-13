import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import apis from 'apis';
import RoomCard from 'components/common/Card/RoomCard';
import RoomCardSkeleton from 'components/common/Card/RoomCardSkeleton';
import { NEXT_SERVER } from 'config';
import useInfiniteScroll from 'hooks/apis/useInfiniteScroll';
import { useModal, usePuzzle } from 'libs/zustand/store';

export default function RoomList({ user }: { user: UserInfo | null }) {
  const [tab, setTab] = useState<'my' | 'invited'>('my');
  const { addModal } = useModal();
  const { initialModal } = usePuzzle();
  const openModal = () => {
    initialModal();
    addModal('puzzle');
  };
  const [mySortType, setMySortType] = useState<'desc' | 'asc'>('desc');
  const [mySortField, setMySortField] = useState<'createdAt' | 'perfection'>('createdAt');
  const [invitedSortType, setInvitedSortType] = useState<'desc' | 'asc'>('desc');
  const [invitedSortField, setInvitedSortField] = useState<'createdAt' | 'perfection'>('createdAt');

  const [{ data: myPuzzle, refetch: refetchMyPuzzle, isFetching: myPuzzleFetching }, myPuzzleRef] = useInfiniteScroll({
    queryKey: ['myPuzzle', mySortField, mySortType],
    queryFn: async ({ pageParam = 1 }) => {
      return await apis.puzzles.getPuzzleList(pageParam, mySortField, mySortType, true, user?.id, 'userId');
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.page + 1),
  });

  const puzzleData = useMemo(() => {
    return myPuzzle?.pages.reduce((acc, cur) => [...acc, ...cur.item], []);
  }, [myPuzzle?.pages]);

  const [{ data: invitedPuzzle, isFetching: invitedFetching }, invitedRef] = useInfiniteScroll({
    queryKey: ['invitedPuzzle', invitedSortField, invitedSortType],
    queryFn: async ({ pageParam = 1 }) => {
      return await apis.puzzles.getPuzzleList(
        pageParam,
        invitedSortField,
        invitedSortType,
        true,
        user?.id,
        'invitedUser'
      );
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.page + 1),
  });

  const invitedPuzzleData = useMemo(() => {
    return invitedPuzzle?.pages.reduce((acc, cur) => [...acc, ...cur.item], []);
  }, [invitedPuzzle?.pages]);

  const deletePuzzle = async (id: string) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      await apis.puzzles.deletePuzzle(id);
      refetchMyPuzzle();
    }
  };

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

        {tab == 'my' && (
          <>
            {/* <div>
              <button
                onClick={() => {
                  if (mySortField === 'createdAt') {
                    setMySortType((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                    return;
                  }
                  setMySortField('createdAt');
                  setMySortType('desc');
                }}
              >
                날짜
              </button>
              <button
                onClick={() => {
                  if (mySortField === 'perfection') {
                    setMySortType((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                    return;
                  }
                  setMySortField('perfection');
                  setMySortType('desc');
                }}
              >
                완성도
              </button>
            </div> */}
            {puzzleData && puzzleData.length > 0 ? (
              <PuzzleWrapper>
                {puzzleData?.map((item: any, index: number) => (
                  <RoomCard
                    key={item._id}
                    src={item.thumbImage ? item.thumbImage : item.src}
                    progress={Number((item.perfection * 100).toFixed(3))}
                    title={item.title}
                    isPrivate={item.secretRoom}
                    puzzleId={item._id}
                    onClick={() => {
                      window.location.href = `${NEXT_SERVER}/puzzle/${item._id}`;
                    }}
                    onDelete={() => deletePuzzle(item._id)}
                    puzzleNumber={item.puzzleNumber}
                  />
                ))}
                {myPuzzleFetching &&
                  Array.from({ length: 4 }, (v, i) => i).map((_, index) => <RoomCardSkeleton key={index * 100} />)}
              </PuzzleWrapper>
            ) : (
              <CreateWrapper>
                <CreateInfo>생성한 방이 없습니다.😥</CreateInfo>
                <CreateInfo>방을 만들어 퍼즐을 맞춰 보세요.</CreateInfo>
                <CreateButton onClick={openModal}>새로운 퍼즐 만들기</CreateButton>
              </CreateWrapper>
            )}
            <div ref={myPuzzleRef} />
          </>
        )}
        {tab === 'invited' && (
          <>
            {/* <div>
              <button
                onClick={() => {
                  if (invitedSortField === 'createdAt') {
                    setInvitedSortType((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                    return;
                  }
                  setInvitedSortField('createdAt');
                  setInvitedSortType('desc');
                }}
              >
                날짜
              </button>
              <button
                onClick={() => {
                  if (invitedSortField === 'perfection') {
                    setInvitedSortType((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                    return;
                  }
                  setInvitedSortField('createdAt');
                  setInvitedSortType('desc');
                }}
              >
                완성도
              </button>
            </div> */}
            {invitedPuzzleData && invitedPuzzleData.length > 0 ? (
              <PuzzleWrapper>
                {invitedPuzzleData?.map((item: any, index: number) => (
                  <RoomCard
                    key={item._id}
                    src={item.thumbImage ? item.thumbImage : item.src}
                    progress={Number((item.perfection * 100).toFixed(3))}
                    title={item.title}
                    puzzleId={item._id}
                    isPrivate={item.secretRoom}
                    onClick={() => {
                      window.location.href = `${NEXT_SERVER}/puzzle/${item._id}`;
                    }}
                    puzzleNumber={item.puzzleNumber}
                  />
                ))}
                {invitedFetching &&
                  Array.from({ length: 4 }, (v, i) => i).map((_, index) => <RoomCardSkeleton key={index * 100} />)}
              </PuzzleWrapper>
            ) : (
              <div style={{ marginTop: '36px' }}>초대된 방이 없습니다.😥</div>
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
  width: min(100%, 1024px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 1rem 0;
  gap: 0.5rem;
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

import { useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'antd';

import apis from 'apis';
import { NEXT_SERVER } from 'config';
import RoomCard from 'components/common/Card/RoomCard';
import { userStore } from 'libs/zustand/store';
import useInfiniteScroll from 'hooks/apis/useInfiniteScroll';
import { useToast } from 'hooks/views/useToast';
import SortDropBox from './SortDropBox';
import RoomCardSkeleton from 'components/common/Card/RoomCardSkeleton';

const OpenRoomList = () => {
  const user = userStore();
  const toast = useToast();
  const [sortType, setSortType] = useState<'desc' | 'asc'>('desc');
  const [sortField, setSortField] = useState<'createdAt' | 'perfection'>('createdAt');
  const [showPerfect, setShowPerfect] = useState(true);
  const [showDrop, setShowDrop] = useState(false);
  const [dropV, setDropV] = useState<string>('최신순');

  const [{ data, isFetching }, flagRef] = useInfiniteScroll({
    queryKey: ['public', sortField, sortType, showPerfect.toString()],
    queryFn: async ({ pageParam = 1 }) => {
      return await apis.puzzles.getPuzzleList(pageParam, sortField, sortType, showPerfect);
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.page + 1),
  });

  const onClick = (puzzleId: string) => {
    if (!user) {
      toast({ content: '로그인이 필요합니다', type: 'warning' });
      return;
    }
    window.location.href = `${NEXT_SERVER}/puzzle/${puzzleId}`;
  };

  return (
    <Container>
      <ButtonWrapper>
        <MainTitle>공개방</MainTitle>
        <SortDropBox
          dropV={dropV}
          setDropV={setDropV}
          showDrop={showDrop}
          setShowDrop={setShowDrop}
          setSortField={setSortField}
          setSortType={setSortType}
        />
        <Label>
          <LabelSpan>100%</LabelSpan>
          <Checkbox checked={showPerfect} onChange={() => setShowPerfect((prev) => !prev)} />
        </Label>
      </ButtonWrapper>
      <PuzzleContainer>
        {data?.pages.map((page) =>
          page.item.map((data: any) => {
            return (
              <RoomCard
                key={data._id}
                src={data.thumbImage ? data.thumbImage : data.src}
                progress={Number((data.perfection * 100).toFixed(3))}
                title={data.title}
                isMain={true}
                puzzleId={data._id}
                onClick={() => onClick(data._id)}
                puzzleNumber={data.puzzleNumber}
              />
            );
          })
        )}
        {isFetching && Array.from({ length: 4 }, (v, i) => i).map((_, index) => <RoomCardSkeleton key={index * 100} />)}
        <div ref={flagRef} style={{ height: '100px' }} />
      </PuzzleContainer>
    </Container>
  );
};

export default OpenRoomList;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 0.5rem;
`;

const PuzzleContainer = styled.div`
  width: min(100%, 1024px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: min(1024px, 100%);
  gap: 0.5rem;
  line-height: 1.5;
  padding: 0.5rem;
  position: relative;
  @media (max-width: 390px) {
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: flex-end;
  }
`;

const MainTitle = styled.div`
  position: absolute;
  font-weight: 600;
  text-align: center;
  inset: 0;
`;

const Label = styled.label`
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.1rem;
  font-size: 0.9rem;
  input {
    margin: 0;
  }
  @media (max-width: 390px) {
    width: 70px;
  }
  // .ant-checkbox-inner {
  //   width: 12px;
  //   height: 12px;
  // }
  // .ant-checkbox {
  //   transform: translateY(-0.1rem);
  // }
  // .ant-checkbox-checked .ant-checkbox-inner::after {
  //   transform: rotate(45deg) scale(0.75) translate(-90%, -70%);
  // }
`;

const LabelSpan = styled.span`
  margin-right: 4px;
  font-size: 0.8rem;
`;

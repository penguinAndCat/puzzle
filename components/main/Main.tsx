import Card from 'components/common/Card';
import RoomCard from 'components/common/RoomCard';
import axios from 'libs/axios';
import { useModal, usePuzzle } from 'libs/zustand/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { NEXT_SERVER } from 'config';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { useToast } from 'hooks/useToast';

const images = [
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/bugvpkwfmde3q21zcm4s.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189134/ylij9nqsupthcypczcjn.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189479/uzxtq97qotpu68qhjunh.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189365/qtpra1i8dps1nwjhc17a.png',
];

const Main = ({ user }: { user: UserInfo | null }) => {
  const { addModal } = useModal();
  const { initialModal } = usePuzzle();
  const openModal = () => {
    initialModal();
    addModal('puzzle');
  };
  const { fireToast } = useToast();

  const [{ data }, flagRef] = useInfiniteScroll({
    queryKey: 'public',
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get('/api/puzzle', {
        params: {
          page: pageParam,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.page + 1),
  });

  const puzzleData = useMemo(() => {
    return data?.pages.reduce((acc, cur) => [...acc, ...cur.item], []);
  }, [data?.pages]);

  return (
    <Wrapper>
      <CreateWrapper>
        <CreateButton onClick={openModal}>새로운 퍼즐 만들기</CreateButton>
      </CreateWrapper>
      <BasicWrapper>
        <Title>기본 퍼즐</Title>
        <PuzzleContainer>
          {images.map((img, index) => {
            return <Card key={index} image={img} />;
          })}
        </PuzzleContainer>
      </BasicWrapper>
      <FavoriteWrapper>
        <Title>인기 있는 퍼즐</Title>
        <PuzzleContainer>
          {images.map((img, index) => {
            return <Card key={index} image={img} />;
          })}
        </PuzzleContainer>
      </FavoriteWrapper>
      <FavoriteWrapper>
        <Title>공개방</Title>
        <PuzzleContainer>
          {puzzleData?.map((data: any, index: number) => {
            return (
              <RoomCard
                key={index}
                src={data.config.puzzleImage.src}
                currentPlayer={data.player.length}
                maxPlayer={data.maximumPlayer}
                progress={Number((data.perfection * 100).toFixed(3))}
                title={data.title}
                onClick={() => {
                  if (!user) {
                    fireToast({ content: '로그인이 필요합니다', top: 100 });
                    return;
                  }
                  window.location.href = `${NEXT_SERVER}/puzzle/${data._id}`;
                }}
              />
            );
          })}
          <div ref={flagRef} style={{ height: '100px' }} />
        </PuzzleContainer>
      </FavoriteWrapper>
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  width: 100%;
`;

const CreateWrapper = styled.div`
  width: 100%;
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  background-image: radial-gradient(${({ theme }) => theme.textColor} 2px, transparent 0),
    radial-gradient(${({ theme }) => theme.textColor} 2px, transparent 0);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
  @media (max-width: 600px) {
    height: 100px;
    padding: 30px 0;
  }
`;

const BasicWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const FavoriteWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 0.5rem;
`;

const Title = styled.div`
  width: 100%;
  font-weight: 600;
  text-align: center;
  margin: 20px 0;
`;

const PuzzleContainer = styled.div`
  width: 80%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
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

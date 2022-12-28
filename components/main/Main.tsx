import Card from 'components/common/Card';
import HoverImage from 'components/common/HoverImage';
import RoomCard from 'components/common/RoomCard';
import axios from 'libs/axios';
import { useModal, usePuzzle } from 'libs/zustand/store';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { NEXT_SERVER } from 'config';

const images = [
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/bugvpkwfmde3q21zcm4s.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189134/ylij9nqsupthcypczcjn.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189479/uzxtq97qotpu68qhjunh.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189365/qtpra1i8dps1nwjhc17a.png',
];

const Main = () => {
  const router = useRouter();
  const { addModal } = useModal();
  const { initialModal } = usePuzzle();
  const openModal = () => {
    initialModal();
    addModal('puzzle');
  };
  const publicRef = useRef<HTMLDivElement>(null);
  const [puzzleData, setPuzzleData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const getPublic = useCallback(async () => {
    const { data: publicPuzzle } = await axios.get('/api/puzzle', {
      params: {
        page: page,
      },
    });
    setPuzzleData((prev) => [...prev, ...publicPuzzle.item]);
    if (!publicPuzzle.item || publicPuzzle.item.length < 10) {
      publicRef.current!.style.display = 'none';
    }
    setPage((prev) => (prev += 1));
  }, [page]);

  const isIntersect: IntersectionObserverCallback = useCallback(
    async (entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        await getPublic();
        observer.observe(entries[0].target);
      }
    },
    [getPublic]
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    if (publicRef.current) {
      observer = new IntersectionObserver(isIntersect, {
        rootMargin: '10px',
      });
      observer.observe(publicRef.current);
    }
    return () => observer && observer.disconnect();
  }, [isIntersect, publicRef]);

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
          {puzzleData.map((data, index) => {
            return (
              <RoomCard
                key={index}
                src={data.config.puzzleImage.src}
                currentPlayer={data.player.length}
                maxPlayer={data.maximumPlayer}
                progress={Number((data.perfection * 100).toFixed(3))}
                title={data.title}
                onClick={() => {
                  window.location.href = `${NEXT_SERVER}/puzzle/${data._id}`;
                }}
              />
            );
          })}
          <div ref={publicRef} style={{ height: '10px' }} />
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

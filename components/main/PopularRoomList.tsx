import styled from 'styled-components';

import { NEXT_SERVER } from 'config';
import Card from 'components/common/Card';
import { userStore } from 'libs/zustand/store';
import { useToast } from 'hooks/views/useToast';
import { usePopularPuzzle } from 'hooks/apis/useReactQuery';

const PopularRoomList = () => {
  const user = userStore();
  const toast = useToast();
  const { popularPuzzle } = usePopularPuzzle();

  const onClick = (puzzleId: string) => {
    if (!user) {
      toast({ content: '로그인이 필요합니다', type: 'warning' });
      return;
    }
    window.location.href = `${NEXT_SERVER}/puzzle/${puzzleId}`;
  };

  return (
    <Container>
      <Title>인기 있는 퍼즐</Title>
      <PuzzleContainer>
        {popularPuzzle?.map((data: any) => {
          return (
            <Card
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
        })}
      </PuzzleContainer>
    </Container>
  );
};

export default PopularRoomList;

const Container = styled.div`
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
  max-width: 1024px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

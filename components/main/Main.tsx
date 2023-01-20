import styled from 'styled-components';

import Card from 'components/common/Card/Card';
import { useModal, usePuzzle } from 'libs/zustand/store';
import OpenRoomList from './OpenRoomList';
import PopularRoomList from './PopularRoomList';

const images = [
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/bugvpkwfmde3q21zcm4s.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189134/ylij9nqsupthcypczcjn.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189479/uzxtq97qotpu68qhjunh.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189365/qtpra1i8dps1nwjhc17a.png',
];

const Main = () => {
  const { addModal } = useModal();
  const { initialModal } = usePuzzle();
  const openModal = () => {
    initialModal();
    addModal('puzzle');
  };

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
      <PopularRoomList />
      <OpenRoomList />
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

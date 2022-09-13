import Card from 'components/common/Card';
import Modal from 'components/common/Modal';
import { useModal } from 'libs/zustand/store';
import styled from 'styled-components';

const images = ['/cp.png', '/cp2.png', '/cp3.png', '/cp4.png'];

const Main = () => {
  const { onModal, modalDisplay, initialModalImage } = useModal();
  const openModal = () => {
    initialModalImage();
    onModal();
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
      <FavoriteWrapper>
        <Title>인기 있는 퍼즐</Title>
        <PuzzleContainer>
          {images.map((img, index) => {
            return <Card key={index} image={img} />;
          })}
        </PuzzleContainer>
      </FavoriteWrapper>
      {modalDisplay && <Modal />}
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  width: 100%;
  heigth: 100%;
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
  heigth: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const FavoriteWrapper = styled.div`
  width: 100%;
  heigth: 100%;
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
  width: 80%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 16px;
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

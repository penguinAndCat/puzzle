import axios from 'axios';
import Palette from 'components/common/Palette';
import { exportConfig } from 'libs/puzzle/createPuzzle';
import { theme } from 'libs/theme/theme';
import { useModal } from 'libs/zustand/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import styled from 'styled-components';

interface Props {
  puzzleImg: img;
  showLevel: boolean;
  setShowLevel: Dispatch<SetStateAction<boolean>>;
  setShowLvMenu: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ puzzleImg, showLevel, setShowLevel, setShowLvMenu }: Props) => {
  const { data: session, status } = useSession();
  const { number, title } = useModal();
  const router = useRouter();
  const onClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    if (!showLevel) {
      setShowLvMenu(true);
    } else {
      setShowLevel(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!session) return;
      const { user }: any = session;
      const puzzleData = exportConfig();
      delete puzzleData.project;
      const data = {
        config: {
          ...puzzleData,
          groupTiles: puzzleData.groupTiles.map((item) => {
            return [item.tile.position.x, item.tile.position.y, item.groupIndex];
          }),
        },
        userId: user.id,
        level: number,
        title: title,
      };
      const response = await axios.post('/api/puzzle', {
        data: data,
      });
      const { item, message } = response.data;
      router.push(`/puzzle/${item._id}`);
    } catch (err) {
      alert('failed');
      console.log(err);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Button onClick={(e) => onClick(e)}>퍼즐수</Button>
          <Button>완성본</Button>
        </Left>
        <Logo>
          <div>PENGCAT</div>
          <div>PUZZLE</div>
        </Logo>
        <Right>
          <Palette />
          {status === 'authenticated' && router.query.id === undefined ? (
            <Button onClick={handleSave}>방 만들기</Button>
          ) : (
            <Button onClick={handleSave}>공유하기</Button>
          )}
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  width: 100%;
  height: 60px;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.headerColor};
  border-bottom: solid 3px ${({ theme }) => theme.headerTextColor};
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  min-width: 170px;
  display: flex;
  justify-content: space-between;
  margin-right: 80px;
  @media (max-width: 900px) {
    margin-right: 20px;
  }
  @media (max-width: 600px) {
    margin: 0;
  }
`;

const Right = styled.div`
  min-width: 130px;
  ${theme.common.flexCenter};
  margin-left: 80px;
  @media (max-width: 900px) {
    margin-left: 20px;
  }
  @media (max-width: 600px) {
    margin: 0;
  }
`;

const Button = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`;

const Logo = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin: 0 80px;
  font-weight: 600;
  color: ${({ theme }) => theme.headerTextColor};
  cursor: pointer;
  @media (max-width: 900px) {
    margin: 0 20px;
  }
  @media (max-width: 600px) {
    margin: 0;
  }
`;

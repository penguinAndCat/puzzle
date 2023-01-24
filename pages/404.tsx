import { useState } from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import Header from 'components/common/Header';
const PuzzleCanvas = dynamic(() => import('components/common/404/PuzzleCanvas'), {
  ssr: false,
});

const IMAGE = ['/cp2.png', 'cp3.png', 'cp4.png'];

const Home: NextPage<{ user: UserInfo | null }> = ({ user = null }) => {
  const [puzzleImg, setPuzzleImg] = useState({ src: '/cp2.png', width: 551, height: 551 });
  const onClick = (image: string) => {
    const img = new Image();
    img.src = image;
    img.onload = function () {
      setPuzzleImg({ src: image, width: img.width, height: img.height }); // 파일 base64 상태 업데이트
    };
  };
  return (
    <Container>
      <Header user={user} />
      <Wrapper>
        <Title>원하시는 페이지를 찾을 수 없습니다.</Title>
        <Text>찾으려는 페이지의 주소가 잘못 입력되었거나,</Text>
        <Text>주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.</Text>
        <Text>
          <Link onClick={() => (window.location.href = '/')}>홈으로 이동하거나</Link>이 퍼즐을 풀어보세요.👇
        </Text>
        <PuzzleCanvas puzzleLv={1} puzzleImg={puzzleImg} />
        <ButtonWrapper>
          {IMAGE.map((img) => {
            return (
              <Button key={img} onClick={() => onClick(img)}>
                <Img src={img} />
              </Button>
            );
          })}
        </ButtonWrapper>
      </Wrapper>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 103px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    height: calc(100vh - 93px);
  }
  padding: 0 0 120px 0;
`;

const Title = styled.h2`
  margin-top: 20px;
  font-size: 30px;
  margin-bottom: 22px;
`;

const Text = styled.div`
  margin-bottom: 6px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 240px;
  justify-content: space-between;
  margin-top: 12px;
`;

const Button = styled.button`
  width: 70px;
  height: 70px;
  background-color: #ffffff;
  padding: 0;
  outline: none;
  border: none;
  cursor: pointer;
`;

const Img = styled.img`
  width: 70px;
  height: 70px;
  object: fit;
`;

const Link = styled.span`
  color: red;
  margin-right: 6px;
  cursor: pointer;
`;

import axios from 'axios';
import { saveThumbImage } from 'libs/common/saveImage';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

/**
 * 기존 서버에 있는 퍼즐 방 중에 썸네일이 없는 방이 존재.
 * 해당 방의 썸네일 이미지 추가 생성하는 버튼.
 * 모든 방을 가져온 후 썸네일 없는 방에 한해서 썸네일 추가.
 */
const CreateThumbImageButton = () => {
  const [puzzleData, setPuzzleData] = useState([]);
  const getPuzzleData = async () => {
    const res = await axios.get('/api/puzzle/thumb');
    setPuzzleData(res.data.puzzle);
  };

  useEffect(() => {
    getPuzzleData();
  }, []);

  const onClick = () => {
    puzzleData.map(async (item: any) => {
      const thumbImage = await saveThumbImage(item.config.puzzleImage.src);
      axios.put('/api/puzzle/thumb', {
        thumbImage: thumbImage,
        puzzleId: item._id,
      });
    });
  };
  return (
    <Wrapper>
      <CreateButton onClick={onClick}>썸네일 생성</CreateButton>
    </Wrapper>
  );
};

export default CreateThumbImageButton;

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
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

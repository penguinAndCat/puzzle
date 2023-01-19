import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'antd';

import Card from 'components/common/Card/Card';
import RoomCard from 'components/common/Card/RoomCard';
import { DropdownIcon } from 'components/common/Icon';
import { NEXT_SERVER } from 'config';
import axios from 'libs/axios';
import { useModal, usePuzzle } from 'libs/zustand/store';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { useToast } from 'hooks/useToast';

const images = [
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189078/bugvpkwfmde3q21zcm4s.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189134/ylij9nqsupthcypczcjn.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189479/uzxtq97qotpu68qhjunh.png',
  'http://res.cloudinary.com/penguinandcatpuzzle/image/upload/v1666189365/qtpra1i8dps1nwjhc17a.png',
];

const Main = ({ user, popularPuzzle }: { user: UserInfo | null; popularPuzzle: any }) => {
  const { addModal } = useModal();
  const { initialModal } = usePuzzle();
  const openModal = () => {
    initialModal();
    addModal('puzzle');
  };
  const toast = useToast();
  const [sortType, setSortType] = useState<'desc' | 'asc'>('desc');
  const [sortField, setSortField] = useState<'createdAt' | 'perfection'>('perfection');
  const [showPerfect, setShowPerfect] = useState(true);
  const [showDrop, setShowDrop] = useState(false);
  const [dropV, setDropV] = useState('최신순');
  const [{ data }, flagRef] = useInfiniteScroll({
    queryKey: ['public', sortField, sortType, showPerfect.toString()],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get('/api/puzzle', {
        params: {
          page: pageParam,
          sortField: sortField,
          sortType: sortType,
          searchKeyword: `false`,
          searchField: 'secretRoom',
          showPerfect: showPerfect,
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
          {popularPuzzle?.map((data: any, index: number) => {
            return (
              <RoomCard
                key={data._id}
                src={data.config.puzzleImage.src}
                progress={Number((data.perfection * 100).toFixed(3))}
                title={data.title}
                isMain={true}
                puzzleId={data._id}
                onClick={() => {
                  if (!user) {
                    toast({ content: '로그인이 필요합니다', type: 'warning' });
                    return;
                  }
                  window.location.href = `${NEXT_SERVER}/puzzle/${data._id}`;
                }}
                puzzleNumber={data.config.tilesPerColumn * data.config.tilesPerRow}
              />
            );
          })}
        </PuzzleContainer>
      </FavoriteWrapper>
      <FavoriteWrapper>
        <ButtonWrapper>
          <MainTitle>공개방</MainTitle>
          <DropBox onClick={(e) => setShowDrop((prev) => !prev)}>
            <DropText>
              <div>{dropV}</div>
              <IconWrapper showDrop={showDrop}>
                <DropdownIcon />
              </IconWrapper>
            </DropText>
            {showDrop && (
              <DropUl>
                <li>
                  <button
                    onClick={(e) => {
                      setSortField('createdAt');
                      setSortType('desc');
                      setDropV(e.currentTarget.textContent || '최신');
                    }}
                  >
                    최신순
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      setSortField('createdAt');
                      setSortType('asc');
                      setDropV(e.currentTarget.textContent || '오래된');
                    }}
                  >
                    오래된순
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      setSortField('perfection');
                      setSortType('desc');
                      setDropV(e.currentTarget.textContent || '완성');
                    }}
                  >
                    완성순
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      setSortField('perfection');
                      setSortType('asc');
                      setDropV(e.currentTarget.textContent || '미완성');
                    }}
                  >
                    미완성순
                  </button>
                </li>
              </DropUl>
            )}
          </DropBox>
          <Label>
            <LabelSpan>100%</LabelSpan>
            <Checkbox checked={showPerfect} onChange={() => setShowPerfect((prev) => !prev)} />
          </Label>
        </ButtonWrapper>
        <PuzzleContainer>
          {puzzleData?.map((data: any, index: number) => {
            return (
              <RoomCard
                key={data._id}
                src={data.config.puzzleImage?.src}
                progress={Number((data.perfection * 100).toFixed(3))}
                title={data.title}
                isMain={true}
                puzzleId={data._id}
                onClick={() => {
                  if (!user) {
                    toast({ content: '로그인이 필요합니다', type: 'warning' });
                    return;
                  }
                  window.location.href = `${NEXT_SERVER}/puzzle/${data._id}`;
                }}
                puzzleNumber={data.config.tilesPerColumn * data.config.tilesPerRow}
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

const DropBox = styled.div`
  color: black;
  position: relative;
  z-index: 10;
  cursor: pointer;
  width: 70px;
  font-size: 0.8rem;
  @media (max-width: 390px) {
    transform: translateY(-6px);
  }
`;

const DropText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: white;
  align-items: center;
  padding: 0px;
  background-color: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.textColor};
`;

const IconWrapper = styled.div<{ showDrop: boolean }>`
  display: flex;
  align-items: center;
  margin-left: 4px;
  transition: transform 0.5s;
  transform: ${({ showDrop }) => (showDrop ? 'rotate(-180deg)' : 'rotate(0)')};
`;

const DropUl = styled.ul`
  box-sizing: content-box;
  width: 100%;
  height: 96px;
  cursor: pointer;
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.textColor};

  li {
    display: flex;
    padding: 0px;
    height: 24px;
  }
  li > button {
    width: 100%;
    height: 24px;
    text-align: left;
    font-size: 0.8rem;
    border: none;
    background-color: ${({ theme }) => theme.bgColor};
    color: ${({ theme }) => theme.textColor};
    padding: 0 0 0 4px;
    cursor: pointer;
  }
`;

const Label = styled.label`
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.1rem;
  input {
    margin: 0;
  }
  @media (max-width: 390px) {
    width: 70px;
  }
  .ant-checkbox-inner {
    width: 12px;
    height: 12px;
  }
  .ant-checkbox {
    transform: translateY(-0.1rem);
  }
  .ant-checkbox-checked .ant-checkbox-inner::after {
    transform: rotate(45deg) scale(0.75) translate(-90%, -70%);
  }
`;

const LabelSpan = styled.span`
  margin-right: 4px;
  font-size: 0.8rem;
`;

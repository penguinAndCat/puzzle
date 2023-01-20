import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { DropdownIcon } from 'components/common/Icon';

type SortDropBoxProps = {
  dropV: string;
  setDropV: Dispatch<SetStateAction<string>>;
  showDrop: boolean;
  setShowDrop: Dispatch<SetStateAction<boolean>>;
  setSortField: Dispatch<SetStateAction<'createdAt' | 'perfection'>>;
  setSortType: Dispatch<SetStateAction<'desc' | 'asc'>>;
};

const SortDropBox = ({ dropV, setDropV, showDrop, setShowDrop, setSortField, setSortType }: SortDropBoxProps) => {
  return (
    <DropBox onClick={() => setShowDrop((prev) => !prev)}>
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
                setDropV(e.currentTarget.textContent || '최신순');
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
                setDropV(e.currentTarget.textContent || '오래된순');
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
                setDropV(e.currentTarget.textContent || '완성순');
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
                setDropV(e.currentTarget.textContent || '미완성순');
              }}
            >
              미완성순
            </button>
          </li>
        </DropUl>
      )}
    </DropBox>
  );
};

export default SortDropBox;

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

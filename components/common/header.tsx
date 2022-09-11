import { signIn, signOut, useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  puzzleImg: img;
  setPuzzleImg: Dispatch<SetStateAction<img>>;
  showLevel: boolean;
  setShowLevel: Dispatch<SetStateAction<boolean>>;
  setShowLvMenu: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ setPuzzleImg, puzzleImg, showLevel, setShowLevel, setShowLvMenu }: Props) => {
  const { status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeFile = (event: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        const img = new Image();
        img.src = base64.toString();
        img.onload = function () {
          setPuzzleImg({ src: base64.toString(), width: img.width, height: img.height }); // 파일 base64 상태 업데이트
        };
      }
    };
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
    }
  };

  return (
    <>
      <Wrapper>
        <ButtonBox className="button">
          {status === 'authenticated' ? (
            <button onClick={() => signOut()}>logout</button>
          ) : (
            <button onClick={() => signIn()}>login</button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!showLevel) {
                setShowLvMenu(true);
              } else {
                setShowLevel(false);
              }
            }}
          >
            난이도 변경메뉴
          </button>
          <button
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            이미지 변경
          </button>
          <button>
            <img
              src={puzzleImg.src}
              alt="preview"
              onClick={(e) => {
                const imgW = window.open(
                  '',
                  '',
                  `width=800,height=600,left=${
                    (window.screenX || window.screenLeft || 0) + (window.innerWidth - 800) / 2
                  },top=${(window.screenY || window.screenTop || 0) + (window.innerHeight - 600) / 2}`
                );
                const imgT = document.createElement('img');
                imgT.setAttribute('src', e.currentTarget.src);
                imgT.style.width = '100%';
                imgT.style.height = '100%';
                imgT.style.objectFit = 'contain';
                if (imgW) {
                  imgW.document.body.appendChild(imgT);
                }
              }}
            />
          </button>
        </ButtonBox>
        <Input ref={inputRef} type="file" accept="image/*" onChange={handleChangeFile} />
      </Wrapper>
    </>
  );
};

export default Header;

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  padding: 5px;
  display: flex;
  justify-content: center;
  background-color: green;
`;

const ButtonBox = styled.div`
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    font-size: 0;
    padding: 0;
    width: 60px;
    background-color: white;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`;

const Levels = styled.div<{ show: boolean }>`
  position: absolute;
  width: 300px;
  height: 100%;
  top: 0;
  left: 0;
  color: black;
  background-color: white;
  box-shadow: 0 0 20px 1px gray;
  transform: translateX(-100%);
  transform: translateX(${({ show }) => (show ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  h1 {
    text-align: center;
  }
`;

const List = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

const Item = styled.li<{ selected: boolean }>`
  box-sizing: border-box;
  font-size: 1.5rem;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 5px solid ${({ selected }) => (selected ? 'black' : 'rgba(0, 0, 0, 0.1)')};
  background-color: ${({ selected }) => (selected ? 'rgba(0, 0, 0, 0.1)' : 'white')};
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Input = styled.input`
  display: none;
`;

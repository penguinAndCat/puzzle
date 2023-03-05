import { ChangeEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import { Cropper, getCroppedImg } from 'react-cropper-custom';
import 'react-cropper-custom/dist/index.css';

import { useModal } from 'libs/zustand/store';

const CropImageModal = () => {
  const { removeModal, profileImg, setProfileImg, croppedImg, setCroppedImg } = useModal();
  const [zoom, setZoom] = useState(1);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onCropComplete = async (croppedArea: Area) => {
    try {
      const canvasSize = {
        width: 1200,
        height: 1200,
      };
      const image = await getCroppedImg(profileImg, croppedArea, canvasSize);
      setCroppedImg(image);
    } catch (e) {
      console.error(e);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    setProfileImg(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <Wrapper>
      {profileImg.slice(undefined, 21) !== 'http://k.kakaocdn.net' ? (
        <Cropper src={profileImg} zoom={zoom} aspect={1} onZoomChange={setZoom} onCropComplete={onCropComplete} />
      ) : (
        <InputWrapper
          onClick={() => {
            if (!inputFileRef.current) return;
            inputFileRef.current.click();
          }}
        >
          <div>이미지를 추가해보세요.</div>
        </InputWrapper>
      )}
      <Explanation>휠과 드래그를 사용하여 영역을 지정할 수 있습니다.</Explanation>
      <ButtonWrapper>
        <Button
          onClick={() => {
            if (!inputFileRef.current) return;
            inputFileRef.current.click();
          }}
        >
          이미지 변경
        </Button>
        <Button
          onClick={() => {
            setProfileImg(croppedImg);
            removeModal('cropImage');
          }}
        >
          자르기 완료
        </Button>
      </ButtonWrapper>
      <Input
        type="file"
        multiple={false}
        ref={inputFileRef}
        accept="image/png, image/jpeg"
        onChange={(e) => onChange(e)}
      />
    </Wrapper>
  );
};

export default CropImageModal;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 8px;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #aaa; /* 또는 트랙에 추가한다 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.modalTextColor};
  }
`;

const Input = styled.input`
  display: none;
`;

const Explanation = styled.div`
  margin-top: 12px;
  font-size: 12px;
`;

const ButtonWrapper = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
`;

const Button = styled.button`
  width: 90px;
  height: 30px;
  border-radius: 4px;
  border: 3px ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.headerTextColor};
  background-color: ${({ theme }) => theme.headerColor};
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  padding: 0;
`;

const InputWrapper = styled.div`
  width: 284px;
  height: 284px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px ${({ theme }) => theme.borderColor};
  cursor: pointer;
`;

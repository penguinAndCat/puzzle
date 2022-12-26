import useImaegHover from 'hooks/useImageHover';
import { useModal, usePuzzle } from 'libs/zustand/store';
import styled from 'styled-components';

interface Props {
  image: string;
}

const Card = ({ image }: Props) => {
  const { addModal } = useModal();
  const { initialModal } = usePuzzle();
  const { setModalImage } = usePuzzle();
  const { onMouseLeave, onMouseMove, onMouseOver, width, thumbImage, mousePosition } = useImaegHover(image);
  const onClick = () => {
    initialModal();
    addModal('puzzle');
    const img = new Image();
    img.src = image;
    img.onload = function () {
      setModalImage({ src: image, width: img.width, height: img.height }); // 파일 base64 상태 업데이트
    };
  };
  return (
    <Wrapper
      onMouseOver={(e) => onMouseOver(e)}
      onMouseLeave={onMouseLeave}
      onMouseMove={(e) => onMouseMove(e)}
      onClick={onClick}
    >
      <CardImg src={image} />
      {thumbImage !== '' && (
        <ThumbImage style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>
          <Img src={thumbImage} alt="" width={width} />
        </ThumbImage>
      )}
    </Wrapper>
  );
};

export default Card;

const Wrapper = styled.div`
  cursor: pointer;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
`;

const ThumbImage = styled.div`
  position: fixed;
  z-index: 100;
  pointer-events: none;
`;

const Img = styled.img`
  width: ${({ width }) => width}px;
`;

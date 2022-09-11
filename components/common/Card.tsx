import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import styled from 'styled-components';

interface Props {
  image: string;
}

const Card = ({ image }: Props) => {
  const [thumbImage, setThumbImage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(0);
  const onMouseOver = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    setThumbImage(image);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setWidth(window.innerWidth / 8);
  };
  const onMouseMove = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    setThumbImage(image);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setWidth(window.innerWidth / 8);
  };
  const onMouseLeave = () => {
    setThumbImage('');
  };
  return (
    <Wrapper onMouseOver={(e) => onMouseOver(e)} onMouseLeave={onMouseLeave} onMouseMove={(e) => onMouseMove(e)}>
      <CardImg src={image} />
      {thumbImage !== '' && (
        <ThumbImage mousePosition={mousePosition}>
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
  // box-shadow: 0 3px 3px 0 rgba(#000, 0.05), 0 5px 15px 0 rgba(#000, 0.05);
  box-shadow: inset 1px 1px 1px 0 rgba(#000, 0.05);
  border-radius: 2px;
`;

type ThumbImageProps = {
  mousePosition: {
    x: number;
    y: number;
  };
};

const ThumbImage = styled.div<ThumbImageProps>`
  position: fixed;
  top: ${({ mousePosition }) => mousePosition.y}px;
  left: ${({ mousePosition }) => mousePosition.x}px;
  z-index: 100;
  pointer-events: none;
`;

const Img = styled.img`
  width: ${({ width }) => width}px;
`;

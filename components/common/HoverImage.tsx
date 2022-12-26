import useImaegHover from 'hooks/useImageHover';
import React from 'react';
import styled from 'styled-components';

export default function HoverImage({ src, ...rest }: { src: string; [key: string]: any }) {
  const { onMouseLeave, onMouseMove, onMouseOver, width, mousePosition, thumbImage } = useImaegHover(src);
  return (
    <>
      <ThumbComp thumbImage={thumbImage} width={width} mousePosition={mousePosition} />
      <img src={src} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} onMouseOver={onMouseOver} {...rest} />
    </>
  );
}

const ThumbComp = ({
  thumbImage,
  width,
  mousePosition,
}: {
  thumbImage: string;
  width: number;
  mousePosition: {
    x: number;
    y: number;
  };
}) => {
  return (
    <ThumbImageWrap style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>
      <Img src={thumbImage} alt="" width={width} />
    </ThumbImageWrap>
  );
};

const ThumbImageWrap = styled.div`
  position: fixed;
  z-index: 100;
  pointer-events: none;
`;

const Img = styled.img`
  width: ${({ width }) => width}px;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
`;

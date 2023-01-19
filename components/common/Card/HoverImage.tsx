import useImaegHover from 'hooks/useImageHover';
import React from 'react';
import styled from 'styled-components';

export default function HoverImage({ src, ...rest }: { src: string; [key: string]: any }) {
  const { onMouseLeave, onMouseMove, onMouseOver, width, mousePosition, thumbImage } = useImaegHover(src);
  return (
    <>
      <ThumbComp thumbImage={thumbImage} width={width} mousePosition={mousePosition} />
      <Img
        alt={src}
        src={src}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseOver={onMouseOver}
        {...rest}
      />
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
    <ThumbImgWrapper style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>
      <ThumbImg src={thumbImage} alt="" width={width} />
    </ThumbImgWrapper>
  );
};

const ThumbImgWrapper = styled.div`
  position: fixed;
  z-index: 100;
  pointer-events: none;
`;

const ThumbImg = styled.img`
  width: ${({ width }) => width}px;
`;

const Img = styled.img``;

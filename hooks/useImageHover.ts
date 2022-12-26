import { useState, MouseEvent } from 'react';

const useImaegHover = (src: string) => {
  const [thumbImage, setThumbImage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(0);
  const onMouseOver = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    setThumbImage(src);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setWidth(window.innerWidth / 8);
  };
  const onMouseMove = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    setThumbImage(src);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setWidth(window.innerWidth / 8);
  };
  const onMouseLeave = () => {
    setThumbImage('');
  };

  return { thumbImage, mousePosition, width, onMouseLeave, onMouseMove, onMouseOver };
};

export default useImaegHover;

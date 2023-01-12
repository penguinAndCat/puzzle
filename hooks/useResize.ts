//useResize.jsx
import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

const HEADER_MARGIN = 61;

export function useCanvasSize() {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasSizeResult = useDebounce<size>(canvasSize, 600);

  useEffect(() => {
    const resizeListener = () => {
      if (window.innerWidth < window.innerHeight - HEADER_MARGIN) {
        setCanvasSize({ width: window.innerWidth, height: window.innerWidth });
      } else {
        setCanvasSize({ width: window.innerHeight - HEADER_MARGIN, height: window.innerHeight - HEADER_MARGIN });
      }
    };
    window.addEventListener('resize', resizeListener);

    resizeListener();
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  return canvasSizeResult;
}

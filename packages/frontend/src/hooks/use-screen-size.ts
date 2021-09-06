import { useEffect, useState } from 'react';

export function useScreenSize() {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    resize();

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);

    function resize() {
      setWidth(window.visualViewport.width);
      setHeight(window.visualViewport.height);
    }
  }, [setWidth, setHeight]);

  return {
    width,
    height,
  };
}

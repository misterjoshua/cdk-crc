import { MutableRefObject, useEffect, useState } from 'react';

/** Get the width & height of the element */
export function useElementSize(ref: MutableRefObject<HTMLElement>) {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const [firstEntry] = entries;
      if (!firstEntry) return;

      const contentRect = firstEntry.contentRect;
      setWidth(contentRect.width);
      setHeight(contentRect.height);
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => resizeObserver.disconnect();
  }, [ref, setWidth, setHeight]);

  return {
    width,
    height,
  };
}

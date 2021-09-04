import React, { useEffect, useState } from 'react';

export function useHitCount(): number {
  const [hitCount, setHitCount] = useState<number | undefined>();

  useEffect(() => {
    async function func() {
      const host = /localhost/.test(window.location.host)
        ? 'https://cdk-crc-test.kellendonk.ca/api/hits'
        : '/api/hits';

      const res = await fetch(host);
      const resJson = await res.json();
      const hitCount = resJson.hitCount;
      setHitCount(hitCount);
    }

    func();
  }, [setHitCount]);

  return hitCount;
}

export const HitCounter: React.FC = () => {
  const hits = useHitCount();

  if (hits !== undefined) {
    return <>This site has {hits} hits</>;
  } else {
    return <></>;
  }
};

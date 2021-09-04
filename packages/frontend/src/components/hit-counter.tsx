import React, { useEffect, useState } from 'react';

function useHitCounter() {
  const [hitCounter, setHitCounter] = useState<number | undefined>();

  useEffect(() => {
    async function func() {
      const host = /localhost/.test(window.location.host)
        ? 'https://cdk-crc-test.kellendonk.ca/api/hits'
        : '/api/hits';

      const res = await fetch(host);
      const resJson = await res.json();
      const hitCount = resJson.hitCount;
      setHitCounter(hitCount);
    }

    func();
  }, [setHitCounter]);

  return hitCounter;
}

export const HitCounter: React.FC = () => {
  const hits = useHitCounter();

  if (hits !== undefined) {
    return <>This site has {hits} hits</>;
  } else {
    return <></>;
  }
};

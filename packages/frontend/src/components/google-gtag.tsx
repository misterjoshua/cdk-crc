import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export const GoogleGtag: React.FC = () => (
  <>
    {/* @see https://flaviocopes.com/nextjs-google-analytics/ */}
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', ${JSON.stringify(GOOGLE_ANALYTICS_ID)}, {
          page_path: window.location.pathname,
        });
      `,
      }}
    />
  </>
);

export const GoogleGtagPageChangeHandler: React.FC = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);

    function handleRouteChange(url: string) {
      console.log(`Page changed to ${url}`);
      (window as any).gtag('config', GOOGLE_ANALYTICS_ID, {
        page_path: url,
      });
    }
  }, [router, router.events]);

  return <>{props.children}</>;
};

export const GOOGLE_ANALYTICS_ID = 'G-JMCDB5JZXK';

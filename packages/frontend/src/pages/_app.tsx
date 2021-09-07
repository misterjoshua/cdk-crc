import { GoogleGtagPageChangeHandler } from '../components/google-gtag';

export default function MyApp({ Component, pageProps }) {
  return (
    <GoogleGtagPageChangeHandler>
      <Component {...pageProps} />
    </GoogleGtagPageChangeHandler>
  );
}

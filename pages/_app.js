// pages/_app.js
import '../public/css/global.css';
import '../public/css/components.css';
import '../public/css/header.css';
import '../public/css/footer.css';
import '../public/css/index.css';
import '../public/css/responsive.css';

import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

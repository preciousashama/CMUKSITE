import '../public/css/components.css';
import '../public/css/global.css';
import '../public/css/index.css';
import '../public/css/header.css';
import '../public/css/responsive.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../lib/CartContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

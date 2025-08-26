import '../styles/components.css';
import '../styles/global.css';
import '../styles/index.css';
import '../styles/header.css';
import '../styles/responsive.css';


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

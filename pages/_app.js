// pages/_app.js
import '../public/css/components.css';
import '../styles/globals.css'
import Header from '../components/header'
import Footer from '../components/footer'
import '../public/css/index.css';
import '../public/css/responsive.css';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../lib/CartContext.js';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
import '../styles/components.css';
import '../styles/global.css';
import '../styles/index.css';
import '../styles/header.css';
import '../styles/footer.css';
import '../styles/responsive.css';
import '../styles/login.css';
import '../styles/register.css';
import '../styles/account.css';
import '../styles/products.css';
import '../styles/productdetail.css';
import '../styles/cart.css';
import '../styles/checkout.css';


import Header from '../components/Header';
import Footer from '../components/Footer';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../lib/CartContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <CartProvider>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </CartProvider>
    </SessionProvider>
  );
}

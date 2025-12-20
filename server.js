require('dotenv').config({ path: '.env.local' });
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // New: Security headers

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// --- MOCK DATABASE ---
const products = [
  { id: 'p1', name: 'Apparel Item', price: 2000 }, // price in cents (£20.00)
  { id: 'p2', name: 'Vinyl Decal', price: 1000 },
];

// --- MIDDLEWARE ---
app.use(helmet({ contentSecurityPolicy: false })); // Basic security
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API ROUTES ---

// Health Check
app.get('/api/test', (req, res) => res.json({ status: 'OK' }));

// Products API
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Secure Stripe Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body; // Expecting [{id: 'p1', quantity: 1}]

    // 1. Calculate total on the SERVER, not the client
    const amount = items.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);

    if (amount <= 0) return res.status(400).json({ error: 'Invalid total' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency: 'gbp',
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- DYNAMIC PAGE ROUTING ---

// Serve specific components
app.get(['/header', '/footer'], (req, res) => {
  const component = req.path.split('/')[1];
  res.sendFile(path.join(__dirname, 'components', `${component}.html`));
});

// Handle all defined HTML routes dynamically
const pages = [
  'all-reviews', 'apparel', 'bags', 'cart', 'checkout', 'decals-vinyls',
  'express-services', 'flyers-cards', 'gallery', 'holidays', 'labels-stickers',
  'login', 'order-confirmation', 'party-occasions', 'product-detail',
  'products', 'register', 'search-results', 'specials-other', 'wishlist', 'account'
];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running at: http://localhost:${PORT}
  💳 Stripe Environment: ${process.env.STRIPE_SECRET_KEY ? 'Connected' : 'Missing Key'}
  `);
});
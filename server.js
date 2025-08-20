// Load environment variables from .env
require('dotenv').config({ path: '.env.local' });


// Dependencies
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');

// Initialize express and Stripe
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Fake product list
const products = [
  {
    id: 1,
    name: "Basic Black T-Shirt",
    price: 1999,
    image: "/assets/tshirt-black.jpg"
  },
  {
    id: 2,
    name: "Logo Tote Bag",
    price: 1499,
    image: "/assets/tote-bag.jpg"
  },
  {
    id: 3,
    name: "Sticker Pack",
    price: 499,
    image: "/assets/sticker-pack.jpg"
  }
];

// Products API
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Stripe Payment Intent Route
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: 'gbp',
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment Intent creation failed' });
  }
});

// Serve HTML Pages
const htmlRoutes = [
  'all-reviews',
  'apparel',
  'bags',
  'cart',
  'checkout',
  'decals-vinyls',
  'express-services',
  'flyers-cards',
  'gallery',
  'holidays',
  'labels-stickers',
  'login',
  'order-confirmation',
  'party-occasions',
  'product-detail',
  'products',
  'register',
  'search-results',
  'specials-other',
  'wishlist',
  'account'
];

htmlRoutes.forEach(route => {
  app.get(`/${route}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${route}.html`));
  });
});

// Header & Footer
app.get('/header', (req, res) => {
  const filePath = path.join(__dirname, 'components', 'header.html');
  console.log('Serving header from:', filePath);
  res.sendFile(filePath);
});

app.get('/footer', (req, res) => {
  const filePath = path.join(__dirname, 'components', 'footer.html');
  console.log('Serving footer from:', filePath);
  res.sendFile(filePath);
});



// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

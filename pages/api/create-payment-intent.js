import Stripe from 'stripe';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { products } from "../../data/products"; // The source of truth

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authenticate the user (Optional but recommended)
  const session = await getServerSession(req, res, authOptions);

  // 2. Extract items, NOT the amount
  const { items, shippingDetails } = req.body; 

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  try {
    // 3. SERVER-SIDE PRICE CALCULATION (The Security Fix)
    const totalAmount = items.reduce((total, cartItem) => {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) throw new Error(`Product ${cartItem.productId} not found`);
      return total + (product.price * cartItem.quantity);
    }, 0);

    // Add tax and convert to pence (Stripe uses smallest currency unit)
    const amountInPence = Math.round(totalAmount * 1.08 * 100); 

    // 4. Create the Payment Intent with Metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      receipt_email: session?.user?.email,
      metadata: {
        userId: session?.user?.id || 'guest',
        itemCount: items.length,
        // We store the product IDs here for the Webhook to use later
        productIds: items.map(i => i.productId).join(','),
        shipping_zip: shippingDetails?.zip || 'N/A'
      },
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      total: totalAmount * 1.08 // Send total back for UI confirmation only
    });

  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    res.status(500).json({ error: error.message });
  }
}
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from 'lib/CartContext.js';  // <-- fix this import path
import { products } from '../data/products'; // Import your product data

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();  // useCart hook from context
  const [step, setStep] = useState('shipping');
  const [checkoutData, setCheckoutData] = useState({
    shipping: {},
    payment: {},
    items: [],
    total: 0
  });
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [cardErrors, setCardErrors] = useState('');

  // Calculate total from cart items using product data
  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        console.warn('Product not found for cart item:', item);
        return sum;
      }
      return sum + (product.price * item.quantity);
    }, 0);
  };

  useEffect(() => {
    // Redirect if cart is empty
    if (!cart || cart.length === 0) {
      router.push('/cart');
      return;
    }

    setCheckoutData(prev => ({
      ...prev,
      items: cart,
      total: calculateTotal()
    }));

    if (window.Stripe) {
      const stripeInstance = window.Stripe('pk_live_51Qr2StKg0noSfYuQGP6qNLoemAXaMiwaZZfcDfuAtcrq4h5RUlpuzkBE7HbdNa5XnqXaS44C6tiEvVtht9eBiLH500uVeNF7Je');
      setStripe(stripeInstance);
      const elements = stripeInstance.elements();
      const card = elements.create('card');
      card.mount('#card-element');
      setCardElement(card);

      card.on('change', event => {
        setCardErrors(event.error ? event.error.message : '');
      });
    }
  }, [cart, router]);

  // Shipping form submit handler
  const handleShippingSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const shippingInfo = {
      fullName: form['full-name'].value,
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      zip: form.zip.value,
      country: form.country.value,
      phone: form.phone.value,
    };
    setCheckoutData(prev => ({ ...prev, shipping: shippingInfo }));
    setStep('payment');
  };

  // Payment form submit handler
  const handlePaymentSubmit = async e => {
    e.preventDefault();
    setCardErrors('');
    if (!stripe || !cardElement) {
      setCardErrors('Payment is not ready yet.');
      return;
    }

    const form = e.target;
    const cardName = form['card-name'].value.trim();
    if (!cardName) {
      setCardErrors('Please enter the name on card.');
      return;
    }

    const totalWithTax = checkoutData.total * 1.08;
    const amountInCents = Math.round(totalWithTax * 100);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents }),
      });
      const data = await res.json();

      if (data.error) {
        setCardErrors(data.error);
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardName },
        },
      });

      if (result.error) {
        setCardErrors(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setCheckoutData(prev => ({
          ...prev,
          payment: {
            cardName,
            cardNumber: '**** **** **** ' + (result.paymentIntent.payment_method?.card?.last4 || '****'),
            expiry: 'N/A',
          },
        }));
        setStep('review');
      }
    } catch (error) {
      console.error(error);
      setCardErrors('Payment failed. Please try again.');
    }
  };

  // Place order handler (replace OrderManager logic here)
  const placeOrder = () => {
    // Example: Save order in session storage or send to backend API
    const order = {
      id: 'order_' + Date.now(),
      items: checkoutData.items,
      shipping: checkoutData.shipping,
      payment: {
        cardName: checkoutData.payment.cardName,
        lastFour: checkoutData.payment.cardNumber.slice(-4),
        expiry: checkoutData.payment.expiry,
      },
      total: checkoutData.total * 1.08,
    };

    // Clear cart using context method
    clearCart();

    // Save order ID in session storage (for order confirmation page)
    sessionStorage.setItem('lastOrderId', order.id);

    // Redirect to order confirmation page
    router.push('/order-confirmation');
  };

  return (
  <main className="checkout-container">
    {/* Shipping Step */}
    {step === 'shipping' && (
      <form id="shipping-form" onSubmit={handleShippingSubmit} className="checkout-form active">
        <h2>Shipping Information</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="full-name">Full Name</label>
            <input id="full-name" name="full-name" placeholder="Full Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" placeholder="Address" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input id="city" name="city" placeholder="City" required />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input id="state" name="state" placeholder="State" required />
          </div>
          <div className="form-group">
            <label htmlFor="zip">Zip Code</label>
            <input id="zip" name="zip" placeholder="Zip Code" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" placeholder="Country" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" placeholder="Phone Number" required />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary-btn">Continue to Payment</button>
        </div>
      </form>
    )}

    {/* Payment Step */}
    {step === 'payment' && (
      <form id="payment-form" onSubmit={handlePaymentSubmit} className="checkout-form active">
        <h2>Payment Details</h2>

        <div className="form-group">
          <label htmlFor="card-name">Name on Card</label>
          <input id="card-name" name="card-name" type="text" placeholder="Name on Card" required />
        </div>

        <div className="form-group">
          <label>Card Information</label>
          <div id="card-element" style={{ padding: '12px 15px', border: '2px solid #e9ecef', borderRadius: '8px', background: 'white' }}></div>
        </div>

        {cardErrors && <div style={{ color: 'red', marginBottom: '15px' }}>{cardErrors}</div>}

        <div className="form-actions">
          <button type="button" className="btn secondary-btn" onClick={() => setStep('shipping')}>Back to Shipping</button>
          <button type="submit" className="btn primary-btn">Continue to Review</button>
        </div>
      </form>
    )}

    {/* Review Step */}
    {step === 'review' && (
      <section id="order-review" className="checkout-form active">
        <h2>Order Review</h2>

        <div className="review-section">
          <h3>Shipping Address</h3>
          <p>{checkoutData.shipping.fullName}</p>
          <p>{checkoutData.shipping.address}</p>
          <p>{checkoutData.shipping.city}, {checkoutData.shipping.state} {checkoutData.shipping.zip}</p>
          <p>{checkoutData.shipping.country}</p>
          <p>Phone: {checkoutData.shipping.phone}</p>
        </div>

        <div className="review-section">
          <h3>Payment Method</h3>
          <p>Credit Card ending in {checkoutData.payment.cardNumber.slice(-4)}</p>
          <p>Expiration: {checkoutData.payment.expiry}</p>
        </div>

        <div className="review-section">
          <h3>Order Items</h3>
          {checkoutData.items.map((item, i) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;

            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <img src={product.image} alt={product.name} width={50} />
                <div>
                  <p>{product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${product.price.toFixed(2)}</p>
                  <p>Subtotal: ${(product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="review-section">
          <h3>Order Summary</h3>
          <p>Subtotal: ${checkoutData.total.toFixed(2)}</p>
          <p>Shipping: Free</p>
          <p>Tax: ${(checkoutData.total * 0.08).toFixed(2)}</p>
          <p>Total: ${(checkoutData.total * 1.08).toFixed(2)}</p>
        </div>

        <div className="form-actions">
          <button className="btn secondary-btn" onClick={() => setStep('payment')}>Back to Payment</button>
          <button className="btn primary-btn" onClick={placeOrder}>Place Order</button>
        </div>
      </section>
    )}
  </main>
);
}

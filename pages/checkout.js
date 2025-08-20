import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Assuming CartManager and OrderManager are imported or globally available
// Also assuming Stripe.js is loaded externally or via npm package

export default function CheckoutPage() {
  const router = useRouter();
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

  useEffect(() => {
    // Redirect if cart is empty
    if (!CartManager.cart.length) {
      router.push('/cart');
      return;
    }

    setCheckoutData(prev => ({
      ...prev,
      items: CartManager.cart,
      total: CartManager.calculateTotal()
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
  }, [router]);

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
        // Save payment info - Note: card number partial is mocked here
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

  // Place order button handler
  const placeOrder = () => {
    const order = OrderManager.createOrder({
      items: checkoutData.items,
      shipping: checkoutData.shipping,
      payment: {
        cardName: checkoutData.payment.cardName,
        lastFour: checkoutData.payment.cardNumber.slice(-4),
        expiry: checkoutData.payment.expiry,
      },
      total: checkoutData.total * 1.08,
    });

    CartManager.clearCart();
    sessionStorage.setItem('lastOrderId', order.id);
    router.push('/order-confirmation');
  };

  // UI for shipping, payment, review steps should be rendered inside JSX in your Next.js page
  // The div with id="card-element" must be present in payment form

  return (
    <main>
      {/* Render your forms here with handlers */}
      {/* Example for shipping form */}
      {step === 'shipping' && (
        <form id="shipping-form" onSubmit={handleShippingSubmit}>
          {/* Shipping fields here */}
          {/* ... */}
          <button type="submit">Continue to Payment</button>
        </form>
      )}

      {step === 'payment' && (
        <form id="payment-form" onSubmit={handlePaymentSubmit}>
          <input id="card-name" name="card-name" type="text" placeholder="Name on Card" required />
          <div id="card-element"></div>
          {cardErrors && <div style={{ color: 'red' }}>{cardErrors}</div>}
          <button type="button" onClick={() => setStep('shipping')}>Back to Shipping</button>
          <button type="submit">Continue to Review</button>
        </form>
      )}

      {step === 'review' && (
        <section id="order-review">
          {/* Display review info from checkoutData */}
          <div>
            <h3>Shipping Address</h3>
            <p>{checkoutData.shipping.fullName}</p>
            <p>{checkoutData.shipping.address}</p>
            <p>{checkoutData.shipping.city}, {checkoutData.shipping.state} {checkoutData.shipping.zip}</p>
            <p>{checkoutData.shipping.country}</p>
            <p>Phone: {checkoutData.shipping.phone}</p>
          </div>
          <div>
            <h3>Payment Method</h3>
            <p>Credit Card ending in {checkoutData.payment.cardNumber.slice(-4)}</p>
            <p>Expiration: {checkoutData.payment.expiry}</p>
          </div>
          <div>
            <h3>Order Items</h3>
            {checkoutData.items.map((item, i) => (
              <div key={i}>
                <img src={item.product.image} alt={item.product.name} width={50} />
                <p>{item.product.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.product.price.toFixed(2)}</p>
                <p>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div>
            <h3>Order Summary</h3>
            <p>Subtotal: ${checkoutData.total.toFixed(2)}</p>
            <p>Shipping: Free</p>
            <p>Tax: ${(checkoutData.total * 0.08).toFixed(2)}</p>
            <p>Total: ${(checkoutData.total * 1.08).toFixed(2)}</p>
          </div>
          <button onClick={() => setStep('payment')}>Back to Payment</button>
          <button onClick={placeOrder}>Place Order</button>
        </section>
      )}
    </main>
  );
}

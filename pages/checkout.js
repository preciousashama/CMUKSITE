'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';

// Initialize Stripe outside of the component to avoid re-mounting
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ checkoutData, setStep, setCheckoutData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // 1. Create Order in Database first (Status: PENDING_PAYMENT)
    // This ensures if the payment succeeds but the browser crashes, we have a record.
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shipping: checkoutData.shipping
        }),
      });
      
      const { clientSecret, orderId } = await response.json();

      // 2. Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: checkoutData.shipping.fullName },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          clearCart();
          sessionStorage.setItem('lastOrderId', orderId);
          router.push('/order-confirmation');
        }
      }
    } catch (err) {
      setError("Server error. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border-2 border-slate-100 rounded-xl bg-slate-50">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
      <div className="flex gap-4">
        <button type="button" onClick={() => setStep('shipping')} className="flex-1 py-4 font-bold text-slate-500">Back</button>
        <button 
          disabled={!stripe || processing} 
          className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest disabled:bg-slate-300"
        >
          {processing ? 'Processing...' : `Pay ${formatCurrency(checkoutData.total * 1.08)}`}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState('shipping');
  const { cart } = useCart();
  const [checkoutData, setCheckoutData] = useState({ shipping: {}, total: 0 });

  // Calculate total locally ONLY for UI display, backend will re-calculate for security
  useEffect(() => {
    const t = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setCheckoutData(prev => ({ ...prev, total: t }));
  }, [cart]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between mb-12">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className={`flex items-center gap-2 ${step.toLowerCase() === s.toLowerCase() ? 'text-blue-600' : 'text-slate-300'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">{i + 1}</span>
            <span className="font-bold hidden sm:block">{s}</span>
          </div>
        ))}
      </div>

      {step === 'shipping' && (
        <ShippingForm onNext={(data) => {
          setCheckoutData(prev => ({ ...prev, shipping: data }));
          setStep('payment');
        }} />
      )}

      {step === 'payment' && (
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            checkoutData={checkoutData} 
            setStep={setStep} 
            setCheckoutData={setCheckoutData} 
          />
        </Elements>
      )}
    </div>
  );
}
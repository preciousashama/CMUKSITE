'use client';

import { useState, useMemo } from 'react';
import { useCart } from '@/lib/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ShippingForm from '@/components/checkout/ShippingForm';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummarySmall from '@/components/checkout/OrderSummarySmall';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const { cart, subtotal } = useCart();
  const [shippingData, setShippingData] = useState<any>(null);

  // Taxes and totals calculation
  const tax = subtotal * 0.08; 
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Main Checkout Column */}
        <div className="lg:col-span-7">
          {/* Progress Indicator */}
          <div className="flex items-center gap-8 mb-12">
            <StepIndicator number={1} label="Shipping" active={step === 'shipping'} complete={step === 'payment'} />
            <div className="h-px bg-slate-200 flex-grow" />
            <StepIndicator number={2} label="Payment" active={step === 'payment'} />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            {step === 'shipping' ? (
              <ShippingForm 
                onNext={(data) => {
                  setShippingData(data);
                  setStep('payment');
                }} 
              />
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  shippingData={shippingData} 
                  total={total}
                  goBack={() => setStep('shipping')} 
                />
              </Elements>
            )}
          </div>
        </div>

        {/* Sticky Summary Column */}
        <div className="lg:col-span-5">
          <OrderSummarySmall cart={cart} subtotal={subtotal} tax={tax} total={total} />
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ number, label, active, complete }: any) {
  return (
    <div className={`flex items-center gap-3 ${active || complete ? 'text-brand-dark' : 'text-slate-300'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
        active ? 'bg-brand-primary text-white' : complete ? 'bg-emerald-500 text-white' : 'bg-slate-100'
      }`}>
        {complete ? '✓' : number}
      </div>
      <span className="font-black uppercase text-[10px] tracking-widest">{label}</span>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Get Order ID from URL or Session
    const orderId = sessionStorage.getItem('lastOrderId');

    if (!orderId) {
      router.push('/');
      return;
    }

    // 2. RECOVERY LOGIC: This should eventually be: 
    // fetch(`/api/orders/${orderId}`).then(...)
    const fetchOrder = async () => {
      try {
        // Mocking the OrderManager call for now, but ready for API
        const fetchedOrder = await Promise.resolve(OrderManager.getOrderById(orderId));
        
        if (!fetchedOrder) {
          router.push('/');
        } else {
          setOrder(fetchedOrder);
        }
      } catch (error) {
        console.error("Order recovery failed", error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [router]);

  const formatPrice = (amount) => 
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  const subtotal = order.total;
  const tax = order.tax || subtotal * 0.08; // Fallback if tax isn't stored
  const finalTotal = subtotal + tax;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500">Thank you for your purchase. We've sent a receipt to your email.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Order Meta */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Order Details</h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-mono font-bold text-blue-600">{order.id}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500">Date:</span>
              <span className="font-bold">{new Date(order.date).toLocaleDateString()}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">
                {order.status}
              </span>
            </p>
          </div>

          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-8 mb-4">Shipping To</h2>
          <address className="not-italic text-sm text-slate-600 leading-relaxed">
            <span className="block font-bold text-slate-900">{order.shipping.fullName}</span>
            {order.shipping.address}<br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
            {order.shipping.country}
          </address>
        </div>

        {/* Summary Table */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-md overflow-hidden">
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span>
                    <span className="font-bold text-slate-900 block">{item.product.name}</span>
                    <span className="text-slate-400 text-xs">Qty: {item.quantity}</span>
                  </span>
                </div>
                <span className="font-bold">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 pt-4 border-t-2 border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2">
              <span className="font-black text-slate-900">Total</span>
              <span className="font-black text-blue-600">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
          Continue Shopping
        </Link>
        <button className="border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
          Download PDF Invoice
        </button>
      </div>
    </div>
  );
}
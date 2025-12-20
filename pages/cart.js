'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/CartContext';
import { formatCurrency } from '../lib/utils'; // Assuming we move the formatter to a utility

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Memoize subtotal for performance
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="border-b pb-8 mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">SHOPPING BAG</h1>
        <p className="text-slate-500 mt-2">
          {cart.length === 1 ? '1 item' : `${cart.length} items`} ready for checkout
        </p>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-slate-600 font-medium mb-6">Your bag is currently empty.</p>
          <Link href="/products" 
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-black tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* List of Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div 
                key={`${item.productId}-${item.options?.color}-${item.options?.size}`} 
                className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Info & Controls */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase">{item.name}</h3>
                      <div className="flex gap-4 mt-1">
                        {item.options?.color && (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            Color: <span className="text-slate-900">{item.options.color}</span>
                          </span>
                        )}
                        {item.options?.size && (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            Size: <span className="text-slate-900">{item.options.size}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-black text-slate-900">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.options)}
                        className="px-3 py-1 hover:bg-white transition-colors"
                      >-</button>
                      <span className="px-4 py-1 text-sm font-bold border-x border-slate-200">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.options)}
                        className="px-3 py-1 hover:bg-white transition-colors"
                      >+</button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.productId, item.options)}
                      className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sticky top-8">
              <h2 className="text-xl font-black uppercase mb-6 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-400 font-bold uppercase text-xs">Free</span>
                </div>
                <div className="border-t border-slate-800 pt-4 mt-4 flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span className="text-blue-400">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-8 bg-blue-600 text-center py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-900/20"
              >
                Go to Checkout
              </Link>

              <p className="mt-6 text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">
                Secure SSL Checkout • 30 Day Returns
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
'use client';
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="group flex flex-col sm:flex-row gap-8 p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-brand-primary/20 transition-all"
    >
      {/* Product Image */}
      <div className="w-full sm:w-40 h-40 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 relative">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Details */}
      <div className="flex-grow flex flex-col justify-between py-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-dark">{item.name}</h3>
            <div className="flex gap-4">
              {item.options?.size && (
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Size: <span className="text-brand-dark">{item.options.size}</span></span>
              )}
              {item.options?.color && (
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Color: <span className="text-brand-dark">{item.options.color}</span></span>
              )}
            </div>
          </div>
          <p className="text-lg font-black italic text-brand-dark">{formatCurrency(item.price)}</p>
        </div>

        <div className="flex justify-between items-center mt-8">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button 
              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.options)}
              className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white rounded-lg transition-colors"
            >-</button>
            <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.options)}
              className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white rounded-lg transition-colors"
            >+</button>
          </div>
          
          <button
            onClick={() => removeFromCart(item.productId, item.options)}
            className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
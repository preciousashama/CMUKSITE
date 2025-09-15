// pages/cart.js
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { products } from '../data/products';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  function formatPrice(price) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  }

  const subtotal = cart.reduce((total, cartItem) => {
    const product = products.find(p => p.id === cartItem.productId);
    return total + (product ? product.price * cartItem.quantity : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link href="/products" className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cart.map((cartItem, i) => {
              const product = products.find(p => p.id === cartItem.productId);
              if (!product) return null;

              return (
                <li key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6">
                  {/* Product Info */}
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-md border" />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-gray-600">{formatPrice(product.price)}</p>
                      {cartItem.options?.color && <p className="text-sm text-gray-500">Color: {cartItem.options.color}</p>}
                      {cartItem.options?.size && <p className="text-sm text-gray-500">Size: {cartItem.options.size}</p>}
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={cartItem.quantity}
                      className="w-16 border border-gray-300 rounded text-center py-1"
                      onChange={(e) =>
                        updateQuantity(cartItem.productId, parseInt(e.target.value) || 1, cartItem.options)
                      }
                    />
                    <button
                      onClick={() => removeFromCart(cartItem.productId, cartItem.options)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Subtotal & Checkout */}
          <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="text-xl font-bold">Subtotal: {formatPrice(subtotal)}</span>
            <Link
              href="/checkout"
              className="mt-4 sm:mt-0 bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition"
            >
              Go to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

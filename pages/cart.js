// pages/cart.js
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { products } from '../data/products'; // Import your product data

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart(); // Destructure all needed functions

  // Helper to format currency
  function formatPrice(price) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
  }

  // Calculate the total price of all items in the cart
  const subtotal = cart.reduce((total, cartItem) => {
    const product = products.find(p => p.id === cartItem.productId);
    return total + (product ? product.price * cartItem.quantity : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((cartItem, i) => {
              // Find the product details using the productId
              const product = products.find(p => p.id === cartItem.productId);

              // If product not found (e.g., deleted), skip rendering it
              if (!product) return null;

              return (
                <li key={i} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-gray-600">{formatPrice(product.price)}</p>
                      {/* You can display the selected color and size here */}
                      {cartItem.options?.color && <p className="text-sm">Color: {cartItem.options.color}</p>}
                      {cartItem.options?.size && <p className="text-sm">Size: {cartItem.options.size}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label htmlFor={`quantity-${i}`} className="sr-only">Quantity for {product.name}</label>
                    <input
                      id={`quantity-${i}`}
                      type="number"
                      value={cartItem.quantity}
                      min="1"
                      className="w-16 text-center border rounded"
                      onChange={(e) => updateQuantity(cartItem.productId, parseInt(e.target.value) || 1, cartItem.options)}
                    />
                    <button
                      onClick={() => removeFromCart(cartItem.productId, cartItem.options)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 pt-4 border-t-2 flex justify-between items-center">
            <span className="text-xl font-bold">Subtotal:</span>
            <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-6 flex justify-end">
            <Link
              href="/checkout"
              className="bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition"
            >
              Go to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
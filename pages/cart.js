import Link from 'next/link';
import { useCart } from '../lib/CartContext';  // Import the hook

export default function CartPage() {
  const { cart } = useCart();  // Use the context hook inside the component

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.productId}</span> {/* or whatever you want to display */}
                <span>Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
            <Link
              href="/checkout"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Go to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

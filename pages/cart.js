import Link from 'next/link'

export default function CartPage() {
  // Later you’ll connect this with context/localStorage
  const items = []  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.name}</span>
                <span>£{item.price}</span>
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
  )
}

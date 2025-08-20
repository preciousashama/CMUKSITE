import { useEffect, useState } from 'react';

// Mock CartManager - Replace with your actual cart logic or context
const CartManager = {
  cart: [
    // example initial cart item, replace or load from localStorage/api
    {
      product: {
        id: 1,
        name: 'Example Product',
        category: 'Example Category',
        price: 25.99,
        image: '/images/example-product.jpg',
      },
      quantity: 2,
    },
  ],
  updateQuantity(productId, quantity) {
    this.cart = this.cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
  },
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
  },
  calculateTotal() {
    return this.cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  },
};

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    // Simulate loading from CartManager or API
    setTimeout(() => {
      setCart([...CartManager.cart]); // clone cart to state
      setLoading(false);
    }, 500);
  }, []);

  // Update quantity handler
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) quantity = 1;
    if (quantity > 10) quantity = 10;

    CartManager.updateQuantity(productId, quantity);
    setCart([...CartManager.cart]);
  };

  // Remove item handler
  const handleRemove = (productId) => {
    CartManager.removeFromCart(productId);
    setCart([...CartManager.cart]);
  };

  // Checkout button handler
  const handleCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      // Redirect to checkout page
      window.location.href = '/checkout';
    }, 1000);
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <div
          style={{
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
            fontSize: '2rem',
          }}
        >
          ⟳
        </div>
        <p>Loading your cart...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon" style={{ fontSize: '4rem' }}>
          🛒
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="/products" className="btn">
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Review your items and proceed to checkout</p>
      </section>

      <div className="cart-content" style={{ display: 'flex', gap: '2rem' }}>
        {/* Cart Items */}
        <section className="cart-items" style={{ flex: 3 }}>
          <table className="cart-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const subtotalItem = item.product.price * item.quantity;
                return (
                  <tr key={item.product.id} style={{ transition: 'all 0.3s ease' }}>
                    <td className="cart-product-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
                      />
                      <div>
                        <h3 style={{ margin: 0 }}>{item.product.name}</h3>
                        <p className="cart-product-category" style={{ color: '#666', fontSize: '0.9rem' }}>
                          {item.product.category}
                        </p>
                      </div>
                    </td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.product.id, parseInt(e.target.value))
                        }
                        style={{
                          width: '60px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </td>
                    <td>${subtotalItem.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        style={{
                          backgroundColor: '#ff4d4d',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Cart Summary */}
        <section
          className="cart-summary"
          style={{
            flex: 1,
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            height: 'fit-content',
          }}
        >
          <h2>Order Summary</h2>
          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div
            className="summary-row total"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              marginTop: '1rem',
            }}
          >
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            id="checkout-btn"
            onClick={handleCheckout}
            disabled={checkoutLoading}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '10px',
              backgroundColor: '#667eea',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </section>
      </div>
    </div>
  );
}

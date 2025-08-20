import { useEffect, useState } from 'react';
import OrderManager from '../lib/order-manager';

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orderId = sessionStorage.getItem('lastOrderId');

    if (!orderId) {
      window.location.href = '/';
      return;
    }

    const fetchedOrder = OrderManager.getOrderById(orderId);

    if (!fetchedOrder) {
      window.location.href = '/';
      return;
    }

    setOrder(fetchedOrder);
    sessionStorage.removeItem('lastOrderId');
  }, []);

  if (!order) {
    return <p>Loading order details...</p>;
  }

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tax = order.total * 0.08;
  const totalWithTax = order.total + tax;

  return (
    <div>
      <h1>Order Confirmation</h1>

      <section id="order-info">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {formattedDate}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </section>

      <section id="shipping-address">
        <p>{order.shipping.fullName}</p>
        <p>{order.shipping.address}</p>
        <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</p>
        <p>{order.shipping.country}</p>
        <p>Phone: {order.shipping.phone}</p>
      </section>

      <section id="order-summary">
        {order.items.map((item, idx) => (
          <div key={idx}>
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div>
          <span>Subtotal:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <div>
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div>
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div>
          <strong>Total:</strong>
          <strong>${totalWithTax.toFixed(2)}</strong>
        </div>
      </section>
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Order confirmation page loaded');

  // Get the last order ID from session storage
  const orderId = sessionStorage.getItem('lastOrderId');

  if (!orderId) {
    window.location.href = '/';
    return;
  }

  const order = OrderManager.getOrderById(orderId);

  if (!order) {
    window.location.href = '/';
    return;
  }

  // Format date
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Populate Order Info
  const orderInfoElement = document.getElementById('order-info');
  orderInfoElement.innerHTML = `
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Status:</strong> ${order.status}</p>
  `;

  // Populate Shipping Address
  const shippingAddressElement = document.getElementById('shipping-address');
  shippingAddressElement.innerHTML = `
    <p>${order.shipping.fullName}</p>
    <p>${order.shipping.address}</p>
    <p>${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}</p>
    <p>${order.shipping.country}</p>
    <p>Phone: ${order.shipping.phone}</p>
  `;

  // Build Order Summary
  const orderSummaryElement = document.getElementById('order-summary');
  let summaryHtml = '<div>';

  order.items.forEach(item => {
    summaryHtml += `
      <div>
        <span>${item.product.name} × ${item.quantity}</span>
        <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  const tax = order.total * 0.08;

  summaryHtml += `
    <div>
      <span>Subtotal:</span>
      <span>$${order.total.toFixed(2)}</span>
    </div>
    <div>
      <span>Shipping:</span>
      <span>Free</span>
    </div>
    <div>
      <span>Tax:</span>
      <span>$${tax.toFixed(2)}</span>
    </div>
    <div>
      <strong>Total:</strong>
      <strong>$${(order.total + tax).toFixed(2)}</strong>
    </div>
  `;

  summaryHtml += '</div>';
  orderSummaryElement.innerHTML = summaryHtml;

  // Clear stored order ID
  sessionStorage.removeItem('lastOrderId');
});

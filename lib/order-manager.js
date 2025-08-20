// lib/orderManager.js
import { isLoggedIn, getCurrentUser } from './user-manager';

let orders = [];

// Save orders to localStorage
function saveOrders() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('myShopOrders', JSON.stringify(orders));
  }
}

// Load orders from localStorage
function loadOrders() {
  if (typeof window !== 'undefined') {
    const ordersJson = localStorage.getItem('myShopOrders');
    orders = ordersJson ? JSON.parse(ordersJson) : [];
  }
  return orders;
}

// Create a new order
function createOrder(orderData) {
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const user = isLoggedIn() ? getCurrentUser() : null;

  const order = {
    id: orderId,
    userId: user ? user.id : null,
    items: orderData.items,
    shipping: orderData.shipping,
    payment: orderData.payment,
    total: orderData.total,
    status: 'Confirmed',
    date: new Date().toISOString()
  };

  orders.push(order);
  saveOrders();

  return order;
}

// Get all orders
function getAllOrders() {
  return orders;
}

// Get orders for current user
function getCurrentUserOrders() {
  const user = isLoggedIn() ? getCurrentUser() : null;
  if (!user) return [];
  return orders.filter(order => order.userId === user.id);
}

// Get order by ID
function getOrderById(orderId) {
  return orders.find(order => order.id === orderId);
}

export const OrderManager = {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getOrderById,
  saveOrders,
  loadOrders
};

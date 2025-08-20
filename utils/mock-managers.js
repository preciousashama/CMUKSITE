// utils/mock-managers.js

export const UserManager = {
  currentUser: {
    username: 'testuser',
    email: 'testuser@example.com',
  },
  isLoggedIn: () => true,
  logoutUser: () => console.log('Logged out!'),
};

export const OrderManager = {
  getCurrentUserOrders: () => [
    {
      id: '12345',
      date: '2024-07-10T10:00:00Z',
      total: 59.99,
      status: 'Shipped',
      items: [
        { name: 'T-shirt', quantity: 2 },
        { name: 'Stickers', quantity: 1 },
      ],
    },
  ],
};

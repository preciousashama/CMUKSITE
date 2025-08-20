
const USERS_KEY = 'myShopUsers';
const CURRENT_USER_KEY = 'myShopCurrentUser';

// Helpers to safely access localStorage
function isBrowser() {
  return typeof window !== 'undefined';
}

// Get all users
export function getAllUsers() {
  if (!isBrowser()) return [];
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Save all users
function saveAllUsers(users) {
  if (isBrowser()) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

// Save current user
function saveCurrentUser(user) {
  if (isBrowser()) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

// Load current user
export function loadCurrentUser() {
  if (!isBrowser()) return null;
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// Register new user
export function registerUser(username, email, password) {
  const users = getAllUsers();

  if (users.some(user => user.username === username)) {
    return { success: false, message: "Username already taken" };
  }

  if (users.some(user => user.email === email)) {
    return { success: false, message: "Email already registered" };
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password, // WARNING: never store plain passwords in production
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAllUsers(users);
  saveCurrentUser({ id: newUser.id, username, email });

  return {
    success: true,
    user: { id: newUser.id, username, email },
  };
}

// Login user
export function loginUser(username, password) {
  const users = getAllUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return { success: false, message: "Invalid username or password" };
  }

  const currentUser = { id: user.id, username: user.username, email: user.email };
  saveCurrentUser(currentUser);

  return { success: true, user: currentUser };
}

// Logout user
export function logoutUser() {
  if (isBrowser()) {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  return { success: true };
}

// Check login status
export function isLoggedIn() {
  return !!loadCurrentUser();
}

// UI update for header (if needed)
export function updateUI() {
  if (!isBrowser()) return;
  const user = loadCurrentUser();

  const signInLink = document.querySelector('.header-icons a[href="login.html"]');
  const loginLinks = document.querySelectorAll('.login-link');

  if (signInLink) {
    if (user) {
      signInLink.textContent = `${user.username}'s Account`;
      signInLink.href = "account.html";
    } else {
      signInLink.textContent = 'SIGN IN / SIGN UP';
      signInLink.href = "login.html";
    }
  }

  loginLinks.forEach(link => {
    link.innerHTML = user
      ? `<a href="account.html">${user.username}'s Account</a>`
      : `<a href="login.html">Login</a>`;
  });
}

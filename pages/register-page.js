import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

// Dummy UserManager mock (replace with your actual implementation)
const UserManager = {
  isLoggedIn: () => false,
  registerUser: (username, email, password) => {
    // Simulate registration logic; you can replace with API call
    if (username === 'taken') {
      return { success: false, message: 'Username is already taken' };
    }
    return { success: true };
  },
};

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'

  useEffect(() => {
    if (UserManager.isLoggedIn()) {
      // Redirect if already logged in
      window.location.href = '/account';
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setMessageType('error');
      setMessage('Password must be at least 6 characters long');
      return;
    }

    const result = UserManager.registerUser(username, email, password);
    if (result.success) {
      setMessageType('success');
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/'; // Redirect to home page
      }, 1500);
    } else {
      setMessageType('error');
      setMessage(result.message);
    }
  };

  return (
    <>
      <Head>
        <title>My Shop - Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Include your CSS files here or import them globally */}
        <link rel="stylesheet" href="/css/global.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/header.css" />
        <link rel="stylesheet" href="/css/footer.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link rel="stylesheet" href="/css/products.css" />
      </Head>

      {/* You can import Header and Footer components here if you have them */}
      {/* <Header /> */}

      <main>
        <section className="auth-container">
          <h1>Create an Account</h1>
          {message && (
            <div className={`auth-message ${messageType}`}>
              {message}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn auth-btn">
              Register
            </button>
          </form>

          <div className="auth-footer">
  <p>
    Already have an account?{' '}
    <Link href="/login">Login here</Link>
  </p>
</div>

        </section>
      </main>

      {/* <Footer /> */}
    </>
  );
}

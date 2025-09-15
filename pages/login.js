import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect logged in users to homepage
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  // State for email/password login (your registration system)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    console.log('Login result:', result);

    if (result?.error) {
      alert('Login failed: ' + result.error);
    } else if (result?.ok) {
      router.push('/');
    }
  };

  return (
    <div className="login-container">
  <h1>Login</h1>
  <div className="center-button">
  <button className="google-button" onClick={() => signIn('google')}>
    Sign in with Google
  </button>
</div>

  <h2>Or login with email</h2>
  <form onSubmit={handleEmailLogin}>
    <label>Email:</label>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

    <label>Password:</label>
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

    <button type="submit">Login</button>
  </form>

  <p>Don't have an account? <a href="/register">Register here</a></p>
</div>

  );
}

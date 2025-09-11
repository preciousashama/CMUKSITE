import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 fields
  const [company, setCompany] = useState('');
  const [shipping, setShipping] = useState({ address: '', city: '', postcode: '', country: '' });
  const [billing, setBilling] = useState({ address: '', city: '', postcode: '', country: '' });

  const [sameAsShipping, setSameAsShipping] = useState(false);

  const isStep1Complete =
    firstName && lastName && email && dob && password && confirmPassword && password === confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>

      <main className="multi-step-form">
        <h1>Create an Account</h1>

        <form onSubmit={handleRegister}>
          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label>First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {isStep1Complete && (
                <button type="button" onClick={() => setStep(2)} className="next-btn">
                  Next
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label>Company</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>

              <h3>Shipping Address</h3>
              <div className="form-group">
                <label>Address</label>
                <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Postcode</label>
                <input value={shipping.postcode} onChange={(e) => setShipping({ ...shipping, postcode: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                  />
                  Billing address same as shipping
                </label>
              </div>

              {!sameAsShipping && (
                <>
                  <h3>Billing Address</h3>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      value={billing.address}
                      onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Postcode</label>
                    <input value={billing.postcode} onChange={(e) => setBilling({ ...billing, postcode: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input value={billing.country} onChange={(e) => setBilling({ ...billing, country: e.target.value })} />
                  </div>
                </>
              )}

              {message && (
                <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          )}
        </form>
      </main>
    </>
  );
}

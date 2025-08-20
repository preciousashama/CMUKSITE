// components/Footer.js
import { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    const form = document.getElementById('newsletter-form');

    if (!form) return;

    function handleSubmit(event) {
      event.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const messageElement = document.getElementById('newsletter-message');

      const email = emailInput.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValid) {
        showNewsletterMessage('Please enter a valid email address.', 'error', messageElement);
        return;
      }

      console.log('Newsletter signup:', email);
      showNewsletterMessage('Thank you for subscribing!', 'success', messageElement);
      form.reset();
    }

    function showNewsletterMessage(message, type, el) {
      if (!el) return;
      el.textContent = message;
      el.className = `newsletter-message ${type}`;
      setTimeout(() => {
        el.textContent = '';
        el.className = 'newsletter-message';
      }, 3000);
    }

    form.addEventListener('submit', handleSubmit);

    // Cleanup on unmount
    return () => form.removeEventListener('submit', handleSubmit);
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Example footer content from your footer.html */}
        <p>&copy; {new Date().getFullYear()} CustomiseMe UK</p>

        {/* Newsletter Form */}
        <form id="newsletter-form" className="newsletter-form">
          <input
            type="email"
            id="newsletter-email"
            placeholder="Enter your email"
            aria-label="Email Address"
            required
          />
          <button type="submit">Subscribe</button>
          <div id="newsletter-message" className="newsletter-message"></div>
        </form>
      </div>
    </footer>
  );
}

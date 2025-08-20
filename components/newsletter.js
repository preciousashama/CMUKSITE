// components/NewsletterPopup.js
import { useEffect, useState } from 'react';

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

export default function NewsletterPopup() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!getCookie('newsletterPopupShown')) {
      const timer = setTimeout(() => {
        setIsActive(true);
        document.body.style.overflow = 'hidden';
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsActive(false);
    document.body.style.overflow = '';
    setCookie('newsletterPopupShown', 'true', 7);
  };

  if (!isActive) return null;

  return (
    <>
      <div id="popupOverlay" className="active" onClick={closePopup}></div>

      <div id="newsletterPopup" className="active">
        <button id="closePopup" onClick={closePopup} aria-label="Close popup">
          &times;
        </button>
        <h2>Subscribe to our Newsletter</h2>
        <p>Stay updated with our latest news.</p>
        {/* Add your newsletter form here */}
      </div>
    </>
  );
}

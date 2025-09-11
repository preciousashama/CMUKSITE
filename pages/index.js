import { useEffect } from 'react';
import Head from 'next/head';
import ProductDisplay from '../components/ProductDisplay';


export default function HomePage() {
  useEffect(() => {
    // Your animation and slider setup here (unchanged)
  }, []);

  return (
    <>
      <Head>
        <title>CMUK Home</title>
      </Head>
      <main>
        {/* Hero Image Carousel */}
        <div className="main-image-slider">
          <div className="slider-container">
            <div className="slide"><img src="/assets/images/shopproducts.png" alt="Slide 1" /></div>
          </div>
        </div>

        {/* Best Sellers */}
        <section className="best-sellers-section" id="best-sellers">
          <div className="best-sellers-title">
            <h1></h1>
          </div>
          <div className="best-sellers-images">
            <a href="/apparel" className="product-item"><img src="/assets/Thumnails/Apparel Thumbnail.png" alt="Apparel" /></a>
            <a href="/products?category=stickers" className="product-item"><img src="/assets/Thumnails/Stickers Thumbnail.png" alt="Stickers" /></a>
            <a href="/party-occasions" className="product-item"><img src="/assets/Thumnails/Party Thumbnail.png" alt="Party" /></a>
          </div>
        </section>

        {/* Reviews */}
        <section className="reviews-section" id="reviews">
          <div className="title-button-group">
            <h1 id="reviews-title">OUR REVIEWS</h1>
            <a href="/all-reviews" className="btn">READ MORE</a>
          </div>
          <div className="bubbles-wrapper">
            <div className="bubbles-container">
              {[
                "Amazing quality prints!",
                "Fast delivery service",
                "Love my custom shirt!",
                "Professional team",
                "Great customer support",
                "Excellent value for money",
                "Highly recommended!",
                "Perfect party supplies",
                "Quick turnaround time",
                "Outstanding quality"
              ].map((text, i) => (
                <div className="bubble" key={i}>{text}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Popup */}
        <div className="newsletter-popup" id="newsletterPopup">
          <div className="newsletter-popup-content">
            <button className="popup-close" id="closePopup">&times;</button>
            <div className="popup-header">
              <h2 className="popup-title">Join our community</h2>
              <p className="popup-subtitle">Sign up for 10% off your first order</p>
            </div>
            <div className="popup-body">
              <p className="popup-description">Stay updated with our latest designs, exclusive offers, and creative inspiration delivered straight to your inbox.</p>
              <form className="popup-form">
                <div className="popup-input-group">
                  <input type="email" placeholder="Enter your email address" required />
                  <button type="submit" className="popup-subscribe-btn">Subscribe <span>→</span></button>
                </div>
              </form>
              <div className="popup-form-footer">
                <div className="popup-privacy-note">We respect your privacy. Unsubscribe at any time.</div>
                <div className="popup-social-proof">Join over 5,000 happy customers</div>
              </div>
            </div>
            <div className="popup-footer">
              <a href="#" className="popup-no-thanks">No thanks, I'll pay full price</a>
            </div>
          </div>
        </div>

        <div className="popup-overlay" id="popupOverlay" />
      </main>
    </>
  );
}

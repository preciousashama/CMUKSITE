// pages/index.js
import { useEffect } from 'react';
import Head from 'next/head';
import Header from 'components/header';
import Footer from 'components/footer';
import ProductDisplay from '../components/ProductDisplay';


export default function HomePage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    /** SLIDER SETUP **/
    const slides = document.querySelectorAll('.slide');
    const container = document.querySelector('.slider-container');
    let currentSlide = 0;
    const totalRealSlides = 3;

    function showNextSlide() {
      if (slides.length === 0 || !container) return;
      currentSlide = (currentSlide + 1) % totalRealSlides;
      const translateX = -(1 + currentSlide) * 100;
      container.style.transform = `translateX(${translateX}vw)`;

      if (currentSlide === 0) {
        setTimeout(() => {
          container.style.transition = 'none';
          container.style.transform = 'translateX(-100vw)';
          setTimeout(() => {
            container.style.transition = 'transform 0.5s ease-in-out';
          }, 10);
        }, 500);
      }
    }

    if (slides.length > 0 && container) {
      currentSlide = 0;
      container.style.transform = 'translateX(-100vw)';
      container.style.transition = 'transform 0.5s ease-in-out';
    }

    const intervalId = setInterval(showNextSlide, 5000);

    /** BUBBLE ANIMATION SETUP **/
    const bubbles = document.querySelectorAll('.bubble');
    const parent = document.querySelector('.bubbles-container');
    const title = document.getElementById('reviews-title');
    let parentRect, titleRect, containerRect, titleZone;
    const bubbleObjects = [];

    if (parent && bubbles.length > 0) {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      bubbles.forEach((bubble) => {
        const bubbleWidth = 120;
        const bubbleHeight = 120;
        const { x, y } = generateValidStartingPosition(bubbleWidth, bubbleHeight);

        bubble.style.position = 'absolute';
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        const speed = 0.8;
        const angle = Math.random() * 2 * Math.PI;
        const speedX = Math.cos(angle) * speed;
        const speedY = Math.sin(angle) * speed;

        const bubbleObj = {
          bubble,
          posX: x,
          posY: y,
          speedX,
          speedY,
          width: bubbleWidth,
          height: bubbleHeight,
          isPaused: false
        };

        bubble.addEventListener('mouseenter', () => (bubbleObj.isPaused = true));
        bubble.addEventListener('mouseleave', () => (bubbleObj.isPaused = false));
        bubbleObjects.push(bubbleObj);
      });

      requestAnimationFrame(animate);
    }

    function updateDimensions() {
      parentRect = parent.getBoundingClientRect();
      titleRect = title.getBoundingClientRect();
      containerRect = parent.getBoundingClientRect();
      titleZone = {
        x: titleRect.left - containerRect.left,
        y: titleRect.top - containerRect.top,
        width: titleRect.width,
        height: titleRect.height + 60
      };
    }

    function generateValidStartingPosition(bubbleWidth, bubbleHeight) {
      let x, y, attempts = 0;
      const maxAttempts = 50;
      do {
        x = Math.random() * (parentRect.width - bubbleWidth);
        y = Math.random() * (parentRect.height - bubbleHeight);
        attempts++;
        if (attempts > maxAttempts) break;
      } while (
        x < titleZone.x + titleZone.width &&
        x + bubbleWidth > titleZone.x &&
        y < titleZone.y + titleZone.height &&
        y + bubbleHeight > titleZone.y
      );
      return { x, y };
    }

    function updateBubble(bubble) {
      if (bubble.isPaused) return;
      bubble.posX += bubble.speedX;
      bubble.posY += bubble.speedY;

      const containerWidth = parent.offsetWidth;
      const containerHeight = parent.offsetHeight;

      if (bubble.posX <= 0 || bubble.posX + bubble.width >= containerWidth) bubble.speedX *= -1;
      if (bubble.posY <= 0 || bubble.posY + bubble.height >= containerHeight) bubble.speedY *= -1;

      bubble.bubble.style.left = `${bubble.posX}px`;
      bubble.bubble.style.top = `${bubble.posY}px`;
    }

    function animate() {
      bubbleObjects.forEach((b1, i) => {
        for (let j = i + 1; j < bubbleObjects.length; j++) {
          const b2 = bubbleObjects[j];
          const dx = (b1.posX + b1.width / 2) - (b2.posX + b2.width / 2);
          const dy = (b1.posY + b1.height / 2) - (b2.posY + b2.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = (b1.width + b2.width) / 2 * 0.95;

          if (distance < minDist && distance > 0) {
            const overlap = minDist - distance;
            const moveX = (dx / distance) * (overlap / 2);
            const moveY = (dy / distance) * (overlap / 2);
            b1.posX += moveX;
            b1.posY += moveY;
            b2.posX -= moveX;
            b2.posY -= moveY;

            [b1.speedX, b2.speedX] = [b2.speedX, b1.speedX];
            [b1.speedY, b2.speedY] = [b2.speedY, b1.speedY];
          }
        }
      });

      bubbleObjects.forEach(updateBubble);
      requestAnimationFrame(animate);
    }

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Head>
        <title>CMUK Home</title>
      </Head>
      <Header />
      <main>
        {/* Hero Image Carousel */}
        <div className="main-image-slider">
          <div className="slider-container">
            <div className="slide"><img src="/assets/images/shopproducts.png" alt="Slide 1" /></div>
            <div className="slide"><img src="/assets/images/shopservices.png" alt="Slide 2" /></div>
            <div className="slide"><img src="/assets/images/subscriptions.png" alt="Slide 3" /></div>
            <div className="slide"><img src="/assets/images/shopproducts.png" alt="Slide 1 duplicate" /></div>
            <div className="slide"><img src="/assets/images/shopservices.png" alt="Slide 2 duplicate" /></div>
          </div>
        </div>

        {/* Best Sellers */}
        <section className="best-sellers-section" id="best-sellers">
          <div className="best-sellers-title">
            <h1>BESTSELLERS</h1>
          </div>
          <div className="best-sellers-images">
            <a href="/apparel" className="product-item"><img src="/assets/Thumnails/Apparel Thumbnail.png" alt="Apparel" /></a>
            <a href="/stickers" className="product-item"><img src="/assets/Thumnails/Stickers Thumbnail.png" alt="Stickers" /></a>
            <a href="/party-occasions" className="product-item"><img src="/assets/Thumnails/Party Thumbnail.png" alt="Party" /></a>
          </div>
        </section>

        <ProductDisplay />

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
      <Footer />
    </>
  );
}

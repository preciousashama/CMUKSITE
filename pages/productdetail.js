import { useEffect, useState } from 'react';
import { products } from '../data/products';
import { WishlistManager } from '../lib/wishlist-manager';
import { useCart } from '../lib/CartContext';
import dynamic from 'next/dynamic';
import React from 'react';


const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Purple', hex: '#800080' },
];

export default function ProductDetail() {
  const ThreeCanvas = dynamic(() => import('../components/ThreeCanvas'), { ssr: false });
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [placement, setPlacement] = useState('left');
  const [uploadedArtworkSrc, setUploadedArtworkSrc] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const productId = idParam ? parseInt(idParam) : null;

    if (!productId) {
      setProduct(null);
      return;
    }

    const foundProduct = products.find(p => p.id === productId);
    if (!foundProduct) {
      setProduct(null);
      return;
    }

    setProduct(foundProduct);

    const defaultColorName = foundProduct.colors?.[0] || 'Black';
    const defaultColorObj = COLOR_OPTIONS.find(c => c.name === defaultColorName) || COLOR_OPTIONS[0];
    setSelectedColor(defaultColorObj);

    const isBag = foundProduct.category?.toLowerCase().includes('bag');
    const sizes = isBag ? ['One Size'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const initialQuantities = {};
    sizes.forEach(size => (initialQuantities[size] = 0));
    setSizeQuantities(initialQuantities);

    document.title = `My Shop - ${foundProduct.name}`;
  }, []);

  if (!product) {
    return <p>Product not found.</p>;
  }

  const isBag = product.category?.toLowerCase().includes('bag');
  const sizes = isBag ? ['One Size'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const colors = (product.colors || COLOR_OPTIONS.map(c => c.name)).map(colorName => {
    return COLOR_OPTIONS.find(c => c.name === colorName) || { name: colorName, hex: '#000000' };
  });

  const placements = ['left', 'right', 'centre', 'bottom right', 'bottom left'];

  const totalQuantity = Object.values(sizeQuantities).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  const subtotal = totalQuantity * product.price;

  function formatPrice(price) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
  }

  function showToast(message, type = 'default') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function onQuantityChange(size, value) {
    const val = Math.max(0, Number(value) || 0);
    setSizeQuantities(prev => ({ ...prev, [size]: val }));
  }

  function handleAddToCart() {
    if (totalQuantity === 0) {
      showToast('Please select at least one size and quantity', 'error');
      return;
    }
    Object.entries(sizeQuantities).forEach(([size, quantity]) => {
      if (quantity > 0) {
        addToCart(product, quantity, { color: selectedColor.name, size });
      }
    });
    showToast(`${totalQuantity} item(s) added to bag`, 'success');
  }

  function toggleWishlist() {
    if (WishlistManager.isInWishlist(product.id)) {
      WishlistManager.removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      WishlistManager.addToWishlist(product.id);
      showToast('Added to wishlist', 'success');
    }
  }

  function handleDesignUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setUploadedArtworkSrc(e.target.result);
    reader.readAsDataURL(file);
  }

  function handlePlacementChange(e) {
    setPlacement(e.target.value);
  }

  return (
    <div className="product-detail-page">
      <main className="product-main">
        <div className="product-canvas">
          <ThreeCanvas color={selectedColor.hex} />
          {uploadedArtworkSrc && (
            <img
              src={uploadedArtworkSrc}
              alt="Uploaded artwork"
              className={`uploaded-artwork ${placement.replace(/\s+/g, '-')}`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', userSelect: 'none' }}
            />
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>

          <div className="option-group">
            <label className="side-label">1. SELECT COLOR</label>
            <div className="color-options">
              {colors.map(color => (
                <div
                  key={color.name}
                  className={`color-circle ${selectedColor.name === color.name ? 'selected' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedColor(color);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="option-group sizes-quantity">
            <label className="side-label">2. SELECT SIZE & QUANTITY</label>
            <div className="sizes-header">
              {sizes.map(size => (
                <div key={size} className="size-label">{size}</div>
              ))}
            </div>
            <div className="sizes-inputs">
              {sizes.map(size => (
                <input
                  key={size}
                  type="number"
                  min={0}
                  max={100}
                  value={sizeQuantities[size]}
                  onChange={e => onQuantityChange(size, e.target.value)}
                  aria-label={`Quantity for size ${size}`}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <label className="side-label">3. SELECT PLACEMENT</label>
            <div className="placement-options">
              {placements.map(pos => (
                <React.Fragment key={pos}>
                  <input
                    type="radio"
                    id={`placement-${pos}`}
                    name="placement"
                    value={pos}
                    checked={placement === pos}
                    onChange={handlePlacementChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`placement-${pos}`}>{pos}</label>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="option-group">
            <div><strong>Unit Price:</strong> {formatPrice(product.price)}</div>
            <div><strong>Subtotal:</strong> {formatPrice(subtotal)}</div>
          </div>

          <div className="action-buttons">
            <button onClick={handleAddToCart} disabled={totalQuantity === 0}>
              ADD TO BAG
            </button>
            <button onClick={toggleWishlist}>
              {WishlistManager.isInWishlist(product.id) ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
            </button>
          </div>

          <div className="upload-buttons" style={{ marginTop: '15px' }}>
            <input
              type="file"
              id="design-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleDesignUpload}
            />
            <label htmlFor="design-upload" style={{ cursor: 'pointer', fontWeight: '600', color: '#0070f3' }}>
              UPLOAD YOUR DESIGN
            </label>
          </div>
        </div>
      </main>

      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`toast toast-${toast.type}`}
          tabIndex={-1}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

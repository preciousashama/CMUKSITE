import { useEffect, useState } from 'react';
import { products } from '../data/products';
import { WishlistManager, initWishlistManager } from '../lib/wishlist-manager';
import { useCart } from '../lib/CartContext';



export default function ProductDetail() {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [placement, setPlacement] = useState('left');
  const [uploadedArtworkSrc, setUploadedArtworkSrc] = useState('');
  const [toast, setToast] = useState(null);


  // Get product id from URL query param (client-side)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const productId = idParam ? parseInt(idParam) : null;

    if (!productId) {
      setProduct(null);
      return;
    }

    // Assume products is imported or global
    const foundProduct = products.find(p => p.id === productId);
    if (!foundProduct) {
      setProduct(null);
      return;
    }

    setProduct(foundProduct);
    setSelectedColor(foundProduct.colors?.[0] || 'Black');

    // Initialize size quantities based on sizes
    const isBag = foundProduct.category?.toLowerCase().includes('bag');
    const sizes = isBag ? ['One Size'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const initialQuantities = {};
    sizes.forEach(size => (initialQuantities[size] = 0));
    setSizeQuantities(initialQuantities);

    document.title = `My Shop - ${foundProduct.name}`;
  }, []);

  if (product === null) {
    return <p>Product not found.</p>;
  }

  const isBag = product.category?.toLowerCase().includes('bag');
  const sizes = isBag ? ['One Size'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = product.colors || ['Black', 'White', 'Red', 'Blue'];
  const placements = ['left', 'right', 'centre', 'bottom right', 'bottom left'];

  function formatPrice(price) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
  }

  // Calculate subtotal
  const totalQuantity = Object.values(sizeQuantities).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  const subtotal = totalQuantity * product.price;

  // Toast helper
  function showToast(message, type = 'default') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Handle quantity change
  function onQuantityChange(size, value) {
    const val = Math.max(0, Number(value) || 0);
    setSizeQuantities(prev => ({ ...prev, [size]: val }));
  }

  // Handle add to cart
  function handleAddToCart() {
  if (totalQuantity === 0) {
    showToast('Please select at least one size and quantity', 'error');
    return;
  }
  Object.entries(sizeQuantities).forEach(([size, quantity]) => {
    if (quantity > 0) {
      addToCart(product, quantity, { color: selectedColor, size });
    }
  });
  showToast(`${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'} added to bag`, 'success');
}



  // Handle wishlist toggle
  function toggleWishlist() {
    if (WishlistManager.isInWishlist(product.id)) {
      WishlistManager.removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      WishlistManager.addToWishlist(product.id);
      showToast('Added to wishlist', 'success');
    }
  }

  // Handle file upload for design
  function handleDesignUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      setUploadedArtworkSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Update placement class for uploaded artwork (not used here but could be a classname)
  // Just store placement value for reference
  function handlePlacementChange(e) {
    setPlacement(e.target.value);
  }

  return (
    <>
      <main>
        <div>
          <a href="products.html">&larr; Back to Products</a>
        </div>

        <div>
          <div>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto' }} />
            {uploadedArtworkSrc && (
              <img
                src={uploadedArtworkSrc}
                alt="Uploaded Design"
                style={{
                  position: 'absolute',
                  maxWidth: '40%',
                  pointerEvents: 'none',
                  // You can style based on placement if needed
                }}
                className={placement.replace(/\s+/g, '-')}
              />
            )}
            {!uploadedArtworkSrc && (
              <div>
                <p>Your design will appear here</p>
              </div>
            )}
          </div>

          <div>
            <h1>{product.name}</h1>
            <p>{formatPrice(product.price)}</p>

            <div>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Color Options */}
            <div>
              <h3>1. SELECT COLOR</h3>
              <div>
                {colors.map((color, index) => (
                  <label key={color}>
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>

            {/* Size & Quantity */}
            <div>
              <h3>2. SELECT SIZE & QUANTITY</h3>
              <div>
                {sizes.map(size => (
                  <div key={size}>
                    <span>{size}</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={sizeQuantities[size] || 0}
                      onChange={e => onQuantityChange(size, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Options */}
            <div>
              <h3>3. SELECT PLACEMENT</h3>
              <div>
                {placements.map(pos => (
                  <label key={pos}>
                    <input
                      type="radio"
                      name="placement"
                      value={pos}
                      checked={placement === pos}
                      onChange={handlePlacementChange}
                    />
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div>
              <div>
                <span>Unit Price:</span> <span>{formatPrice(product.price)}</span>
              </div>
              <div>
                <span>Sub-Total:</span> <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button
                disabled={totalQuantity === 0}
                onClick={handleAddToCart}
              >
                ADD TO BAG
              </button>

              <div>
                <input
                  type="file"
                  id="design-upload"
                  name="design_upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleDesignUpload}
                />
                <label htmlFor="design-upload" style={{ cursor: 'pointer' }}>
                  UPLOAD YOUR DESIGN
                </label>
              </div>

              <button onClick={toggleWishlist}>
                {WishlistManager.isInWishlist(product.id)
                  ? 'REMOVE FROM WISHLIST'
                  : 'ADD TO WISHLIST'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div role="alert" aria-live="assertive">
          {toast.message}
        </div>
      )}
    </>
  );
}

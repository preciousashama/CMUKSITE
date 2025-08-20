// pages/gallery.js
import { useEffect, useState, useRef } from 'react';

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", description: "Beautiful mountain landscape with a lake" },
  // ... (other items) ...
  { src: "https://images.unsplash.com/photo-1498855926480-d98e83099315", description: "Waterfall in lush green forest" },
];

export default function GalleryPage() {
  const cols = Array.from({ length: 4 }, () => useRef(null));
  const modalRef = useRef();
  const modalImgRef = useRef();
  const modalDescRef = useRef();

  const [imagesByCol, setImagesByCol] = useState([]);
  
  useEffect(() => {
    // shuffle & distribute
    const shuffled = [...galleryImages].sort(() => Math.random() - 0.5);
    const totalCols = 4;
    const newCols = Array(totalCols).fill().map((_, i) => {
      const chunkSize = Math.floor(shuffled.length / totalCols);
      const slice = shuffled.slice(i * chunkSize, i === totalCols - 1 ? undefined : (i + 1) * chunkSize);
      return [...slice, ...slice];
    });
    setImagesByCol(newCols);
  }, []);

  useEffect(() => {
    // adjust heights if you need, but omitted (no CSS)
  }, [imagesByCol]);

  const openModal = (src, desc) => {
    modalImgRef.current.src = src;
    modalDescRef.current.textContent = desc;
    modalRef.current.style.display = 'flex';
  };

  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  return (
    <div className="gallery-page">
      <div style={{ display: 'flex' }}>
        {imagesByCol.map((colImgs, idx) => (
          <div key={idx} ref={cols[idx]}>
            {colImgs.map((img, i2) => (
              <div className="gallery-item" key={i2}>
                <img
                  src={img.src}
                  alt={img.description}
                  loading="lazy"
                  onClick={() => openModal(img.src, img.description)}
                />
                <div className="description">{img.description}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        ref={modalRef}
        className="modal"
        style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        onClick={(e) => { if (e.target === modalRef.current) closeModal(); }}
      >
        <span onClick={closeModal} style={{ cursor: 'pointer' }}>×</span>
        <img ref={modalImgRef} alt="modal" />
        <div ref={modalDescRef}></div>
      </div>
    </div>
  );
}

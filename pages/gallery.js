// pages/gallery.js
import { useEffect, useState, useRef } from 'react';

const galleryImages = [
  { src: "/assets/gallery/all.png", description: "Beautiful mountain landscape with a lake" },
  { src: "assets/gallery/bags.png", description: "Sunset over the beach" },
  { src: "/assets/gallery/hq720.png", description: "City skyline at night" },
  { src: "/assets/gallery/me.png", description: "Snowy forest path" },
  { src: "/assets/gallery/hq720.png", description: "Desert dunes under blue sky" },
  { src: "/assets/gallery/Knorr1-20230217123753391.png", description: "Waterfall in lush green forest" },
  { src: "/assets/gallery/party.png", description: "Close-up of vibrant flower" },
  { src: "/assets/gallery/me.png", description: "Calm lake with reflection" },
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
    const chunkSize = Math.floor(shuffled.length / totalCols);
    const newCols = Array(totalCols).fill().map((_, i) => {
      return shuffled.slice(i * chunkSize, i === totalCols - 1 ? undefined : (i + 1) * chunkSize);
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
        style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#fff', padding: '20px' }}
        onClick={(e) => { if (e.target === modalRef.current) closeModal(); }}
      >
        <span onClick={closeModal} style={{ cursor: 'pointer', fontSize: '2rem', alignSelf: 'flex-end' }}>×</span>
        <img ref={modalImgRef} alt="modal" style={{ maxHeight: '80%', maxWidth: '80%', marginBottom: '1rem' }} />
        <div ref={modalDescRef} style={{ fontSize: '1.2rem', textAlign: 'center' }}></div>
      </div>
    </div>

    
  );
}

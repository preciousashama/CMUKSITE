"use client";

import React, { useState } from 'react';
import ThreeCanvas from '@/components/ThreeCanvas';
import StudioControls from '@/components/StudioControls';

// Note: Import the studio-specific styles we added to designservice.css
import "../styles/designservice.css";

export default function StudioPage() {
  // State to hold the current configuration of the garment
  const [garmentConfig, setGarmentConfig] = useState({
    color: "#ffffff",
    texture: "HEAVY_COTTON",
    label: "ARCHIVE_SERIES_01"
  });

  const handleColorChange = (newColor: string) => {
    setGarmentConfig((prev) => ({ ...prev, color: newColor }));
  };

  const handleTextureChange = (newTexture: string) => {
    setGarmentConfig((prev) => ({ ...prev, texture: newTexture }));
  };

  return (
    <div className="studio-wrapper">
      {/* 1. THE 3D VIEWPORT */}
      <section className="canvas-container">
        {/* Technical Metadata Overlay */}
        <div className="studio-overlay-text">
          <p>SYSTEM_STATUS: OPERATIONAL</p>
          <p>VIEWPORT: 3D_RENDER_ENGINE</p>
          <p>OBJECT_REF: CMUK_TEE_V1</p>
        </div>

        {/* We pass the color state into the Canvas */}
        <ThreeCanvas color={garmentConfig.color} />

        {/* Bottom Metadata */}
        <div className="studio-footer-meta">
          <span>COORDINATES: X-0.22 Y-1.44 Z-0.00</span>
          <span>FPS: 60.0</span>
        </div>
      </section>

      {/* 2. THE CONTROL PANEL */}
      <StudioControls 
        onColorChange={handleColorChange} 
        onTextureChange={handleTextureChange} 
      />
    </div>
  );
}
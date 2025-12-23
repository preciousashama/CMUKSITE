"use client";

import React, { useState } from 'react';


import { useCart } from '@/context/CartContext';

// Inside your StudioControls component:
const { addToCart } = useCart();

const handleSaveDesign = () => {
  addToCart({
    id: `CUSTOM-${Date.now()}`, // Unique ID for 3D designs
    name: "CUSTOM_ARCHIVE_TEE",
    price: 85.00,
    quantity: 1,
    imageUrl: "/assets/placeholder-tee.png",
    config: { color: activeColor, texture: activeTexture }
  });
  alert("DESIGN_SAVED_TO_ARCHIVE");
};

interface StudioControlsProps {
  onColorChange: (color: string) => void;
  onTextureChange: (texture: string) => void;
}

const StudioControls = ({ onColorChange, onTextureChange }: StudioControlsProps) => {
  const [activeTab, setActiveTab] = useState('COLOR');

  const COLORS = [
    { name: 'PHANTOM_BLACK', hex: '#000000' },
    { name: 'ARCHIVE_WHITE', hex: '#ffffff' },
    { name: 'CEMENT_GREY', hex: '#888888' },
    { name: 'INFRA_RED', hex: '#ff0000' },
  ];

  return (
    <aside className="studio-sidebar">
      {/* 1. Header Metadata */}
      <div className="sidebar-header">
        <span className="protocol-label">ST_PROTOCOL_V.01</span>
        <h2 className="brand-heading">CONFIGURATOR</h2>
      </div>

      {/* 2. Tab Navigation */}
      <div className="tab-switcher">
        {['COLOR', 'TEXTURE', 'SPEC'].map((tab) => (
          <button 
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="control-content">
        {activeTab === 'COLOR' && (
          <div className="control-group">
            <label>BASE_PIGMENT_SELECTION</label>
            <div className="color-grid">
              {COLORS.map((c) => (
                <div key={c.hex} className="color-item">
                  <button 
                    style={{ backgroundColor: c.hex, border: c.hex === '#ffffff' ? '1px solid #ddd' : 'none' }}
                    onClick={() => onColorChange(c.hex)}
                  />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'TEXTURE' && (
          <div className="control-group">
            <label>FABRIC_DENSITY</label>
            <div className="texture-list">
              <button onClick={() => onTextureChange('HEAVY_COTTON')}>240GSM_JERSEY</button>
              <button onClick={() => onTextureChange('VINTAGE_WASH')}>DISTRESSED_VINTAGE</button>
              <button onClick={() => onTextureChange('TECHNICAL')}>TECH_POLY_MESH</button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer Action */}
      <div className="sidebar-footer">
        <div className="price-readout">
          <span>EST_TOTAL</span>
          <strong>$85.00</strong>
        </div>
        <button className="primary-btn full-width">
          SAVE_TO_COLLECTION →
        </button>
      </div>
    </aside>
  );
};

export default StudioControls;
"use client";
import React, { useState } from 'react';
import ThreeCanvas from '@/components/ThreeCanvas';
import StudioControls from '@/components/StudioControls';
import { useCart } from '@/context/CartContext';
import "@/styles/designservice.css";

export default function StudioPage() {
  const { addToCart } = useCart();
  const [color, setColor] = useState("#ffffff");

  const handleSave = () => {
    addToCart({
      id: `CUSTOM-${Date.now()}`,
      name: "STUDIO_TEE_V1",
      price: 85,
      imageUrl: "/assets/placeholder.png",
      config: { color, texture: "COTTON" },
      quantity: 1
    });
    alert("DESIGN_ADDED_TO_COLLECTION");
  };

  return (
    <div className="studio-wrapper">
      <div className="canvas-container">
        <ThreeCanvas color={color} />
      </div>
      <StudioControls 
        onColorChange={setColor} 
        onSave={handleSave}
      />
    </div>
  );
}
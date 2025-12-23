"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';

// This is a placeholder for the actual 3D Model logic
function GarmentModel() {
  return (
    <mesh>
      {/* Before you have a .glb file, we use a Box as a placeholder */}
      <boxGeometry args={[1, 1.4, 0.3]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} />
    </mesh>
  );
}

const ThreeCanvas = () => {
  return (
    <div className="canvas-container" style={{ width: '100%', height: '100%', background: '#f8f8f8' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
        
        {/* Cinematic Lighting & Environment */}
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.2, blur: 2 }}>
            <GarmentModel />
          </Stage>
        </Suspense>

        {/* User Interaction Controls */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 2} 
          makeDefault
        />

        {/* Technical Grid Floor - matches the Archive aesthetic */}
        <gridHelper args={[10, 20, 0x000000, 0xdddddd]} position={[0, -0.7, 0]} />
        
        <ContactShadows position={[0, -0.7, 0]} opacity={0.4} scale={10} blur={2.5} far={1} />
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;
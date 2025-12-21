'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  useGLTF, 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  Decal, 
  useTexture,
  Float
} from '@react-three/drei';
import * as THREE from 'three';

function ShirtModel({ color, customLogo, decalPosition = [0, 0.04, 0.15], decalScale = 0.15 }) {
  // 1. Efficient loading with caching
  const { nodes, materials } = useGLTF('/models/tshirt.glb');
  
  // 2. Load the custom logo texture if provided
  const texture = customLogo ? useTexture(customLogo) : null;

  // 3. Smoothly update color without cloning on every frame
  useMemo(() => {
    if (materials.lambert1) { // Replace 'lambert1' with your model's actual material name
      materials.lambert1.color = new THREE.Color(color);
      materials.lambert1.roughness = 0.7; // Make it look more like fabric
    }
  }, [color, materials]);

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt.geometry} // Replace 'T_Shirt' with your node name
        material={materials.lambert1}
        dispose={null}
      >
        {/* 4. THE DECAL: This is how you put the design ON the shirt */}
        {texture && (
          <Decal
            position={decalPosition} // [x, y, z]
            rotation={[0, 0, 0]}
            scale={decalScale}
            map={texture}
            // Ensure decal doesn't "bleed" through to the back
            depthTest={true}
            depthWrite={false}
          />
        )}
      </mesh>
    </group>
  );
}

export default function ThreeCanvas({ color = "#ffffff", logoUrl = null }) {
  return (
    <div className="w-full h-[500px] bg-slate-50 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-200 shadow-inner">
      <Canvas
        shadows
        camera={{ position: [0, 0, 0.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }} // Required for saving screenshots of designs
      >
        <ambientLight intensity={0.5} />
        
        {/* Professional Environment Lighting */}
        <Environment preset="city" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <ShirtModel color={color} customLogo={logoUrl} />
        </Float>

        <ContactShadows 
          position={[0, -0.15, 0]} 
          opacity={0.4} 
          scale={2.5} 
          blur={2} 
          far={1} 
        />
        
        <OrbitControls 
          enableZoom={true} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
      
      {/* UI Overlay Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 pointer-events-none">
        ← Click & Drag to Rotate →
      </div>
    </div>
  );
}
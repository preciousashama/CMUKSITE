'use client';

import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  useGLTF, 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  Decal, 
  useTexture,
  Float,
  Center,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

// 1. Optimized Shirt Component
function Shirt({ color, logoUrl, decalProps }) {
  const { nodes, materials } = useGLTF('/models/tshirt.glb');
  const texture = logoUrl ? useTexture(logoUrl) : null;

  // Ref for the material to handle smooth color transitions via frame loop
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Apply high-fidelity settings to the user's uploaded logo
  useMemo(() => {
    if (texture) {
      texture.anisotropy = 16;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Smoothly transition shirt color using maath easing
  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, new THREE.Color(color), 0.25, delta);
  });

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.T_Shirt.geometry}
      material={materials.lambert1}
      material-roughness={1}
      dispose={null}
    >
      {texture && (
        <Decal
          position={decalProps.position}
          rotation={decalProps.rotation}
          scale={decalProps.scale}
          map={texture}
          polygonOffset
          polygonOffsetFactor={-1} // Ensures the logo stays "above" the shirt surface
        />
      )}
    </mesh>
  );
}

// 2. Premium Loading State
const SceneLoader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading_Studio...</p>
    </div>
  </Html>
);

export default function ThreeCanvas({ 
  color = "#ffffff", 
  logoUrl = null,
  decalProps = { position: [0, 0.04, 0.15], rotation: [0, 0, 0], scale: 0.15 } 
}) {
  return (
    <div className="relative w-full h-[600px] bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200">
      <Canvas
        shadows
        camera={{ position: [0, 0, 0.5], fov: 25 }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace 
        }}
        dpr={[1, 2]} // Performance: limits resolution on ultra-high-def screens
      >
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={<SceneLoader />}>
          <Environment preset="city" />
          <Center>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Shirt 
                color={color} 
                logoUrl={logoUrl} 
                decalProps={decalProps} 
              />
            </Float>
          </Center>
        </Suspense>

        <ContactShadows 
          position={[0, -0.25, 0]} 
          opacity={0.4} 
          scale={2} 
          blur={2} 
          far={1} 
        />
        
        <OrbitControls 
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={0.4}
          maxDistance={0.8}
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.8} 
        />
      </Canvas>

      {/* Brand Overlay */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Visualizer</p>
            <h3 className="text-xl font-black italic uppercase text-brand-dark">Studio v.1</h3>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-brand-dark text-white rounded-full text-[9px] font-black uppercase tracking-widest">
              360° View
            </div>
          </div>
      </div>
    </div>
  );
}
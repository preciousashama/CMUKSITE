'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  useGLTF, 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  Decal, 
  useTexture,
  Float,
  Center
} from '@react-three/drei';
import * as THREE from 'three';

// 1. Separate Model logic for cleaner Suspense handling
function Shirt({ color, logoUrl, decalProps }) {
  const { nodes, materials } = useGLTF('/models/tshirt.glb');
  const texture = logoUrl ? useTexture(logoUrl) : null;

  // Improve texture quality
  useMemo(() => {
    if (texture) {
      texture.anisotropy = 16;
      texture.encoding = THREE.sRGBEncoding;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Clone material to prevent global state pollution
  const shirtMaterial = useMemo(() => {
    const mat = materials.lambert1.clone();
    mat.color = new THREE.Color(color);
    mat.roughness = 0.8; 
    return mat;
  }, [color, materials]);

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.T_Shirt.geometry}
      material={shirtMaterial}
    >
      {texture && (
        <Decal
          position={decalProps.position}
          rotation={decalProps.rotation}
          scale={decalProps.scale}
          map={texture}
          // Use polygonOffset to prevent z-fighting (logo flickering)
          polygonOffset
          polygonOffsetFactor={-1}
        />
      )}
    </mesh>
  );
}

// 2. Loading Placeholder for UX stability
const SceneLoader = () => (
  <mesh rotation={[0, 0, 0]}>
    <boxGeometry args={[0.1, 0.1, 0.1]} />
    <meshStandardMaterial color="#cbd5e1" wireframe />
  </mesh>
);

export default function ThreeCanvas({ 
  color = "#ffffff", 
  logoUrl = null,
  decalProps = { position: [0, 0.04, 0.15], rotation: [0, 0, 0], scale: 0.15 } 
}) {
  return (
    <div className="relative w-full h-[600px] bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
      <Canvas
        shadows
        camera={{ position: [0, 0, 0.8], fov: 25 }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping 
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[2048, 2048]} castShadow />
        
        <Suspense fallback={<SceneLoader />}>
          <Environment preset="city" />
          <Center>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <Shirt 
                color={color} 
                logoUrl={logoUrl} 
                decalProps={decalProps} 
              />
            </Float>
          </Center>
        </Suspense>

        <ContactShadows 
          position={[0, -0.2, 0]} 
          opacity={0.25} 
          scale={2} 
          blur={1.5} 
          far={0.8} 
        />
        
        <OrbitControls 
          makeDefault
          enablePan={false}
          minDistance={0.5}
          maxDistance={1.2}
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.8} 
        />
      </Canvas>

      {/* Interactive Helper Overlay */}
      <div className="absolute top-6 right-6 flex flex-col gap-2">
         <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-900">
           3D Preview Mode
         </div>
      </div>
    </div>
  );
}
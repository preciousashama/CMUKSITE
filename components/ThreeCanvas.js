import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';


function Model({ color }) {
  const gltf = useLoader(GLTFLoader, '/models/tshirt.glb');
  const meshRef = useRef();

  // Apply color to the mesh material on every frame or when color changes
  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // Clone material so we don't overwrite original
        child.material = child.material.clone();
        child.material.color = new Color(color);
        child.material.needsUpdate = true;
      }
    });
  }, [gltf, color]);

  return <primitive ref={meshRef} object={gltf.scene} />;
}

export default function ThreeCanvas({ color }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 3], fov: 35 }}
      style={{ width: '100%', height: '400px' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <Model color={color} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

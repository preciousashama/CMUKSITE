import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, Color } from 'three';
import { OrbitControls, Environment } from '@react-three/drei';

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
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Model color={color} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Environment preset="studio" />
    </Canvas>
  );
}

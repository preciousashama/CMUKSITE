'use client';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Decal, OrbitControls, Center, AccumulativeShadows, RandomizedLight, useTexture } from '@react-three/drei';
import { Suspense } from 'react';

interface CanvasProps {
  color: string;
  logoUrl: string | null;
}

function Shirt({ color, logoUrl }: CanvasProps) {
  // Replace with your actual .glb path later
  const { nodes, materials } = useGLTF('/assets/models/shirt_baked.glb') as any;
  const texture = logoUrl ? useTexture(logoUrl) : null;

  return (
    <mesh castShadow geometry={nodes.T_Shirt_Male.geometry} material={materials.lambert1} material-color={color} dispose={null}>
      {texture && (
        <Decal 
          position={[0, 0.04, 0.15]} 
          rotation={[0, 0, 0]} 
          scale={0.15} 
          map={texture} 
        />
      )}
    </mesh>
  );
}

export default function DesignCanvas({ color, logoUrl }: CanvasProps) {
  return (
    <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 25 }} gl={{ preserveDrawingBuffer: true }} className="w-full h-full">
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Center>
          <Shirt color={color} logoUrl={logoUrl} />
        </Center>
      </Suspense>
      <OrbitControls makeDefault minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} />
    </Canvas>
  );
}
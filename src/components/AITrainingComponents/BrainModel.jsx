import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Brain = ({ knowledgeLevel }) => {
  const brainRef = useRef();
  const colorMap = new THREE.TextureLoader().load('/brain-texture.jpg');

  useFrame(() => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.005;
    }
  });

  useEffect(() => {
    if (brainRef.current) {
      const hue = (knowledgeLevel / 100) * 0.6; // 0.6 is blue, 0 is red
      brainRef.current.material.color.setHSL(hue, 1, 0.5);
    }
  }, [knowledgeLevel]);

  return (
    <mesh ref={brainRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
};

const BrainModel = ({ knowledgeLevel }) => {
  return (
    <div className="w-full h-64">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Brain knowledgeLevel={knowledgeLevel} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default BrainModel;
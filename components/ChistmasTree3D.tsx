import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Tree Trunk component
function TreeTrunk() {
  return (
    <mesh position={[0, -1, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
}

// Tree Layer component (cone for branches)
function TreeLayer({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[scale, 1, 8]} />
      <meshStandardMaterial color="#228B22" />
    </mesh>
  );
}

// Gift box component
function GiftBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#ff4444" />
    </mesh>
  );
}

// Snow particle
function SnowParticle({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [driftX, setDriftX] = useState((Math.random() - 0.5) * 0.02);
  const [driftZ, setDriftZ] = useState((Math.random() - 0.5) * 0.02);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y -= 0.02; // Faster fall
      meshRef.current.position.x += driftX;
      meshRef.current.position.z += driftZ;
      if (meshRef.current.position.y < -5) {
        meshRef.current.position.y = 5;
        meshRef.current.position.x = position[0];
        meshRef.current.position.z = position[2];
        setDriftX((Math.random() - 0.5) * 0.02);
        setDriftZ((Math.random() - 0.5) * 0.02);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 4, 4]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}

// Main Christmas Tree component
function ChristmasTree({ isDynamic }: { isDynamic: boolean }) {
  const treeRef = useRef<THREE.Group>(null);

  // Tree layers (cones stacked on top of each other)
  const treeLayers = useMemo(() => {
    const layers = [];
    for (let i = 0; i < 5; i++) {
      layers.push({
        position: [0, i * 0.8, 0] as [number, number, number],
        scale: 1.5 - i * 0.2
      });
    }
    return layers;
  }, []);

  // Gift boxes
  const giftBoxes = useMemo(() => {
    const boxes = [];
    for (let i = 0; i < 5; i++) {
      boxes.push({
        position: [
          (Math.random() - 0.5) * 6,
          Math.random() * 2,
          (Math.random() - 0.5) * 6
        ] as [number, number, number]
      });
    }
    return boxes;
  }, []);

  // Enhanced Snow particles
  const snowParticles = useMemo(() => {
    const snow = [];
    for (let i = 0; i < 200; i++) {
      snow.push({
        position: [
          (Math.random() - 0.5) * 15,
          Math.random() * 15,
          (Math.random() - 0.5) * 15
        ] as [number, number, number]
      });
    }
    return snow;
  }, []);

  useFrame((state) => {
    if (treeRef.current && isDynamic) {
      treeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={treeRef}>
      {/* Tree trunk */}
      <TreeTrunk />

      {/* Tree layers */}
      {treeLayers.map((layer, index) => (
        <TreeLayer key={index} position={layer.position} scale={layer.scale} />
      ))}

      {/* Gift boxes (only in dynamic state) */}
      {isDynamic && giftBoxes.map((box, index) => (
        <GiftBox key={index} position={box.position} />
      ))}

      {/* Snow particles */}
      {snowParticles.map((snow, index) => (
        <SnowParticle key={index} position={snow.position} />
      ))}

      {/* Christmas text */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#ff0000"
        anchorX="center"
        anchorY="middle"
      >
        Merry Christmas!
      </Text>
    </group>
  );
}

// Main component
export function ChristmasTree3D() {
  const [isDynamic, setIsDynamic] = useState(false);

  const handleKick = () => {
    setIsDynamic(true);
    setTimeout(() => setIsDynamic(false), 5000); // Reset after 5 seconds
  };

  return (
    <div className="w-full h-96 relative">
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ChristmasTree isDynamic={isDynamic} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
      <button
        onClick={handleKick}
        className="absolute bottom-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors"
      >
        Kick the Tree!
      </button>
    </div>
  );
}

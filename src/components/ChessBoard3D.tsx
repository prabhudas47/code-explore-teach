import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Single animated box tile
const Box = ({ 
  position, 
  baseHeight, 
  delay,
  mousePosition 
}: { 
  position: [number, number, number]; 
  baseHeight: number;
  delay: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Color variations for depth
  const color = useMemo(() => {
    const baseIntensity = 0.08 + Math.random() * 0.04;
    return new THREE.Color(baseIntensity, baseIntensity, baseIntensity + 0.01);
  }, []);
  
  const accentColor = useMemo(() => {
    return new THREE.Color(0.15, 0.1, 0.2);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Slow wave-like vertical movement
    const waveX = Math.sin(time * 0.3 + position[0] * 0.5 + delay) * 0.08;
    const waveZ = Math.cos(time * 0.25 + position[2] * 0.5 + delay) * 0.06;
    
    // Calculate distance from mouse for interaction
    const dx = (mousePosition.current.x * 10) - position[0];
    const dz = (mousePosition.current.y * -10) - position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    const mouseInfluence = Math.max(0, 1 - distance / 4) * 0.15;
    
    // Apply smooth vertical movement
    meshRef.current.position.y = baseHeight + waveX + waveZ + mouseInfluence;
    
    // Subtle scale on hover
    const targetScale = hovered ? 1.02 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale), 
      0.1
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], baseHeight, position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.9, baseHeight * 2 + 0.3, 0.9]} />
      <meshStandardMaterial
        color={hovered ? accentColor : color}
        roughness={0.7}
        metalness={0.1}
        envMapIntensity={0.3}
      />
    </mesh>
  );
};

// Grid of boxes
const BoxGrid = ({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) => {
  const gridSize = 12;
  const spacing = 1.1;
  
  const boxes = useMemo(() => {
    const items: { position: [number, number, number]; height: number; delay: number }[] = [];
    
    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let z = -gridSize / 2; z < gridSize / 2; z++) {
        // Height variation - creates the architectural depth
        const distFromCenter = Math.sqrt(x * x + z * z);
        const baseHeight = 0.1 + Math.random() * 0.15 + (distFromCenter * 0.02);
        const delay = (x + z) * 0.3;
        
        items.push({
          position: [x * spacing, 0, z * spacing],
          height: baseHeight,
          delay
        });
      }
    }
    
    return items;
  }, []);

  return (
    <group rotation={[-0.5, 0.3, 0]} position={[0, -2, -5]}>
      {boxes.map((box, i) => (
        <Box
          key={i}
          position={box.position}
          baseHeight={box.height}
          delay={box.delay}
          mousePosition={mousePosition}
        />
      ))}
    </group>
  );
};

// Camera controller for subtle parallax
const CameraController = ({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Subtle camera movement based on mouse
    const targetX = mousePosition.current.x * 0.5;
    const targetY = 3 + mousePosition.current.y * 0.3;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -5);
  });

  return null;
};

// Main 3D scene
const Scene = ({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) => {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.15} />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Soft fill light */}
      <directionalLight
        position={[-3, 5, -5]}
        intensity={0.15}
        color="#6366f1"
      />
      
      {/* Accent rim light */}
      <pointLight
        position={[0, 5, -10]}
        intensity={0.3}
        color="#8b5cf6"
        distance={20}
      />
      
      {/* Camera controller */}
      <CameraController mousePosition={mousePosition} />
      
      {/* Box grid */}
      <BoxGrid mousePosition={mousePosition} />
      
      {/* Ground plane for shadow receiving */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -3, -5]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
};

// Main component
export const ChessBoard3D = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mousePosition.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1
    };
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#08080c]" />
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Scene mousePosition={mousePosition} />
      </Canvas>
      
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      
      {/* Top fade for content readability */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0a0f]/80 to-transparent pointer-events-none" />
    </div>
  );
};

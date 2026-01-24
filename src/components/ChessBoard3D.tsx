import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Animated chess tile with advanced motion
const ChessTile = ({ 
  position, 
  size,
  delay,
  isLight,
  mousePosition 
}: { 
  position: [number, number, number]; 
  size: [number, number, number];
  delay: number;
  isLight: boolean;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  
  // Premium color palette
  const darkColor = useMemo(() => new THREE.Color('#0c0c14'), []);
  const lightColor = useMemo(() => new THREE.Color('#16161f'), []);
  const accentColor = useMemo(() => new THREE.Color('#6366f1'), []);
  const glowColor = useMemo(() => new THREE.Color('#8b5cf6'), []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Complex wave pattern - multiple frequencies for organic feel
    const wave1 = Math.sin(time * 0.4 + position[0] * 0.3 + position[2] * 0.2 + delay) * 0.12;
    const wave2 = Math.cos(time * 0.25 + position[0] * 0.15 - position[2] * 0.25) * 0.08;
    const wave3 = Math.sin(time * 0.6 + (position[0] + position[2]) * 0.1) * 0.04;
    
    // Mouse interaction - ripple effect
    const dx = (mousePosition.current.x * 8) - position[0];
    const dz = (mousePosition.current.y * -8) - position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    const mouseWave = Math.sin(time * 2 - distance * 0.5) * Math.max(0, 1 - distance / 6) * 0.1;
    
    // Final Y position with smooth easing
    const targetY = position[1] + wave1 + wave2 + wave3 + mouseWave;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;
    
    // Subtle rotation based on waves
    meshRef.current.rotation.x = wave1 * 0.15;
    meshRef.current.rotation.z = wave2 * 0.1;
    
    // Dynamic hover effect
    const hoverScale = hovered ? 1.08 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);
    
    // Color transitions
    const baseColor = isLight ? lightColor : darkColor;
    const targetColor = hovered ? accentColor : baseColor;
    materialRef.current.color.lerp(targetColor, 0.1);
    
    // Emissive glow on hover and proximity
    const proximityGlow = Math.max(0, 1 - distance / 5) * 0.02;
    const hoverGlow = hovered ? 0.15 : 0;
    materialRef.current.emissive.lerp(glowColor, 0.1);
    materialRef.current.emissiveIntensity += ((proximityGlow + hoverGlow) - materialRef.current.emissiveIntensity) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        ref={materialRef}
        color={isLight ? lightColor : darkColor}
        roughness={0.6}
        metalness={0.2}
        envMapIntensity={0.5}
        emissive={glowColor}
        emissiveIntensity={0}
      />
    </mesh>
  );
};

// Enhanced chess grid with staggered pattern
const ChessGrid = ({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) => {
  const gridRef = useRef<THREE.Group>(null);
  const gridSize = 10;
  const tileSize = 0.95;
  const gap = 0.1;
  
  const tiles = useMemo(() => {
    const items: { 
      position: [number, number, number]; 
      size: [number, number, number];
      delay: number;
      isLight: boolean;
    }[] = [];
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const isLight = (x + z) % 2 === 0;
        const centerOffset = gridSize / 2 - 0.5;
        
        // Height variation based on distance from center
        const distFromCenter = Math.sqrt(
          Math.pow(x - gridSize / 2, 2) + Math.pow(z - gridSize / 2, 2)
        );
        const heightVariation = 0.15 + Math.random() * 0.1 + distFromCenter * 0.02;
        
        items.push({
          position: [
            (x - centerOffset) * (tileSize + gap),
            0,
            (z - centerOffset) * (tileSize + gap)
          ],
          size: [tileSize, heightVariation, tileSize],
          delay: (x + z) * 0.2 + Math.random() * 0.5,
          isLight
        });
      }
    }
    
    return items;
  }, []);

  useFrame((state) => {
    if (!gridRef.current) return;
    // Slow rotation of entire grid
    gridRef.current.rotation.y += 0.0003;
  });

  return (
    <group ref={gridRef} rotation={[-0.6, 0.4, 0]} position={[0, -1.5, -8]}>
      {tiles.map((tile, i) => (
        <ChessTile
          key={i}
          position={tile.position}
          size={tile.size}
          delay={tile.delay}
          isLight={tile.isLight}
          mousePosition={mousePosition}
        />
      ))}
    </group>
  );
};

// Floating accent particles
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 50;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 10 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y += 0.0002;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#6366f1"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

// Camera with smooth parallax
const CameraController = ({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    const targetX = mousePosition.current.x * 1.5;
    const targetY = 4 + mousePosition.current.y * 0.8;
    
    camera.position.x += (targetX - camera.position.x) * 0.015;
    camera.position.y += (targetY - camera.position.y) * 0.015;
    camera.lookAt(0, 0, -8);
  });

  return null;
};

// Main scene with enhanced lighting
const Scene = ({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) => {
  return (
    <>
      {/* Ambient base */}
      <ambientLight intensity={0.1} />
      
      {/* Primary key light */}
      <directionalLight
        position={[8, 12, 5]}
        intensity={0.35}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        color="#ffffff"
      />
      
      {/* Fill light with accent color */}
      <directionalLight
        position={[-5, 8, -8]}
        intensity={0.2}
        color="#6366f1"
      />
      
      {/* Rim light */}
      <pointLight
        position={[0, 6, -15]}
        intensity={0.4}
        color="#8b5cf6"
        distance={25}
      />
      
      {/* Bottom glow */}
      <pointLight
        position={[0, -5, -8]}
        intensity={0.15}
        color="#4f46e5"
        distance={20}
      />
      
      <CameraController mousePosition={mousePosition} />
      <ChessGrid mousePosition={mousePosition} />
      <FloatingParticles />
      
      {/* Ground shadow plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -3, -8]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </>
  );
};

// Main component
export const ChessBoard3D = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mousePosition.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Premium dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#0d0815]" />
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 4, 10], fov: 55 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#06060a', 15, 35]} />
        <Scene mousePosition={mousePosition} />
      </Canvas>
      
      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      
      {/* Top gradient for content */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#06060a]/90 via-[#06060a]/50 to-transparent pointer-events-none" />
      
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06060a]/80 to-transparent pointer-events-none" />
    </div>
  );
};

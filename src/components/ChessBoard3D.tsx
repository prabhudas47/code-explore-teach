import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Individual chess tile with advanced wave animation
const ChessTile = ({ 
  position, 
  baseHeight,
  delay,
  colorIndex,
  mousePosition,
  time
}: { 
  position: [number, number, number]; 
  baseHeight: number;
  delay: number;
  colorIndex: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  time: React.MutableRefObject<number>;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Premium color palette - 4 shades for variation
  const colors = useMemo(() => [
    new THREE.Color('#0d0d16'),
    new THREE.Color('#111119'),
    new THREE.Color('#15151f'),
    new THREE.Color('#191925'),
  ], []);
  
  const accentColor = useMemo(() => new THREE.Color('#6366f1'), []);
  const highlightColor = useMemo(() => new THREE.Color('#818cf8'), []);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    
    const t = time.current;
    const [px, , pz] = position;
    
    // Complex wave system - architectural breathing
    const wave1 = Math.sin(t * 0.3 + px * 0.25 + pz * 0.2 + delay) * 0.15;
    const wave2 = Math.cos(t * 0.2 + px * 0.15 - pz * 0.18 + delay * 0.5) * 0.1;
    const wave3 = Math.sin(t * 0.15 + (px + pz) * 0.08) * 0.08;
    const depthBreath = Math.sin(t * 0.12) * 0.05;
    
    // Mouse proximity influence - controlled ripple
    const mx = mousePosition.current.x * 12;
    const mz = mousePosition.current.y * -10;
    const dx = mx - px;
    const dz = mz - pz;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const influence = Math.max(0, 1 - distance / 8);
    const mouseWave = Math.sin(t * 1.5 - distance * 0.4) * influence * 0.2;
    
    // Final position with smooth interpolation
    const targetY = wave1 + wave2 + wave3 + depthBreath + mouseWave;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.06;
    
    // Subtle rotation for organic feel
    meshRef.current.rotation.x = (wave1 * 0.08 + mouseWave * 0.1);
    meshRef.current.rotation.z = (wave2 * 0.06);
    
    // Height scaling based on proximity
    const heightScale = 1 + influence * 0.4;
    meshRef.current.scale.y += (heightScale - meshRef.current.scale.y) * 0.08;
    
    // Color and glow based on proximity
    const baseColor = colors[colorIndex];
    const targetColor = influence > 0.3 ? highlightColor : baseColor;
    materialRef.current.color.lerp(targetColor, 0.04);
    
    // Emissive intensity
    const targetEmissive = influence * 0.25 + Math.sin(t * 0.5 + delay) * 0.02;
    materialRef.current.emissiveIntensity += (targetEmissive - materialRef.current.emissiveIntensity) * 0.08;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.88, baseHeight, 0.88]} />
      <meshStandardMaterial
        ref={materialRef}
        color={colors[colorIndex]}
        roughness={0.7}
        metalness={0.15}
        envMapIntensity={0.4}
        emissive={accentColor}
        emissiveIntensity={0}
      />
    </mesh>
  );
};

// Main chess grid with extended depth
const ChessGrid = ({ mousePosition, time }: { 
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  time: React.MutableRefObject<number>;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Extended grid for depth perception
  const gridX = 16;
  const gridZ = 20;
  const spacing = 1.0;
  
  const tiles = useMemo(() => {
    const items: {
      position: [number, number, number];
      baseHeight: number;
      delay: number;
      colorIndex: number;
    }[] = [];
    
    const centerX = (gridX - 1) / 2;
    const centerZ = (gridZ - 1) / 2;
    
    for (let x = 0; x < gridX; x++) {
      for (let z = 0; z < gridZ; z++) {
        // Distance-based height variation
        const distFromCenter = Math.sqrt(
          Math.pow((x - centerX) / centerX, 2) + 
          Math.pow((z - centerZ) / centerZ, 2)
        );
        
        // Height increases toward edges for bowl effect
        const baseHeight = 0.15 + distFromCenter * 0.12 + Math.random() * 0.08;
        
        // 4-color pattern for visual depth
        const colorIndex = ((x % 2) + (z % 2) * 2) % 4;
        
        items.push({
          position: [
            (x - centerX) * spacing,
            0,
            (z - centerZ) * spacing
          ],
          baseHeight,
          delay: x * 0.15 + z * 0.1 + Math.random() * 0.3,
          colorIndex
        });
      }
    }
    
    return items;
  }, []);

  // Slow grid rotation
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0002;
  });

  return (
    <group 
      ref={groupRef} 
      rotation={[-0.55, 0.25, 0]} 
      position={[0, -2, -12]}
    >
      {tiles.map((tile, i) => (
        <ChessTile
          key={i}
          position={tile.position}
          baseHeight={tile.baseHeight}
          delay={tile.delay}
          colorIndex={tile.colorIndex}
          mousePosition={mousePosition}
          time={time}
        />
      ))}
    </group>
  );
};

// Atmospheric light rays
const LightRays = ({ time }: { time: React.MutableRefObject<number> }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const rays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [(i - 2) * 4, 8, -15] as [number, number, number],
      delay: i * 0.4,
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      const pulse = Math.sin(time.current * 0.3 + rays[i].delay) * 0.5 + 0.5;
      material.opacity = 0.02 + pulse * 0.03;
    });
  });

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh key={i} position={ray.position} rotation={[0.3, 0, 0.1 * (i - 2)]}>
          <planeGeometry args={[0.5, 25]} />
          <meshBasicMaterial 
            color="#6366f1" 
            transparent 
            opacity={0.03}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating ambient particles
const AmbientParticles = ({ time }: { time: React.MutableRefObject<number> }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 80;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 15 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.sin(time.current * 0.2 + i) * 0.001;
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Wrap around bounds
      if (Math.abs(posArray[i * 3]) > 15) velocities[i * 3] *= -1;
      if (posArray[i * 3 + 1] > 10 || posArray[i * 3 + 1] < -5) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArray[i * 3 + 2] + 10) > 15) velocities[i * 3 + 2] *= -1;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#8b5cf6"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Camera with smooth parallax movement
const CameraController = ({ mousePosition }: { 
  mousePosition: React.MutableRefObject<{ x: number; y: number }> 
}) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 5, 12));
  
  useFrame(() => {
    // Smooth parallax based on mouse
    targetPos.current.x = mousePosition.current.x * 2;
    targetPos.current.y = 5 + mousePosition.current.y * 1;
    
    camera.position.lerp(targetPos.current, 0.015);
    camera.lookAt(0, -1, -8);
  });

  return null;
};

// Complete scene with premium lighting
const Scene = ({ mousePosition, time }: { 
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  time: React.MutableRefObject<number>;
}) => {
  return (
    <>
      {/* Deep ambient base */}
      <ambientLight intensity={0.08} color="#1a1a2e" />
      
      {/* Primary key light - warm white */}
      <directionalLight
        position={[10, 15, 8]}
        intensity={0.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      
      {/* Secondary fill light - violet accent */}
      <directionalLight
        position={[-8, 10, -10]}
        intensity={0.15}
        color="#6366f1"
      />
      
      {/* Backlight for rim effect */}
      <spotLight
        position={[0, 12, -25]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.4}
        color="#8b5cf6"
        distance={50}
      />
      
      {/* Ground reflection light */}
      <pointLight
        position={[0, -8, -10]}
        intensity={0.1}
        color="#4f46e5"
        distance={30}
      />
      
      {/* Accent lights on sides */}
      <pointLight position={[-12, 3, -8]} intensity={0.12} color="#6366f1" distance={20} />
      <pointLight position={[12, 3, -8]} intensity={0.12} color="#8b5cf6" distance={20} />
      
      <CameraController mousePosition={mousePosition} />
      <ChessGrid mousePosition={mousePosition} time={time} />
      <LightRays time={time} />
      <AmbientParticles time={time} />
      
      {/* Shadow ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -4, -12]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </>
  );
};

// Main exported component
export const ChessBoard3D = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Smooth time accumulator
  useEffect(() => {
    const animate = () => {
      time.current += 0.016; // ~60fps
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Smooth interpolation
    mousePosition.current.x += (x - mousePosition.current.x) * 0.1;
    mousePosition.current.y += (y - mousePosition.current.y) * 0.1;
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04040a] via-[#08081a] to-[#0c0c1a]" />
      
      {/* Radial depth gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#04040a', 18, 45]} />
        <Scene mousePosition={mousePosition} time={time} />
      </Canvas>
      
      {/* Atmospheric vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,4,10,0.6)_100%)]" />
      
      {/* Top fade for navigation */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#04040a] via-[#04040a]/70 to-transparent pointer-events-none" />
      
      {/* Bottom fade for grounding */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04040a] via-[#04040a]/50 to-transparent pointer-events-none" />
      
      {/* Side vignettes for depth */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#04040a]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#04040a]/80 to-transparent pointer-events-none" />
    </div>
  );
};

import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Individual chess tile with architectural wave animation
const ChessTile = ({ 
  position, 
  baseHeight,
  delay,
  colorVariant,
  mousePosition,
  time
}: { 
  position: [number, number, number]; 
  baseHeight: number;
  delay: number;
  colorVariant: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  time: React.MutableRefObject<number>;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Premium 4-shade palette - architectural depth
  const colors = useMemo(() => [
    new THREE.Color('#08080f'),
    new THREE.Color('#0c0c15'),
    new THREE.Color('#10101c'),
    new THREE.Color('#141422'),
  ], []);
  
  const accentColor = useMemo(() => new THREE.Color('#6366f1'), []);
  const activeColor = useMemo(() => new THREE.Color('#a5b4fc'), []);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    
    const t = time.current;
    const [px, , pz] = position;
    
    // Multi-frequency architectural wave system
    const primaryWave = Math.sin(t * 0.25 + px * 0.2 + pz * 0.15 + delay) * 0.18;
    const secondaryWave = Math.cos(t * 0.18 + px * 0.12 - pz * 0.14 + delay * 0.6) * 0.12;
    const tertiaryWave = Math.sin(t * 0.1 + (px + pz) * 0.06) * 0.08;
    const depthPulse = Math.sin(t * 0.08) * 0.04;
    
    // Controlled mouse proximity ripple
    const mx = mousePosition.current.x * 14;
    const mz = mousePosition.current.y * -12;
    const dx = mx - px;
    const dz = mz - pz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const proximity = Math.max(0, 1 - dist / 6);
    const mouseRipple = Math.sin(t * 1.8 - dist * 0.5) * proximity * 0.25;
    
    // Smooth position interpolation
    const targetY = primaryWave + secondaryWave + tertiaryWave + depthPulse + mouseRipple;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    
    // Subtle architectural rotation
    meshRef.current.rotation.x = (primaryWave * 0.06 + mouseRipple * 0.12);
    meshRef.current.rotation.z = (secondaryWave * 0.04);
    
    // Dynamic height scaling on proximity
    const scaleY = 1 + proximity * 0.6;
    meshRef.current.scale.y += (scaleY - meshRef.current.scale.y) * 0.06;
    
    // Smooth color transitions
    const baseCol = colors[colorVariant];
    const targetCol = proximity > 0.4 ? activeColor : baseCol;
    materialRef.current.color.lerp(targetCol, 0.03);
    
    // Emissive glow based on proximity
    const emissiveTarget = proximity * 0.35 + Math.sin(t * 0.4 + delay) * 0.015;
    materialRef.current.emissiveIntensity += (emissiveTarget - materialRef.current.emissiveIntensity) * 0.06;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.9, baseHeight, 0.9]} />
      <meshStandardMaterial
        ref={materialRef}
        color={colors[colorVariant]}
        roughness={0.75}
        metalness={0.08}
        envMapIntensity={0.3}
        emissive={accentColor}
        emissiveIntensity={0}
      />
    </mesh>
  );
};

// Extended architectural chess grid
const ChessGrid = ({ mousePosition, time }: { 
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  time: React.MutableRefObject<number>;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Extended grid for dramatic depth
  const gridX = 18;
  const gridZ = 24;
  const spacing = 1.02;
  
  const tiles = useMemo(() => {
    const items: {
      position: [number, number, number];
      baseHeight: number;
      delay: number;
      colorVariant: number;
    }[] = [];
    
    const centerX = (gridX - 1) / 2;
    const centerZ = (gridZ - 1) / 2;
    
    for (let x = 0; x < gridX; x++) {
      for (let z = 0; z < gridZ; z++) {
        // Distance-based terrain height
        const distFromCenter = Math.sqrt(
          Math.pow((x - centerX) / centerX, 2) + 
          Math.pow((z - centerZ) / centerZ, 2)
        );
        
        // Bowl effect with random variation
        const baseHeight = 0.12 + distFromCenter * 0.15 + Math.random() * 0.06;
        
        // 4-color chess pattern for depth perception
        const colorVariant = ((x % 2) + (z % 2) * 2) % 4;
        
        items.push({
          position: [
            (x - centerX) * spacing,
            0,
            (z - centerZ) * spacing
          ],
          baseHeight,
          delay: x * 0.12 + z * 0.08 + Math.random() * 0.2,
          colorVariant
        });
      }
    }
    
    return items;
  }, []);

  // Very slow grid drift
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.00015;
  });

  return (
    <group 
      ref={groupRef} 
      rotation={[-0.6, 0.2, 0]} 
      position={[0, -3, -14]}
    >
      {tiles.map((tile, i) => (
        <ChessTile
          key={i}
          position={tile.position}
          baseHeight={tile.baseHeight}
          delay={tile.delay}
          colorVariant={tile.colorVariant}
          mousePosition={mousePosition}
          time={time}
        />
      ))}
    </group>
  );
};

// Atmospheric volumetric light rays
const VolumetricRays = ({ time }: { time: React.MutableRefObject<number> }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const rays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      position: [(i - 3) * 3.5, 10, -18] as [number, number, number],
      delay: i * 0.5,
      width: 0.3 + Math.random() * 0.2,
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      const pulse = Math.sin(time.current * 0.2 + rays[i].delay) * 0.5 + 0.5;
      material.opacity = 0.015 + pulse * 0.025;
    });
  });

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh key={i} position={ray.position} rotation={[0.25, 0, 0.08 * (i - 3)]}>
          <planeGeometry args={[ray.width, 30]} />
          <meshBasicMaterial 
            color="#6366f1" 
            transparent 
            opacity={0.02}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating ambient dust particles
const AmbientDust = ({ time }: { time: React.MutableRefObject<number> }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 20 - 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 12;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.0015;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0015;
    }
    
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.sin(time.current * 0.15 + i) * 0.0008;
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Boundary wrap
      if (Math.abs(posArray[i * 3]) > 20) velocities[i * 3] *= -1;
      if (posArray[i * 3 + 1] > 12 || posArray[i * 3 + 1] < -8) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArray[i * 3 + 2] + 12) > 20) velocities[i * 3 + 2] *= -1;
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
        size={0.035}
        color="#8b5cf6"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Smooth parallax camera controller
const CameraController = ({ mousePosition }: { 
  mousePosition: React.MutableRefObject<{ x: number; y: number }> 
}) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 6, 14));
  
  useFrame(() => {
    // Smooth mouse-driven parallax
    targetPos.current.x = mousePosition.current.x * 2.5;
    targetPos.current.y = 6 + mousePosition.current.y * 1.2;
    
    camera.position.lerp(targetPos.current, 0.012);
    camera.lookAt(0, -2, -10);
  });

  return null;
};

// Complete scene with premium 5-point lighting
const Scene = ({ mousePosition, time }: { 
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  time: React.MutableRefObject<number>;
}) => {
  return (
    <>
      {/* Deep ambient base */}
      <ambientLight intensity={0.06} color="#0a0a1a" />
      
      {/* Key light - primary illumination */}
      <directionalLight
        position={[12, 18, 10]}
        intensity={0.25}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={70}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      
      {/* Fill light - violet accent */}
      <directionalLight
        position={[-10, 12, -12]}
        intensity={0.12}
        color="#6366f1"
      />
      
      {/* Rim light - back separation */}
      <spotLight
        position={[0, 15, -30]}
        angle={0.35}
        penumbra={0.9}
        intensity={0.35}
        color="#8b5cf6"
        distance={60}
      />
      
      {/* Ground bounce */}
      <pointLight
        position={[0, -10, -12]}
        intensity={0.08}
        color="#4f46e5"
        distance={35}
      />
      
      {/* Side accents */}
      <pointLight position={[-15, 4, -10]} intensity={0.1} color="#6366f1" distance={25} />
      <pointLight position={[15, 4, -10]} intensity={0.1} color="#8b5cf6" distance={25} />
      
      <CameraController mousePosition={mousePosition} />
      <ChessGrid mousePosition={mousePosition} time={time} />
      <VolumetricRays time={time} />
      <AmbientDust time={time} />
      
      {/* Shadow receiving ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -5, -14]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.6} />
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
      time.current += 0.016;
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
    mousePosition.current.x += (x - mousePosition.current.x) * 0.08;
    mousePosition.current.y += (y - mousePosition.current.y) * 0.08;
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Deep space gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(240,30%,5%)] to-background" />
      
      {/* Radial depth glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-15%,hsl(var(--primary)/0.06),transparent)]" />
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 6, 14], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#04040a', 20, 50]} />
        <Scene mousePosition={mousePosition} time={time} />
      </Canvas>
      
      {/* Atmospheric vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.7)_100%)]" />
      
      {/* Top fade for navigation */}
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Bottom fade for grounding */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
      
      {/* Side vignettes */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background/90 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background/90 to-transparent pointer-events-none" />
    </div>
  );
};

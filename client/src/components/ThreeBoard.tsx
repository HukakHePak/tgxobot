import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

type Square = 'X' | 'O' | null;

interface ThreeBoardProps {
  squares: Square[];
  onClick: (index: number) => void;
  disabled?: boolean;
}

function Cell({ idx, value, position, onClick, disabled }: any) {
  const mesh = useRef<THREE.Mesh>(null!);
  const hover = useRef(false);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.rotation.y += 0.002;
    mesh.current.scale.x += (hover.current ? 0.01 : (1 - mesh.current.scale.x) * 0.1);
    mesh.current.scale.y = mesh.current.scale.x;
    mesh.current.scale.z = mesh.current.scale.x;
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (!disabled) onClick(idx);
        }}
      >
        <boxGeometry args={[2.8, 0.4, 2.8]} />
        <meshStandardMaterial metalness={0.8} roughness={0.2} color={value ? '#111827' : '#0b1220'} emissive={value ? '#001f3f' : '#021428'} />
      </mesh>

      {/* X / O markers */}
      {value === 'X' && (
        <group rotation={[0, Math.PI / 4, 0]}>
          <mesh position={[0, 0.6, 0]}> 
            <boxGeometry args={[2.2, 0.2, 0.4]} />
            <meshStandardMaterial metalness={1} roughness={0.15} color="#ffcc00" emissive="#442200" />
          </mesh>
          <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}> 
            <boxGeometry args={[2.2, 0.2, 0.4]} />
            <meshStandardMaterial metalness={1} roughness={0.15} color="#ffcc00" emissive="#442200" />
          </mesh>
        </group>
      )}
      {value === 'O' && (
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}> 
          <torusGeometry args={[0.9, 0.18, 16, 60]} />
          <meshStandardMaterial metalness={1} roughness={0.12} color="#66ccff" emissive="#113344" />
        </mesh>
      )}
    </group>
  );
}

export const ThreeBoard: React.FC<ThreeBoardProps> = ({ squares, onClick, disabled }) => {
  // map 3x3 grid positions
  const positions = [
    [-3.2, 0, -3.2],
    [0, 0, -3.2],
    [3.2, 0, -3.2],
    [-3.2, 0, 0],
    [0, 0, 0],
    [3.2, 0, 0],
    [-3.2, 0, 3.2],
    [0, 0, 3.2],
    [3.2, 0, 3.2]
  ];

  return (
    <div style={{ width: '100%', height: 420 }}>
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 20, 10]} intensity={1.2} />
        <pointLight position={[-10, 10, -10]} intensity={0.6} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        {/* board base */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
          <planeGeometry args={[14, 14]} />
          <meshStandardMaterial color="#071025" metalness={0.6} roughness={0.3} />
        </mesh>

        {positions.map((pos, i) => (
          <Cell key={i} idx={i} value={squares[i]} position={pos} onClick={onClick} disabled={disabled} />
        ))}

        <OrbitControls enablePan={false} maxDistance={24} minDistance={8} />
      </Canvas>
    </div>
  );
};

export default ThreeBoard;

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function BoardField() {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial | null>(null);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  const fragment = `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);
      float t = uTime * 0.12;
      float n = 0.0;
      n += 0.45 * sin(uv.x * 3.0 + t);
      n += 0.22 * sin((uv.x+uv.y) * 6.0 + t*1.3);
      n += 0.11 * sin((uv.x-uv.y) * 12.0 + t*1.7);
      n = smoothstep(-0.6, 0.6, n);
      float alpha = 0.7 * (1.0 - r) * n;
      vec3 base = vec3(0.02, 0.06, 0.12);
      vec3 glow = vec3(0.06, 0.12, 0.18) * n * 0.8;
      vec3 color = mix(base, glow, n) + vec3(0.03, 0.01, 0.05) * r;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const uniforms = React.useMemo(() => ({ uTime: { value: 0 } }), []);

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
      <planeGeometry args={[12.6, 12.6]} />
      <shaderMaterial
        ref={(m: any) => (matRef.current = m)}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

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
    // keep cells static (no rotation). Smoothly interpolate scale towards target
    const target = hover.current ? 1.1 : 1.0;
    const cur = mesh.current.scale.x;
    mesh.current.scale.x = cur + (target - cur) * 0.12;
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
    <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box' }}>
      <Canvas camera={{ position: [0, 8, 24], fov: 50 }}>
        <ambientLight intensity={0.6} />
        {/* main light moved to center-left */}
        <pointLight position={[-4, 12, 0]} intensity={1.4} />
        {/* fill/back light on the right */}
        <pointLight position={[6, 10, -6]} intensity={0.6} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        {/* board field background (shader) */}
        <BoardField />

        {positions.map((pos, i) => (
          <Cell key={i} idx={i} value={squares[i]} position={pos} onClick={onClick} disabled={disabled} />
        ))}

        <OrbitControls enablePan={false} maxDistance={48} minDistance={12} />
      </Canvas>
    </div>
  );
};

export default ThreeBoard;

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

type Square = 'X' | 'O' | null

interface ThreeBoardProps {
  squares: Square[]
  onClick: (index: number) => void
  disabled?: boolean
}

const PLANET_COUNT = 4

function Rocket() {
  return (
    <group rotation={[0, 0, 0]}>
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.45, 1.0, 16]} />
        <meshStandardMaterial color="#fff" metalness={0.6} roughness={0.18} emissive="#111" />
      </mesh>
      <mesh position={[0, 0.4, 0]}> 
        <cylinderGeometry args={[0.3, 0.3, 0.9, 16]} />
        <meshStandardMaterial color="#d94f2b" metalness={0.5} roughness={0.22} />
      </mesh>
      <mesh position={[0.36, 0.06, 0]} rotation={[0, 0, 0.6]}> 
        <boxGeometry args={[0.18, 0.02, 0.5]} />
        <meshStandardMaterial color="#a02b1a" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[-0.36, 0.06, 0]} rotation={[0, 0, -0.6]}> 
        <boxGeometry args={[0.18, 0.02, 0.5]} />
        <meshStandardMaterial color="#a02b1a" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.08, 0]}> 
        <cylinderGeometry args={[0.12, 0.12, 0.18, 12]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.08} />
      </mesh>
    </group>
  )
}

function Planet({ variant }: { variant: number | null }) {
  const colors = ['#6fb3ff', '#ffcc88', '#88ffb3', '#cfa0ff']
  const accents = ['#335577', '#664422', '#2a6644', '#4a2a66']
  const color = colors[variant ?? 0]
  const accent = accents[variant ?? 0]

  return (
    <group position={[0, 0.6, 0]}>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.25} roughness={0.4} emissive={accent} />
      </mesh>
      {variant === 1 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}> 
          <torusGeometry args={[1.2, 0.08, 16, 60]} />
          <meshStandardMaterial color="#cfa87f" metalness={0.35} roughness={0.6} emissive="#442200" />
        </mesh>
      )}
    </group>
  )
}

function BoardField() {
  const ref = useRef<THREE.Mesh>(null!)
  const matRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

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
  `

  const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const uniforms = React.useMemo(() => ({ uTime: { value: 0 } }), [])

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
  )
}

function Cell({ idx, value, position, onClick, disabled, planetVariant }: any) {
  const mesh = useRef<THREE.Mesh>(null!)
  const hover = useRef(false)

  useFrame(() => {
    if (!mesh.current) return
    const target = hover.current ? 1.1 : 1.0
    const cur = mesh.current.scale.x
    mesh.current.scale.x = cur + (target - cur) * 0.12
    mesh.current.scale.y = mesh.current.scale.x
    mesh.current.scale.z = mesh.current.scale.x
  })

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (!disabled) onClick(idx)
        }}
      >
        <boxGeometry args={[2.8, 0.4, 2.8]} />
        <meshStandardMaterial metalness={0.8} roughness={0.2} color={value ? '#111827' : '#0b1220'} emissive={value ? '#001f3f' : '#021428'} />
      </mesh>

      {value === 'X' && <Rocket />}
      {value === 'O' && <Planet variant={planetVariant ?? 0} />}
    </group>
  )
}

export const ThreeBoard: React.FC<ThreeBoardProps> = ({ squares, onClick, disabled }) => {
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
  ]

  // persistent random variant assignment for planets
  const planetVariantsRef = useRef<(number | null)[]>(Array(9).fill(null))

  useEffect(() => {
    squares.forEach((v, i) => {
      if (v === 'O' && planetVariantsRef.current[i] == null) {
        planetVariantsRef.current[i] = Math.floor(Math.random() * PLANET_COUNT)
      }
      if (v !== 'O' && planetVariantsRef.current[i] != null) {
        planetVariantsRef.current[i] = null
      }
    })
  }, [squares])

  return (
    <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box' }}>
      <Canvas camera={{ position: [0, 8, 24], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 20, 10]} intensity={1.2} />
        <pointLight position={[-10, 10, -10]} intensity={0.6} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        <BoardField />

        {positions.map((pos, i) => (
          <Cell
            key={i}
            idx={i}
            value={squares[i]}
            position={pos}
            onClick={onClick}
            disabled={disabled}
            planetVariant={planetVariantsRef.current[i]}
          />
        ))}

        <OrbitControls enablePan={false} maxDistance={48} minDistance={12} />
      </Canvas>
    </div>
  )
}

export default ThreeBoard


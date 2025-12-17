import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Cell from './three/Cell'

function RotatingCellBackground({ value }: { value?: 'X' | 'O' | null }): JSX.Element {
  const grp = useRef<any>(null)
  useFrame((_, dt) => {
    if (!grp.current) return
    grp.current.rotation.y += dt * 0.25
    grp.current.rotation.x = Math.sin(Date.now() / 4000) * 0.05
  })

  return (
    <group ref={grp} position={[0, 0.3, 0]}>
      <group scale={[1.2, 1.2, 1.2]}>
        <Cell
          idx={0}
          value={value ?? null}
          position={[0, 0, 0]}
          onClick={() => {}}
          disabled
          showEdges={false}
          showFill={true}
          // match the game's background primary color
          cellColor="#071025"
        />
      </group>
    </group>
  )
}

export default function ThreeModalCanvas({ value }: { value?: 'X' | 'O' | null }): JSX.Element {
  return (
    <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 6, 8], fov: 50 }}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 10, 5]} intensity={0.9} />
      <pointLight position={[0, 6, 4]} intensity={0.8} color="#ffd166" />
      <hemisphereLight skyColor={0x7c3aed} groundColor={0x071025} intensity={0.15} />
      <Suspense fallback={null}>
        <RotatingCellBackground value={value} />
      </Suspense>
    </Canvas>
  )
}

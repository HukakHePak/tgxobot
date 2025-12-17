import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Cell from './three/Cell'
import { Group } from 'three'

export default function ThreeModalCanvas({ value, result, promo, onReset }: { value?: 'X' | 'O' | null, result?: 'win' | 'loss' | null, promo?: string | null, onReset?: () => void }): JSX.Element {
  // Inner component that lives inside the Canvas so R3F hooks are valid
  function ModalGroup({ val }: { val?: 'X' | 'O' | null }) {
    const rotRef = useRef<Group | null>(null)
    const seed = useMemo(() => Math.random() * 10, [])
    const baseScale = 0.92

    useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const tt = t * 0.25 // slow everything down by 4x total
      const g = rotRef.current
      if (!g) return

      g.rotation.x = Math.sin(tt * (0.6 + seed * 0.01)) * 0.35 + Math.cos(tt * (1.1 + seed * 0.02)) * 0.12
      g.rotation.y = Math.cos(tt * (0.8 + seed * 0.02)) * 0.35 + Math.sin(tt * (1.4 + seed * 0.015)) * 0.1
      g.rotation.z = Math.sin(tt * (0.9 + seed * 0.03)) * 0.25 + Math.cos(tt * (1.7 + seed * 0.01)) * 0.08

      const sx = baseScale + Math.sin(tt * 1.6 + seed) * 0.02
      const sy = baseScale + Math.cos(tt * 1.9 + seed * 1.3) * 0.02
      const sz = baseScale + Math.sin(tt * 1.3 + seed * 0.7) * 0.02
      g.scale.set(sx, sy, sz)
    })

    return (
      <group ref={rotRef} position={[0, 0, 0]} scale={[0.85, 0.85, 0.85]}>
        {/* Fill the cube with the modal background color while keeping edges visible */}
        <Cell
          idx={0}
          value={val ?? null}
          position={[0, 0, 0]}
          onClick={() => {}}
          disabled
          showFill={true}
          cellColor={'#071025'}
          cellEmissive={'#071025'}
          edgeBaseOpacity={0.45}
          fillOpacity={0.5}
        />
      </group>
    )
  }

  return (
    <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 4, 6], fov: 50 }}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 10, 5]} intensity={0.9} />
      <Suspense fallback={null}>
        <ModalGroup val={value} />
      </Suspense>
    </Canvas>
  )
}

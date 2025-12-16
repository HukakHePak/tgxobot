import React, { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import RocketModel from '../models/RocketModel'
import PlanetModel from '../models/PlanetModel'

type CellProps = {
  idx: number
  value: 'X' | 'O' | null
  position: [number, number, number]
  onClick: (i: number) => void
  disabled?: boolean
  planetVariant?: number | null
}

export default function Cell({ idx, value, position, onClick, disabled, planetVariant }: CellProps) {
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

      {value === 'X' && (
        <Suspense fallback={null}>
          <RocketModel scale={0.4} />
        </Suspense>
      )}

      {value === 'O' && (
        <group position={[0, 1.05, 0]}>
          <Suspense fallback={null}>
            <PlanetModel scale={0.4} />
          </Suspense>
        </group>
      )}
    </group>
  )
}

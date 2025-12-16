import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type CellProps = {
  idx: number
  value: 'X' | 'O' | null
  position: [number, number, number]
  onClick: (i: number) => void
  disabled?: boolean
}

export default function Cell({ idx, value, position, onClick, disabled }: CellProps) {
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
    </group>
  )
}

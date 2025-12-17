import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type ResetModelProps = {
  scale?: number
  y?: number
  globalScale?: number
  onClick?: () => void
}

export default function ResetModel({ scale = 0.9, y = 0.0, globalScale = 1, onClick }: ResetModelProps) {
  const group = useRef<THREE.Group>(null!)
  const cone = useRef<THREE.Mesh>(null!)
  const hover = useRef(false)

  // arc length (radians) — leave a gap in the ring
  const arc = 5.1 // ~292° arc, leave a visible gap
  const s = scale * 0.75 // overall shrink by 25%
  const radius = 1.2 * s

  useEffect(() => {
    if (!cone.current) return
    // place cone at the end of the arc and orient it so its base lies on the torus cut face
    const angle = 0
    // compute positions in local group coordinates: group is already positioned at [0, y, 0]
    const endPos = new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
    // tangent along the main circle (normal at the cut face)
    const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize()

    // we want the cone tip to point in the opposite direction (inward),
    // so use the negated tangent as the cone axis
    const coneAxis = tangent.clone().negate()

    // cone dimensions (must match geometry args below)
    const coneHeight = 0.56 * s
    const offsetAlongNormal = 0.02 * s // small gap to avoid z-fighting

    // center the cone so its base (flat side) aligns exactly with endPos
    // place center at endPos + coneAxis * (coneHeight/2 + offset)
    const centerPos = endPos.clone().add(coneAxis.clone().multiplyScalar(coneHeight / 2 + offsetAlongNormal))

    // orient cone so its local +Y axis points along coneAxis (which is inward)
    const up = new THREE.Vector3(0, 1, 0)
    const q = new THREE.Quaternion().setFromUnitVectors(up, coneAxis)

    cone.current.position.copy(centerPos)
    cone.current.quaternion.copy(q)
  }, [arc, radius, s, y])

  useFrame(() => {
    if (!group.current) return
    const target = hover.current ? 1.08 : 1.0
    const cur = group.current.scale.x
    const next = cur + (target - cur) * 0.12
    group.current.scale.set(next, next, next)
    group.current.rotation.y += 0.01
  })

  return (
    <group scale={[globalScale, globalScale, globalScale]}>
      <group
        ref={group}
        position={[0, y, 0]}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
      >
      {/* Arc (ring with a gap) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.22 * s, 16, 100, arc]} />
        <meshStandardMaterial color={'#900000'} metalness={0.3} roughness={0.2} />
      </mesh>

      {/* Arrow head at the arc end; same color as ring */}
      <mesh ref={cone}>
          <coneGeometry args={[0.36 * s, 0.56 * s, 20]} />
        <meshStandardMaterial color={'#900000'} metalness={0.3} roughness={0.25} />
      </mesh>

      {/* Invisible collider to enlarge clickable area for the whole reset button */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.02 * s, 0]}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
      >
        <torusGeometry args={[radius, 0.6 * s, 8, 64, arc]} />
        <meshStandardMaterial color={'#000000'} transparent opacity={0} />
      </mesh>

      {/* Center disk collider so clicks in the hole register */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.021 * s, 0]}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
      >
        {/* radius slightly smaller than torus inner radius to avoid overlapping the visible ring edge */}
        <circleGeometry args={[Math.max(0.6 * s, radius - 0.6 * s), 32]} />
        <meshStandardMaterial color={'#000000'} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      </group>
    </group>
  )
}

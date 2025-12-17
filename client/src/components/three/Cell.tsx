import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type CellProps = {
  idx: number
  value: 'X' | 'O' | null
  position: [number, number, number]
  onClick: (i: number) => void
  disabled?: boolean
  showEdges?: boolean
  edgeColor?: string
  cellColor?: string
  cellEmissive?: string
  showFill?: boolean
}

export default function Cell({ idx, value, position, onClick, disabled, showEdges = true, edgeColor, cellColor, cellEmissive, showFill = false }: CellProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const hover = useRef(false)
  const edgeRef = useRef<THREE.LineSegments>(null!)
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null!)
  const transform = useRef<THREE.Group>(null!)

  const edgesGeom = useMemo(() => {
    const geo = new THREE.BoxGeometry(2.8, 0.4, 2.8)
    return new THREE.EdgesGeometry(geo)
  }, [])

  useEffect(() => {
    // prevent edge lines from intercepting pointer events so hover remains on the group/mesh
    if (edgeRef.current) {
      // disable raycast for the line segments
      // @ts-ignore
      edgeRef.current.raycast = () => null
    }
  }, [])

  useFrame((state) => {
    if (!transform.current) return
    const t = state.clock.getElapsedTime()
    const target = hover.current ? 1.08 : 1.0
    const cur = transform.current.scale.x
    const next = cur + (target - cur) * 0.12
    transform.current.scale.set(next, next, next)

    // animate edge glow opacity (simple pulsing shimmer)
    if (edgeMatRef.current) {
      const base = hover.current ? 0.6 : 0.18
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.0 + idx * 0.7)
      edgeMatRef.current.opacity = Math.min(1, base + pulse * 0.6)
    }
  })

  return (
    <group position={position}>
      <group
        ref={transform}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (!disabled) onClick(idx)
        }}
      >
        <mesh ref={mesh}>
          <boxGeometry args={[2.8, 0.4, 2.8]} />
          <meshStandardMaterial
            // when showing fill (modal) use less metallic/more rough so color reads better
            metalness={showFill ? 0.2 : 0.8}
            roughness={showFill ? 0.6 : 0.2}
            color={cellColor ?? '#0b1220'}
            // give a small emissive tint when filled so dark-blue is visible under lighting
            emissive={cellEmissive ?? (showFill ? (cellColor ?? '#0b1220') : '#000000')}
            emissiveIntensity={showFill ? 0.08 : 0}
            transparent={!showFill}
            opacity={showFill ? 1 : 0}
            depthWrite={showFill}
          />
        </mesh>

        {/* animated rim along edges (can be disabled or recolored via props) */}
        {showEdges ? (
          <lineSegments ref={edgeRef} geometry={edgesGeom} renderOrder={999}>
            <lineBasicMaterial
              ref={edgeMatRef as any}
              color={edgeColor ?? (value === 'X' ? '#7dd3fc' : value === 'O' ? '#ffd166' : '#ffffff')}
              transparent={true}
              opacity={0.2}
              linewidth={1}
            />
          </lineSegments>
        ) : null}
      </group>
    </group>
  )
}

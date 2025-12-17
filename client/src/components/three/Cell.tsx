import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS, SIZES } from '../../constants/ui'

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
  edgeBaseOpacity?: number
  fillOpacity?: number
  disableHover?: boolean
}

export default function Cell({ idx, value, position, onClick, disabled, showEdges = true, edgeColor, cellColor, cellEmissive, showFill = false, edgeBaseOpacity, fillOpacity, disableHover = false }: CellProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const hover = useRef(false)
  const edgeRef = useRef<THREE.LineSegments>(null!)
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null!)
  const transform = useRef<THREE.Group>(null!)

  const edgesGeom = useMemo(() => {
    const geo = new THREE.BoxGeometry(SIZES.cellSize, SIZES.cellSize, SIZES.cellSize)
    const edges = new THREE.EdgesGeometry(geo)
    // add per-vertex colors to create a pearlescent, non-uniform gradient
    const pos = edges.attributes.position
    const count = pos.count
    const colors = new Float32Array(count * 3)
    const baseA = new THREE.Color(edgeColor ?? (value === 'X' ? '#7dd3fc' : value === 'O' ? '#7c3aed' : '#7dd3fc'))
    const baseB = new THREE.Color('#7c3aed')
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      // deterministic seed per vertex
      const s = Math.abs(Math.sin((x * 12.9898 + y * 78.233 + z * 45.164 + idx * 3.1415))) % 1
      const mixv = 0.25 + 0.7 * s
      // mix base colors
      let r = baseA.r * (1 - mixv) + baseB.r * mixv
      let g = baseA.g * (1 - mixv) + baseB.g * mixv
      let b = baseA.b * (1 - mixv) + baseB.b * mixv
      // add subtle pearlescent shift towards white based on another pattern
      const pearl = 0.12 * Math.abs(Math.sin(s * Math.PI * 2 + idx * 0.37))
      r = r + (1.0 - r) * pearl
      g = g + (1.0 - g) * pearl
      b = b + (1.0 - b) * pearl
      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    edges.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return edges
  }, [idx, value, edgeColor])

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
    // when hover is disabled (e.g., modal), keep target scale at 1.0
    const target = (disableHover ? 1.0 : (hover.current ? 1.08 : 1.0))
    const cur = transform.current.scale.x
    const next = cur + (target - cur) * 0.12
    transform.current.scale.set(next, next, next)

    // animate edge glow opacity (simple pulsing shimmer)
    if (edgeMatRef.current) {
      const base = (!disableHover && hover.current) ? 0.6 : (typeof (edgeBaseOpacity) === 'number' ? edgeBaseOpacity : 0.18)
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.0 + idx * 0.7)
      edgeMatRef.current.opacity = Math.min(1, base + pulse * 0.6)
    }
  })

  return (
    <group position={position}>
      <group
        ref={transform}
        {...(!disableHover
          ? {
              onPointerOver: () => (hover.current = true),
              onPointerOut: () => (hover.current = false),
              onPointerDown: (e: any) => {
                e.stopPropagation()
                if (!disabled) onClick(idx)
              },
            }
          : {})}
      >
        <mesh ref={mesh}>
          <boxGeometry args={[2.8, 2.8, 2.8]} />
          <meshStandardMaterial
            // when showing fill (modal) use less metallic/more rough so color reads better
            metalness={showFill ? 0.2 : 0.8}
            roughness={showFill ? 0.6 : 0.2}
            color={cellColor ?? COLORS.modalBg}
            // give a small emissive tint when filled so dark-blue is visible under lighting
            emissive={cellEmissive ?? (showFill ? (cellColor ?? '#0b1220') : '#000000')}
            emissiveIntensity={showFill ? 0.08 : 0}
            // allow explicit fill opacity; default to 1 when showFill is true
            transparent={typeof fillOpacity === 'number' ? fillOpacity < 1 : !showFill}
            opacity={typeof fillOpacity === 'number' ? fillOpacity : (showFill ? 1 : 0)}
            depthWrite={typeof fillOpacity === 'number' ? fillOpacity === 1 : showFill}
          />
        </mesh>

        {/* animated rim along edges (can be disabled or recolored via props) */}
        {showEdges ? (
          <lineSegments ref={edgeRef} geometry={edgesGeom} renderOrder={999}>
            <lineBasicMaterial
              ref={edgeMatRef as any}
              vertexColors={true}
              transparent={true}
              opacity={0.85}
            />
          </lineSegments>
        ) : null}
      </group>
    </group>
  )
}

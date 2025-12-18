import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SIZES } from '../../constants/ui'
import CellBase, { CellProps } from './CellBase'

export default function Cell(props: CellProps) {
  const { showFill = false, fillOpacity, cellColor, cellEmissive } = props
  const { idx, value, edgeColor, showEdges = true } = props
  const edgeRef = useRef<THREE.LineSegments>(null!)
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null!)

  const edgesGeom = useMemo(() => {
    const geo = new THREE.BoxGeometry(SIZES.cellSize, SIZES.cellSize, SIZES.cellSize)
    const edges = new THREE.EdgesGeometry(geo)
    const pos = edges.attributes.position
    const count = pos.count
    const colors = new Float32Array(count * 3)
    const baseA = new THREE.Color(edgeColor ?? (value === 'X' ? '#7dd3fc' : value === 'O' ? '#7c3aed' : '#7dd3fc'))
    const baseB = new THREE.Color('#7c3aed')
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const s = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 45.164 + idx * 3.1415)) % 1
      const mixv = 0.25 + 0.7 * s
      let r = baseA.r * (1 - mixv) + baseB.r * mixv
      let g = baseA.g * (1 - mixv) + baseB.g * mixv
      let b = baseA.b * (1 - mixv) + baseB.b * mixv
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
    if (edgeRef.current) {
      // disable raycast for the line segments so pointer remains on the cell group
      // @ts-ignore
      edgeRef.current.raycast = () => null
    }
  }, [])

  useFrame((state) => {
    if (edgeMatRef.current) {
      const t = state.clock.getElapsedTime()
      const base = typeof props.edgeBaseOpacity === 'number' ? props.edgeBaseOpacity : 0.18
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.0 + props.idx * 0.7)
      edgeMatRef.current.opacity = Math.min(1, base + pulse * 0.6)
    }
  })

  return (
    <CellBase {...props}>
      <mesh>
        <boxGeometry args={[2.8, 2.8, 2.8]} />
        <meshStandardMaterial
          metalness={showFill ? 0.2 : 0.8}
          roughness={showFill ? 0.6 : 0.2}
          color={cellColor}
          emissive={cellEmissive}
          emissiveIntensity={showFill ? 0.08 : 0}
          transparent={typeof fillOpacity === 'number' ? fillOpacity < 1 : !showFill}
          opacity={typeof fillOpacity === 'number' ? fillOpacity : (showFill ? 1 : 0)}
          depthWrite={typeof fillOpacity === 'number' ? fillOpacity === 1 : showFill}
        />
      </mesh>

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
    </CellBase>
  )
}

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import Cell from './Cell'
import { COLORS } from '../../constants/ui'

type RotatingCellProps = {
  scale?: number
}

export default function RotatingCell({ scale = 1.2 }: RotatingCellProps) {
  const ref = useRef<any>(null)
  const seed = useMemo(() => Math.random() * 10, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = 0.12 * Math.sin(t * 0.25 + seed) + 0.03 * Math.sin(t * 1.7 + seed * 0.7)
    ref.current.rotation.y = 0.16 * Math.sin(t * 0.2 - seed * 0.3) + 0.04 * Math.sin(t * 1.1 + seed)
    ref.current.rotation.z = 0.08 * Math.sin(t * 0.33 + seed * 1.3) + 0.02 * Math.sin(t * 0.9 - seed * 0.5)
  })

  return (
    <group ref={ref} position={[0, 0, 0]} scale={[scale, scale, scale]}>
      <Cell
        idx={-999}
        value={null}
        position={[0, 0, 0]}
        onClick={() => {}}
        disabled={true}
        disableHover={true}
        showEdges={true}
        edgeColor="#ffd166"
        cellColor={COLORS.modalBg}
        cellEmissive={COLORS.modalBg}
        showFill={true}
        edgeBaseOpacity={0.9}
        fillOpacity={0.5}
      />
    </group>
  )
}

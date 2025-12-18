import React, { useMemo } from 'react'
import Cell from './Cell'
import useChaoticRotation from './useChaoticRotation'

type RotatingCellProps = {
  scale?: number
}

export default function RotatingCell({ scale = 1.8 }: RotatingCellProps) {
  const seed = useMemo(() => Math.random() * 10, [])
  const ref = useChaoticRotation(seed)

  return (
    <group ref={ref} position={[0, 0, 0]} scale={[scale, scale, scale]}>
      <Cell
        idx={0}
        value={null}
        position={[0, 0, 0]}
        onClick={() => { }}
        disabled
        disableHover
        showEdges
        showFill={true}
        cellColor={'#071025'}
        cellEmissive={'#071025'}
        edgeBaseOpacity={0.45}
        fillOpacity={0.7}
      />
    </group>
  )
}

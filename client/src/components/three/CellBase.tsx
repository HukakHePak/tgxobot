import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type CellProps = {
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
  onHoverChange?: (hover: boolean) => void
}

export default function CellBase({
  idx,
  value,
  position,
  onClick,
  disabled,
  showEdges = true,
  edgeColor,
  cellColor,
  cellEmissive,
  showFill = false,
  edgeBaseOpacity,
  fillOpacity,
  disableHover = false,
  children,
}: React.PropsWithChildren<CellProps>) {
  const transform = useRef<THREE.Group>(null!)
  const hover = useRef(false)
  const { onHoverChange } = (arguments[0] as any) || {}

  useFrame(() => {
    if (!transform.current) return
    const target = disableHover ? 1.0 : (hover.current ? 1.08 : 1.0)
    const cur = transform.current.scale.x
    const next = cur + (target - cur) * 0.12
    transform.current.scale.set(next, next, next)
  })

  return (
    <group position={position}>
      <group
        ref={transform}
            {...(!disableHover
              ? {
                  onPointerOver: () => {
                    hover.current = true
                    if (onHoverChange) onHoverChange(true)
                  },
                  onPointerOut: () => {
                    hover.current = false
                    if (onHoverChange) onHoverChange(false)
                  },
                  onPointerDown: (e: any) => {
                    e.stopPropagation()
                    if (!disabled) onClick(idx)
                  },
                }
              : {})}
      >
        {children}
      </group>
    </group>
  )
}

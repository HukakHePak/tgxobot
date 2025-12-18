import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

type AnimatedModelProps = {
  finalScale?: number
  initialSpin?: number // radians/sec
  finalSpin?: number // radians/sec
  appearRate?: number // how fast progress goes from 0->1 (1 means 1s)
  floatAmplitude?: number // vertical bob amplitude in world units
  floatSpeed?: number // bob speed multiplier (radians/sec)
  floatPhase?: number // optional phase offset (radians) to desync instances
  children: React.ReactNode
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function AnimatedModel({ finalScale = 1, initialSpin = 6, finalSpin = 0.6, appearRate = 2.4, floatAmplitude = 0.12, floatSpeed = 1.5, floatPhase, children }: AnimatedModelProps) {
  const group = useRef<any>(null)
  const progress = useRef(0)
  const phase = useRef<number>(floatPhase ?? Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    progress.current = Math.min(1, progress.current + delta * appearRate)
    const p = easeOutCubic(progress.current)
    const s = finalScale * p
    if (group.current) {
      group.current.scale.set(s, s, s)
      const spin = initialSpin * (1 - progress.current) + finalSpin * progress.current
      group.current.rotation.y += spin * delta
      // gentle vertical bobbing (fades in with appear progress)
      const t = _.clock.getElapsedTime()
      const bob = floatAmplitude * Math.sin(t * floatSpeed + phase.current)
      group.current.position.y = bob * p
    }
  })

  return (
    <group ref={group}>
      {children}
    </group>
  )
}

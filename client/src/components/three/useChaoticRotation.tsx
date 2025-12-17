import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function useChaoticRotation(seed?: number) {
  const ref = useRef<any>(null)
  const s = typeof seed === 'number' ? seed : Math.random() * 10

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = 0.12 * Math.sin(t * 0.25 + s) + 0.03 * Math.sin(t * 1.7 + s * 0.7)
    ref.current.rotation.y = 0.16 * Math.sin(t * 0.2 - s * 0.3) + 0.04 * Math.sin(t * 1.1 + s)
    ref.current.rotation.z = 0.08 * Math.sin(t * 0.33 + s * 1.3) + 0.02 * Math.sin(t * 0.9 - s * 0.5)
  })

  return ref
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

type Opts = {
  interval?: number
  maxSpeed?: number
}

export default function useDirectionalRotation(opts: Opts = {}) {
  const { interval = 3.0, maxSpeed = 0.8 } = opts
  const ref = useRef<any>(null)
  const target = useRef<[number, number, number]>([
    (Math.random() - 0.5) * maxSpeed,
    (Math.random() - 0.5) * maxSpeed,
    (Math.random() - 0.5) * maxSpeed,
  ])
  const current = useRef<[number, number, number]>([0, 0, 0])
  const timer = useRef(0)

  useFrame((state, delta) => {
    timer.current += delta
    if (timer.current >= interval) {
      timer.current = 0
      // pick a new target rotation speed (can change sign)
      target.current = [
        (Math.random() - 0.5) * maxSpeed,
        (Math.random() - 0.5) * maxSpeed,
        (Math.random() - 0.5) * maxSpeed,
      ]
    }

    // smooth toward target
    const t = 0.06
    current.current[0] += (target.current[0] - current.current[0]) * t
    current.current[1] += (target.current[1] - current.current[1]) * t
    current.current[2] += (target.current[2] - current.current[2]) * t

    if (ref.current) {
      // apply constant rotation (velocity * dt) so direction changes gradually
      ref.current.rotation.x += current.current[0] * delta
      ref.current.rotation.y += current.current[1] * delta
      ref.current.rotation.z += current.current[2] * delta
    }
  })

  return ref
}

import React, { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { getRocketGltfSync } from './modelLoader'

function BundledRocket({ url, scale, y }: { url: string; scale?: number; y?: number }) {
  const { scene } = useGLTF(url) as any
  useEffect(() => {
    ;(useGLTF as any).preload?.(url)
  }, [url])
  const s = scale ?? 1
  const yOff = y ?? 0.9
  return (
    <group position={[0, yOff, 0]}>
      <primitive object={scene.clone()} scale={s} />
    </group>
  )
}

export default function RocketModel(props: { scale?: number; y?: number }) {
  // Resolve URL synchronously to avoid changing hook order across renders
  const url = getRocketGltfSync()

  if (!url) return null

  return (
    <Suspense fallback={null}>
      <BundledRocket url={url} scale={props.scale} y={props.y} />
    </Suspense>
  )
}

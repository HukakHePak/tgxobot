import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export default function PlanetModel({ url, scale = 0.6 }: { url: string; scale?: number }) {
  const { scene } = useGLTF(url) as any
  useEffect(() => {
    ;(useGLTF as any).preload?.(url)
  }, [url])
  return <primitive object={scene.clone()} scale={scale} />
}

// Note: caller should wrap this component with <Suspense> when rendering.

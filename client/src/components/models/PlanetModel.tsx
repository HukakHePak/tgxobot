import React from 'react'
import { useGLTF } from '@react-three/drei'
import { getPlanetGltfSync } from './modelLoader'

export default function PlanetModel({ url: propUrl, scale = 0.6 }: { url?: string; scale?: number }) {
  // Resolve URL synchronously to avoid changing hook order across renders
  const url = propUrl ?? getPlanetGltfSync()

  if (!url) return null

  const { scene } = useGLTF(url) as any
  ;(useGLTF as any).preload?.(url)
  // eslint-disable-next-line no-console
  console.warn('PlanetModel: rendering primitive for', url)
  return <primitive object={scene.clone()} scale={scale} />
}

// Note: caller should wrap this component with <Suspense> when rendering.

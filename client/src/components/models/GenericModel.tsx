import React, { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

type GenericModelProps = {
  url: string
  scale?: number
  position?: [number, number, number]
  dispose?: boolean
}

export default function GenericModel({ url, scale = 1, position = [0, 0, 0] }: GenericModelProps) {
  const { scene } = useGLTF(url) as any
  useEffect(() => {
    ;(useGLTF as any).preload?.(url)
  }, [url])

  return (
    <group dispose={null} position={position}>
      <primitive object={scene.clone()} scale={scale} />
    </group>
  )
}

// Note: callers should render this within <Suspense> to show a fallback while loading

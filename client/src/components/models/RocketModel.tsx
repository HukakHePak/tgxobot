import React, { Suspense, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'

function BundledRocket({ url, scale, y }: { url: string; scale?: number; y?: number }) {
  const { scene } = useGLTF(url) as any
  useEffect(() => {
    ;(useGLTF as any).preload?.(url)
  }, [url])
  const s = (scale ?? 1) * 0.5
  const yOff = y ?? 0.9
  return (
    <group position={[0, yOff, 0]}>
      <primitive object={scene.clone()} scale={s} />
    </group>
  )
}

function ProceduralRocket({ scale, y }: { scale?: number; y?: number }) {
  const s = (scale ?? 1) * 0.5
  const yOff = y ?? 0.9
  return (
    <group position={[0, yOff, 0]}>
      <group scale={s}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} />
          <meshStandardMaterial color="#d8d8d8" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <coneGeometry args={[0.28, 0.5, 16]} />
          <meshStandardMaterial color="#ff6b6b" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.6]} />
          <meshStandardMaterial color="#ff9f43" emissive="#ff6b00" />
        </mesh>
      </group>
    </group>
  )
}

export default function RocketModel(props: { scale?: number; y?: number }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    // Prefer an explicit `rocket` model if present
    // Look for model files inside `src/assets/models/rocket/` (prefer .glb)
    const prefer = import.meta.glob('../../assets/models/rocket/*.{glb,gltf}', { as: 'url' }) as Record<string, () => Promise<string>>
    const preferKeys = Object.keys(prefer)
    if (preferKeys.length > 0) {
      const glbKey = preferKeys.find((k) => k.endsWith('.glb')) || preferKeys[0]
      const loader = prefer[glbKey]
      loader()
        .then((u) => setUrl(u))
        .catch(() => setUrl(null))
      return
    }

    // Otherwise fall back to any glTF/glb in the folder
    const modules = import.meta.glob('../../assets/models/*.{gltf,glb}', { as: 'url' }) as Record<string, () => Promise<string>>
    const keys = Object.keys(modules)
    if (keys.length > 0) {
      const loader = modules[keys[0]]
      loader()
        .then((u) => setUrl(u))
        .catch(() => setUrl(null))
    } else {
      setUrl(null)
    }
  }, [])

  if (url) {
    return (
      <Suspense fallback={null}>
        <BundledRocket url={url} scale={props.scale} y={props.y} />
      </Suspense>
    )
  }

  return <ProceduralRocket scale={props.scale} y={props.y} />
}

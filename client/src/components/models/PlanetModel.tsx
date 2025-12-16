import React, { Suspense } from 'react'
import GenericModel from './GenericModel'
import { resolveAssetUrl } from './assetResolver'

export const PLANET_COLORS = ['blue', 'green', 'purple', 'red'] as const

const COLOR_TO_URL: Record<string, string | null> = {
  blue: resolveAssetUrl('../../assets/models/planets/planet_blue/scene.gltf'),
  green: resolveAssetUrl('../../assets/models/planets/planet_green/scene.gltf'),
  purple: resolveAssetUrl('../../assets/models/planets/planet_purple/scene.gltf'),
  red: resolveAssetUrl('../../assets/models/planets/planet_red/scene.gltf')
}

export default function PlanetModel({ color = 'blue', scale = 0.35 }: { color?: string; scale?: number }) {
  const url = COLOR_TO_URL[color] ?? COLOR_TO_URL['blue']
  if (!url) return null

  return (
    <Suspense fallback={null}>
      <GenericModel url={url} scale={scale} position={[0, 0, 0]} />
    </Suspense>
  )
}

// Note: `PLANET_COLORS` lists available color keys and can be imported by callers.

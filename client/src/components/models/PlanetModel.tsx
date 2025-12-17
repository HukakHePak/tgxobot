import React, { Suspense, useMemo } from 'react'
import GenericModel from './GenericModel'
import { resolveAssetUrl } from '../../utils/assetResolver'
import AnimatedModel from './AnimatedModel'

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

  // randomize rotation direction per instance
  const sign = useMemo(() => (Math.random() < 0.5 ? -1 : 1), [])
  // planets rotate slower than rockets
  const initialSpin = 2.5 * sign
  const finalSpin = 0.25 * sign

  return (
    <Suspense fallback={null}>
      <AnimatedModel finalScale={scale} initialSpin={initialSpin} finalSpin={finalSpin} appearRate={1.8}>
        {/* GenericModel scale is 1; AnimatedModel handles visible scaling */}
        <GenericModel url={url} scale={1} position={[0, 0, 0]} />
      </AnimatedModel>
    </Suspense>
  )
}

// Note: `PLANET_COLORS` lists available color keys and can be imported by callers.

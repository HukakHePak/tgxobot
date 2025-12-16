import React, { Suspense } from 'react'
import GenericModel from './GenericModel'
import { resolveAssetUrl } from './assetResolver'

export default function PlanetModel({ url: propUrl, scale = 0.35 }: { url?: string; scale?: number }) {
  const url = propUrl ?? resolveAssetUrl('../../assets/models/planets/planet_blue/scene.gltf')
  if (!url) return null

  return (
    <Suspense fallback={null}>
      <GenericModel url={url} scale={scale} position={[0, 0, 0]} />
    </Suspense>
  )
}

// Note: caller should wrap this component with <Suspense> when rendering.

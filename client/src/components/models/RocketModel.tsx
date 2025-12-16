import React, { Suspense } from 'react'
import GenericModel from './GenericModel'
import { resolveAssetUrl } from './assetResolver'

export default function RocketModel(props: { scale?: number; y?: number }) {
  const url = resolveAssetUrl('../../assets/models/toon_rocket/scene.gltf')
  if (!url) return null

  // Reduce rocket size further: use divisor 4 (smaller than previous 3)
  const requested = props.scale ?? 0.6
  const finalScale = requested / 4
  const posY = props.y ?? 0.9

  return (
    <Suspense fallback={null}>
      <GenericModel url={url} scale={finalScale} position={[0, posY, 0]} />
    </Suspense>
  )
}

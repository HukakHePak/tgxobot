import React, { Suspense } from 'react'
import GenericModel from './GenericModel'
import { resolveAssetUrl } from '../../utils/assetResolver'
import AnimatedModel from './AnimatedModel'

export default function RocketModel(props: { scale?: number; y?: number }) {
  const url = resolveAssetUrl('../../assets/models/toon_rocket/scene.gltf')
  if (!url) return null

  // Reduce rocket size further: use divisor 4 (smaller than previous 3)
  const requested = props.scale ?? 0.6
  const finalScale = requested / 4
  const posY = props.y ?? 0.9
  // When AnimatedModel scales the whole group, child positions are scaled too.
  // Compensate so the rocket stays at the intended world height by dividing
  // the child position by the finalScale used by AnimatedModel.
  const adjustedPosY = posY / finalScale

  return (
    <Suspense fallback={null}>
      <AnimatedModel finalScale={finalScale} initialSpin={4.5} finalSpin={0.6} appearRate={2.2}>
        {/* GenericModel scale is left at 1 because AnimatedModel controls overall scale.
            Use adjustedPosY so after scaling the rocket sits above the cell. */}
        <GenericModel url={url} scale={1} position={[0, adjustedPosY, 0]} />
      </AnimatedModel>
    </Suspense>
  )
}

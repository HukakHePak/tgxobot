import React, { Suspense } from 'react'
import AnimatedModel from './AnimatedModel'
import GenericModel from './GenericModel'
import { resolveAssetUrl } from '../../utils/assetResolver'

const BananaModel: React.FC<{ scale?: number }> = ({ scale = 0.45 }) => {
  const url = resolveAssetUrl('../../assets/models/banana/scene.gltf') || '/assets/models/banana/scene.gltf'

  return (
    <AnimatedModel finalScale={scale}>
      <Suspense fallback={null}>
        <GenericModel url={url} scale={1} position={[0, -1.2, 0]} />
      </Suspense>
    </AnimatedModel>
  )
}

export default BananaModel

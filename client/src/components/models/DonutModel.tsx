import React, { Suspense } from 'react'
import AnimatedModel from './AnimatedModel'
import GenericModel from './GenericModel'
import { resolveAssetUrl } from '../../utils/assetResolver'

const DonutModel: React.FC<{ scale?: number; color?: string }> = ({ scale = 0.36, color = '#FFB3C7' }) => {
  const url = resolveAssetUrl('../../assets/models/donut/scene.gltf') || '/assets/models/donut/scene.gltf'

  return (
    <AnimatedModel finalScale={scale}>
      <Suspense fallback={null}>
        <GenericModel url={url} scale={1} position={[0, -1.2, 0]} />
      </Suspense>
    </AnimatedModel>
  )
}

export default DonutModel

import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { resolveAssetUrl } from '../../utils/assetResolver'
import { useTheme } from '../../theme/ThemeContext'

export default function LogoSprite({ position = [0, 0, 0], scale = [3.5, 1.75, 1] as any }: { position?: [number, number, number]; scale?: [number, number, number] }) {
  const { toggle } = useTheme()
  const url = (resolveAssetUrl('/logo.svg') || resolveAssetUrl('/logo.png') || '/logo.svg') as string
  const tex = useLoader(THREE.TextureLoader, url)

  return (
    <sprite
      position={position as any}
      scale={scale as any}
      onPointerDown={(e: any) => {
        e.stopPropagation()
        toggle()
      }}
      cursor="pointer"
    >
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  )
}

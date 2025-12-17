import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { resolveAssetUrl } from '../../utils/assetResolver'
import { useTheme } from '../../theme/ThemeContext'

export default function LogoSprite({ position = [0, 0, 0], scale = [3.5, 1.75, 1] as any }: { position?: [number, number, number]; scale?: [number, number, number] }) {
  const { theme, toggle } = useTheme()
  const url = (theme === 'light'
    ? (resolveAssetUrl('/logo-light.svg') || resolveAssetUrl('/logo.svg') || '/logo-light.svg')
    : (resolveAssetUrl('/logo.svg') || resolveAssetUrl('/logo.png') || '/logo.svg')) as string
  const tex = useLoader(THREE.TextureLoader, url)
  // ensure texture is treated as sRGB so white stays bright under color management
  ;(tex as any).encoding = THREE.sRGBEncoding
  ;(tex as any).needsUpdate = true

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
      <spriteMaterial
        map={tex}
        color={'#ffffff'}
        transparent={false}
        depthWrite={true}
        toneMapped={false}
        // discard semi-transparent fringe so logo strokes render solid white
        alphaTest={0.5}
      />
    </sprite>
  )
}

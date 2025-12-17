import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export default function LogoSprite({ position = [0, 4.5, -3.2], scale = [3.5, 1.75, 1] as any }: { position?: [number, number, number]; scale?: [number, number, number] }) {
  const tex = useLoader(THREE.TextureLoader, '/logo.png')
  return (
    <sprite position={position as any} scale={scale as any}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  )
}

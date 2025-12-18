import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CellBase, { CellProps } from './CellBase'
import { RoundedBox } from '@react-three/drei'

export default function RoundedCell(props: CellProps & { radius?: number; smoothness?: number }) {
  const { value, radius = 0.5, smoothness = 10 } = props
  // overlay shader uniforms (rim only)
  const overlayUniforms = useRef({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0xffffff) },
    uPower: { value: 2.2 },
    uRimStrength: { value: 1.0 },
  })

  const overlayMat = useRef(
    new THREE.ShaderMaterial({
      uniforms: overlayUniforms.current,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uPower;
        uniform float uRimStrength;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float fresnel = pow(1.0 - max(0.0, dot(vNormal, vViewDir)), uPower);
          float rim = uRimStrength * fresnel;
          // boost rim color slightly for visibility
          vec3 col = uColor * rim * 1.25;
          // output additive rim (alpha used lightly)
          gl_FragColor = vec4(col, clamp(rim * 1.25, 0.0, 1.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  )

  useFrame((state) => {
    overlayUniforms.current.uTime.value = state.clock.getElapsedTime()
  })

  
  useEffect(() => {
    // swapped colors and softened tones
    if (value === 'X') {
      // pale gold
      overlayUniforms.current.uColor.value.set('#ffe9c9')
    } else if (value === 'O') {
      // pale pink (replaces lavender)
      overlayUniforms.current.uColor.value.set('#ffd1e9')
    } else {
      overlayUniforms.current.uColor.value.set('#ffffff')
    }
  }, [value])

  return (
    <CellBase {...props} showEdges={false}>
      <group scale={[1.02, 1.02, 1.02]} renderOrder={20}>
        <RoundedBox args={[2.8, 2.8, 2.8]} radius={radius} smoothness={smoothness}>
          <primitive object={overlayMat.current} attach="material" />
        </RoundedBox>
      </group>
    </CellBase>
  )
}

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import RotatingCell from './RotatingCell'
import { RoundedBox } from '@react-three/drei'
import useChaoticRotation from './useChaoticRotation'
import useDirectionalRotation from './useDirectionalRotation'
import * as THREE from 'three'
import { useTheme } from '../../theme/ThemeContext'

type ModalProps = {
  open: boolean
  title?: string
  message?: string
  onClose?: () => void
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null
  const { theme } = useTheme()

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'transparent' }} onClick={onClose} />

      <div style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: 1, borderRadius: 0, overflow: 'hidden' }}>
          <Canvas style={{ background: 'transparent', width: '100vw', height: '100vh' }} gl={{ alpha: true }} camera={{ position: [0, 0, 12], fov: 50 }}>
              {theme === 'light' ? (
                <RotatingRoundedBox />
              ) : (
                <RotatingCell />
              )}
          </Canvas>

          {/* overlay children are rendered above the Canvas so they are not part of the 3D scene */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, pointerEvents: 'auto' }}>
            {children ?? null}
          </div>
      </div>
    </div>
  )
}

export default Modal

function RotatingRoundedBox() {
  // use a directional rotation for the modal: constant rotation that changes direction
  const groupRef = useDirectionalRotation({ interval: 3.2, maxSpeed: 1.2 })

  const overlayUniforms = useRef({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0xffffff) },
    uPower: { value: 2.2 },
    uRimStrength: { value: 0.9 },
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
          // stronger additive rim to give visible white highlights
          vec3 col = uColor * rim * 1.0;
          gl_FragColor = vec4(col, clamp(rim * 1.0, 0.0, 0.6));
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

  // keep overlay color white
  useEffect(() => {
    overlayUniforms.current.uColor.value.set('#ffffff')
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <RoundedBox args={[5.2, 5.2, 5.2]} radius={0.6} smoothness={10}>
        <meshStandardMaterial
          color={'#ff9fcf'}
          emissive={'#ffd6e8'}
          emissiveIntensity={0.55}
          transparent
          opacity={0.6}
          metalness={0.02}
          roughness={0.32}
        />
      </RoundedBox>
      <group scale={[1.002, 1.002, 1.002]} position={[0, 0, 0]} renderOrder={20}>
        <RoundedBox args={[5.2, 5.2, 5.2]} radius={0.6} smoothness={10}>
          <primitive object={overlayMat.current} attach="material" />
        </RoundedBox>
      </group>
    </group>
  )
}
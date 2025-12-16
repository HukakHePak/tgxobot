import React from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BoardField() {
  const ref = React.useRef<THREE.Mesh>(null!)
  const matRef = React.useRef<any>(null)

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  const fragment = `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);
      float t = uTime * 0.12;
      float n = 0.0;
      n += 0.45 * sin(uv.x * 3.0 + t);
      n += 0.22 * sin((uv.x+uv.y) * 6.0 + t*1.3);
      n += 0.11 * sin((uv.x-uv.y) * 12.0 + t*1.7);
      n = smoothstep(-0.6, 0.6, n);
      float alpha = 0.7 * (1.0 - r) * n;
      vec3 base = vec3(0.02, 0.06, 0.12);
      vec3 glow = vec3(0.06, 0.12, 0.18) * n * 0.8;
      vec3 color = mix(base, glow, n) + vec3(0.03, 0.01, 0.05) * r;
      gl_FragColor = vec4(color, alpha);
    }
  `

  const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const uniforms = React.useMemo(() => ({ uTime: { value: 0 } }), [])

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
      <planeGeometry args={[12.6, 12.6]} />
      <shaderMaterial
        ref={(m: any) => (matRef.current = m)}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}

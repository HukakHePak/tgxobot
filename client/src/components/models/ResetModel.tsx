import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../theme/ThemeContext'

type ResetModelProps = {
  scale?: number
  y?: number
  globalScale?: number
  onClick?: () => void
}

export default function ResetModel({ scale = 0.9, y = 0.0, globalScale = 1, onClick }: ResetModelProps) {
  const group = useRef<THREE.Group>(null!)
  const arrow = useRef<THREE.Mesh>(null!)
  const hover = useRef(false)

  // visual parameters
  const s = scale * 0.75
  const radius = 1.2 * s
  const thickness = 0.22 * s
  // how much of the ring is present (radians)
  // define empty gap size and compute arc = fullCircle - gap
  const gap = 2.0 // radians of empty segment (adjustable)
  const arc = Math.PI * 2 - gap

  // extruded ring geometry (preserve arc, create hollow shape with hole)
  const ringGeom = useMemo(() => {
    const outerR = radius + thickness
    const innerR = Math.max(radius - thickness, 0.01)
    const segments = 128
    const depth = thickness * 3

    // We'll build a prism band by sampling points along the arc and building
    // top and bottom vertices for outer and inner edges. The mesh will NOT
    // connect the last sample back to the first — so the gap remains open.
    const verts: number[] = []
    const indices: number[] = []

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const theta = 0 + arc * t
      const ox = Math.cos(theta) * outerR
      const oz = Math.sin(theta) * outerR
      const ix = Math.cos(theta) * innerR
      const iz = Math.sin(theta) * innerR
      // top outer
      verts.push(ox, depth, oz)
      // top inner
      verts.push(ix, depth, iz)
      // bottom outer (base y = 0)
      verts.push(ox, 0, oz)
      // bottom inner
      verts.push(ix, 0, iz)
    }

    const step = 4
    for (let i = 0; i < segments; i++) {
      const a = i * step
      const b = (i + 1) * step
      // top face (two tris)
      indices.push(a + 0, b + 0, a + 1)
      indices.push(a + 1, b + 0, b + 1)
      // bottom face
      indices.push(a + 3, b + 3, a + 2)
      indices.push(a + 2, b + 3, b + 2)
      // outer side
      indices.push(a + 0, b + 0, a + 2)
      indices.push(a + 2, b + 0, b + 2)
      // inner side
      indices.push(a + 1, a + 3, b + 1)
      indices.push(b + 1, a + 3, b + 3)
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return geom
  }, [radius, thickness, arc, s])

  // triangle extrude geometry (create once)
  const triGeom = useMemo(() => {
    const triScale = 1.5
    const length = 0.72 * s * triScale
    const halfWidth = 0.36 * s * triScale
    const triDepth = thickness * 3
    const shape = new THREE.Shape()
    shape.moveTo(0, halfWidth)
    shape.lineTo(0, -halfWidth)
    shape.lineTo(length, 0)
    shape.closePath()
    const geom = new THREE.ExtrudeGeometry(shape, { depth: triDepth, bevelEnabled: false, steps: 1 })
    geom.rotateX(-Math.PI / 2)
    geom.computeVertexNormals()
    return geom
  }, [s, thickness])

  // build pearlescent colored edge geometries for ring and triangle
  const ringEdgesGeom = useMemo(() => {
    // build selective edges: top outer/inner, bottom outer/inner and the two end faces
    const posAttr = ringGeom.attributes.position as THREE.BufferAttribute
    const verts = posAttr.array as Float32Array
    const samples = Math.floor(posAttr.count / 4)
    const lines: number[] = []

    const pushSegment = (ia: number, ib: number) => {
      const ax = verts[ia * 3 + 0], ay = verts[ia * 3 + 1], az = verts[ia * 3 + 2]
      const bx = verts[ib * 3 + 0], by = verts[ib * 3 + 1], bz = verts[ib * 3 + 2]
      lines.push(ax, ay, az, bx, by, bz)
    }

    for (let i = 0; i < samples - 1; i++) {
      const a = i * 4
      const b = (i + 1) * 4
      // top outer
      pushSegment(a + 0, b + 0)
      // top inner
      pushSegment(a + 1, b + 1)
      // bottom outer
      pushSegment(a + 2, b + 2)
      // bottom inner
      pushSegment(a + 3, b + 3)
    }

    // end face at start (connect top outer -> top inner -> bottom inner -> bottom outer -> top outer)
    const start = 0
    pushSegment(start + 0, start + 1)
    pushSegment(start + 1, start + 3)
    pushSegment(start + 3, start + 2)
    pushSegment(start + 2, start + 0)

    // end face at last sample
    const lastBase = (samples - 1) * 4
    pushSegment(lastBase + 0, lastBase + 1)
    pushSegment(lastBase + 1, lastBase + 3)
    pushSegment(lastBase + 3, lastBase + 2)
    pushSegment(lastBase + 2, lastBase + 0)

    const geom = new THREE.BufferGeometry()
    const posArray = new Float32Array(lines)
    geom.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    // pearlescent colors per segment vertex
    const count = posArray.length / 3
    const colors = new Float32Array(count * 3)
    const baseA = new THREE.Color('#3b82f6')
    const baseB = new THREE.Color('#7c3aed')
    for (let i = 0; i < count; i++) {
      const x = posArray[i * 3 + 0]
      const y = posArray[i * 3 + 1]
      const z = posArray[i * 3 + 2]
      const sseed = Math.abs(Math.sin((x * 12.9898 + y * 78.233 + z * 45.164))) % 1
      const mixv = 0.25 + 0.6 * sseed
      let r = baseA.r * (1 - mixv) + baseB.r * mixv
      let g = baseA.g * (1 - mixv) + baseB.g * mixv
      let b = baseA.b * (1 - mixv) + baseB.b * mixv
      const pearl = 0.12 * Math.abs(Math.sin(sseed * Math.PI * 2))
      r = r + (1 - r) * pearl
      g = g + (1 - g) * pearl
      b = b + (1 - b) * pearl
      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geom
  }, [ringGeom])

  const triEdgesGeom = useMemo(() => {
    const edges = new THREE.EdgesGeometry(triGeom)
    const pos = edges.attributes.position as THREE.BufferAttribute
    const count = pos.count
    const colors = new Float32Array(count * 3)
    const baseA = new THREE.Color('#3b82f6')
    const baseB = new THREE.Color('#7c3aed')
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const sseed = Math.abs(Math.sin((x * 12.9898 + y * 78.233 + z * 45.164 + 2.0))) % 1
      const mixv = 0.25 + 0.6 * sseed
      let r = baseA.r * (1 - mixv) + baseB.r * mixv
      let g = baseA.g * (1 - mixv) + baseB.g * mixv
      let b = baseA.b * (1 - mixv) + baseB.b * mixv
      const pearl = 0.12 * Math.abs(Math.sin(sseed * Math.PI * 2))
      r = r + (1 - r) * pearl
      g = g + (1 - g) * pearl
      b = b + (1 - b) * pearl
      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    edges.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return edges
  }, [triGeom])

  const ringEdgeRef = React.useRef<THREE.LineSegments>(null!)
  const ringEdgeMat = React.useRef<THREE.LineBasicMaterial>(null!)
  const triEdgeRef = React.useRef<THREE.LineSegments>(null!)
  const triEdgeMat = React.useRef<THREE.LineBasicMaterial>(null!)

  const { theme } = useTheme()

  // overlay shader uniforms (rim only — match RoundedCell)
  const overlayUniforms = React.useRef({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0xffffff) },
    uPower: { value: 2.2 },
    uRimStrength: { value: 1.0 },
  })

  const overlayMat = React.useRef(
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


  React.useEffect(() => {
    if (ringEdgeRef.current) (ringEdgeRef.current as any).raycast = () => null
    if (triEdgeRef.current) (triEdgeRef.current as any).raycast = () => null
    // hide edge shader visuals for light theme
    if (ringEdgeRef.current) ringEdgeRef.current.visible = theme !== 'light'
    if (triEdgeRef.current) triEdgeRef.current.visible = theme !== 'light'
    if (ringEdgeMat.current) ringEdgeMat.current.opacity = theme === 'light' ? 0 : ringEdgeMat.current.opacity
    if (triEdgeMat.current) triEdgeMat.current.opacity = theme === 'light' ? 0 : triEdgeMat.current.opacity
  }, [theme])

  useFrame((state) => {
    if (!group.current) return
    const target = hover.current ? 1.06 : 1.0
    const cur = group.current.scale.x
    const next = cur + (target - cur) * 0.12
    group.current.scale.set(next, next, next)
    group.current.rotation.y += 0.01
    const t = state.clock.getElapsedTime()
    if (ringEdgeMat.current) {
      const base = hover.current ? 0.7 : 0.22
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.0)
      ringEdgeMat.current.opacity = Math.min(1, base + pulse * 0.6)
    }
    if (triEdgeMat.current) {
      const base = hover.current ? 0.7 : 0.22
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.2 + 0.9)
      triEdgeMat.current.opacity = Math.min(1, base + pulse * 0.6)
    }
    // update overlay shader time
    overlayUniforms.current.uTime.value = state.clock.getElapsedTime()
  })

  // position and orientation for the triangular arrowhead at arc end
  // place triangle at the other end of the present arc (start angle = 0)
  const angle = 0 // other end
  const endX = Math.cos(angle) * radius
  const endZ = Math.sin(angle) * radius
  const endPos = new THREE.Vector3(endX, 0, endZ)
  const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize()
  // rotation around Y to align triangle's local +X to the tangent direction
  const yAngle = Math.atan2(tangent.z, tangent.x)

  return (
    <group scale={[globalScale, globalScale, globalScale]}>
      <group
        ref={group}
        position={[0, y, 0]}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
      >
        {/* extruded ring (keeps the missing segment) */}
        <mesh position={[0, 0.01 * s, 0]}>
          <primitive object={ringGeom} attach="geometry" />
          <primitive object={overlayMat.current} attach="material" />
          <lineSegments ref={ringEdgeRef} geometry={ringEdgesGeom} renderOrder={999}>
            <lineBasicMaterial ref={ringEdgeMat as any} vertexColors={true} transparent={true} opacity={0.85} />
          </lineSegments>
        </mesh>

        {/* triangular arrowhead at the end of the missing segment */}
        <mesh
          ref={arrow}
          // place so base sits exactly at the ring end (flush with base y=0)
          position={[endPos.x, 0, endPos.z]}
          // rotate only around Y to align flat triangle with ring plane
          rotation={[0, yAngle, 0]}
        >
          <primitive object={triGeom} attach="geometry" />
          <primitive object={overlayMat.current} attach="material" />
          <lineSegments ref={triEdgeRef} geometry={triEdgesGeom} renderOrder={999}>
            <lineBasicMaterial ref={triEdgeMat as any} vertexColors={true} transparent={true} opacity={0.85} />
          </lineSegments>
        </mesh>

        {/* round transparent overlay for hover/click (bigger, flat) */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.02 * s, 0]}
          onPointerOver={() => (hover.current = true)}
          onPointerOut={() => (hover.current = false)}
          onPointerDown={(e) => {
            e.stopPropagation()
            if (onClick) onClick()
          }}
        >
          <circleGeometry args={[radius + thickness * 1.5, 64]} />
          <meshStandardMaterial color={'#000000'} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}


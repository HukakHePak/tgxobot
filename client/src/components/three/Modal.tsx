import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Cell from './Cell'

type ModalProps = {
  open: boolean
  title?: string
  message?: string
  onClose?: () => void
}

// use the shared `Cell` component so modal cube matches board cells

const Modal: React.FC<ModalProps> = ({ open, title, message, onClose }) => {
  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      <div style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: 1, borderRadius: 0, overflow: 'hidden' }}>
        <Canvas style={{ background: 'transparent', width: '100vw', height: '100vh' }} gl={{ alpha: true }} camera={{ position: [0, 0, 12], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />

          {/* rotating cell wrapper: slow, slightly chaotic rotation */}
          <RotatingCell />

          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
    </div>
  )
}

export default Modal

// --- helper: RotatingCell ---
function RotatingCell() {
  const ref = useRef<any>()
  const seed = useMemo(() => Math.random() * 10, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    // chaotic but slow motion using several sin waves
    ref.current.rotation.x = 0.12 * Math.sin(t * 0.25 + seed) + 0.03 * Math.sin(t * 1.7 + seed * 0.7)
    ref.current.rotation.y = 0.16 * Math.sin(t * 0.2 - seed * 0.3) + 0.04 * Math.sin(t * 1.1 + seed)
    ref.current.rotation.z = 0.08 * Math.sin(t * 0.33 + seed * 1.3) + 0.02 * Math.sin(t * 0.9 - seed * 0.5)
  })

  return (
    <group ref={ref} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      <Cell
        idx={-999}
        value={null}
        position={[0, 0, 0]}
        onClick={() => {}}
        disabled={true}
        disableHover={true}
        showEdges={true}
        edgeColor="#ffd166"
        cellColor="#0b1220"
        cellEmissive="#10264f"
        showFill={true}
        edgeBaseOpacity={0.85}
        fillOpacity={0.5}
      />
    </group>
  )
}

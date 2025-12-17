import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

type ModalProps = {
  open: boolean
  title?: string
  message?: string
  onClose?: () => void
}

const ModalCube: React.FC = () => {
  return (
    <mesh>
      <boxBufferGeometry args={[2.8, 2.8, 2.8]} />
      <meshStandardMaterial color="#111827" transparent opacity={0.72} />
    </mesh>
  )
}

const Modal: React.FC<ModalProps> = ({ open, title, message, onClose }) => {
  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      <div style={{ width: 420, height: 360, position: 'relative', zIndex: 20, borderRadius: 12, overflow: 'hidden' }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <ModalCube />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 16 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ marginTop: 8, opacity: 0.9 }}>{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Modal

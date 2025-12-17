import React from 'react'
import { Canvas } from '@react-three/fiber'
import RotatingCell from './RotatingCell'

type ModalProps = {
  open: boolean
  title?: string
  message?: string
  onClose?: () => void
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      <div style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: 1, borderRadius: 0, overflow: 'hidden' }}>
          <Canvas style={{ background: 'transparent', width: '100vw', height: '100vh' }} gl={{ alpha: true }} camera={{ position: [0, 0, 12], fov: 50 }}>
            <ambientLight intensity={0.75} />
            <directionalLight position={[10, 10, 5]} intensity={1.0} />
            <RotatingCell />
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
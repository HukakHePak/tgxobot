import React, { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import RotatingCell from './RotatingCell'
import RotatingRoundedBox from './RotatingRoundedBox'
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
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prevent = (e: TouchEvent) => {
      if (e.touches && e.touches.length === 1) e.preventDefault()
    }

    el.addEventListener('touchmove', prevent, { passive: false })
    return () => el.removeEventListener('touchmove', prevent)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'transparent' }} onClick={onClose} />

        <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: 1, borderRadius: 0, overflow: 'hidden', touchAction: 'none', overscrollBehavior: 'contain' }}>
          <Canvas style={{ background: 'transparent', width: '100vw', height: '100vh' }} gl={{ alpha: true }} camera={{ position: [0, 0, 12], fov: 50 }}>
              {theme === 'light' ? (
                <RotatingRoundedBox />
              ) : (
                <RotatingCell scale={1.4} />
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

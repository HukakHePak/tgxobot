import React, { useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import Modal from '../three/Modal'
import { COLORS, SIZES } from '../../constants/ui'

interface ResultDialogProps {
  open: boolean
  result: 'win' | 'loss' | null
  promo: string | null
  onReset: () => void
}

export const ResultDialog: React.FC<ResultDialogProps> = ({ open, result, promo, onReset }) => {
  if (!open) return null
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const handleCopy = async () => {
    if (!promo) return
    try {
      await navigator.clipboard.writeText(promo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // ignore
    }
  }

  return (
    <Modal open={open} title={result === 'win' ? 'You won!' : 'You lost'} message={result === 'win' ? (promo ?? '') : 'Better luck — try again'} onClose={onReset}>
      {/* content rendered as children so Modal is purely presentational */}
      <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: SIZES.modalWidth, padding: '16px 20px', borderRadius: 8, background: 'transparent', boxShadow: 'none', border: 'none', color: COLORS.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, marginBottom: 8, textShadow: '0 6px 18px rgba(2,6,23,0.8), 0 0 12px rgba(59,130,246,0.15)' }}>{result === 'win' ? 'You won!' : 'You lost'}</h2>

          {result === 'win' ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ color: COLORS.accent, textShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>Your promo code</div>
              <div
                onClick={handleCopy}
                role="button"
                tabIndex={0}
                style={{
                  marginTop: 8,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.promo,
                  textShadow: '0 6px 18px rgba(0,0,0,0.6)',
                  border: '1px solid #ffd166',
                  padding: '6px 12px',
                  borderRadius: 8,
                  display: 'inline-block',
                  cursor: 'pointer',
                  userSelect: 'all'
                }}
              >
                {promo}
              </div>
              {copied && <div style={{ color: COLORS.success, marginTop: 8 }}>Copied!</div>}
            </div>
          ) : (
            <div style={{ marginTop: 12, color: COLORS.muted, textShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>Better luck — try again</div>
          )}

          <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={onReset}
              style={{
                padding: '8px 14px',
                borderRadius: theme === 'light' ? 20 : 8,
                background: 'linear-gradient(90deg, #3b82f6 0%, #7c3aed 100%)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Play again
            </button>
          </div>
        </div>
      </div>
      {/* decorative 3D content is handled by Modal's Canvas */}
    </Modal>
  )
}

export default ResultDialog

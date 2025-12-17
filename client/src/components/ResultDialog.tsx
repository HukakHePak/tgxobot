import React, { useState } from 'react'
import ThreeModalCanvas from './ThreeModal'

interface ResultDialogProps {
  open: boolean
  result: 'win' | 'loss' | null
  promo: string | null
  onReset: () => void
}

export const ResultDialog: React.FC<ResultDialogProps> = ({ open, result, promo, onReset }) => {
  if (!open) return null
  const [copied, setCopied] = useState(false)

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <ThreeModalCanvas value={result === 'win' ? 'X' : result === 'loss' ? 'O' : null} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: 'auto', padding: 0, borderRadius: 0, background: 'transparent', boxShadow: 'none', border: 'none', color: '#e6eef8', textAlign: 'center', pointerEvents: 'auto' }}>
        <h2 style={{ margin: 0, marginBottom: 8, textShadow: '0 6px 18px rgba(2,6,23,0.8), 0 0 12px rgba(59,130,246,0.15)' }}>{result === 'win' ? 'You won!' : 'You lost'}</h2>

        {result === 'win' ? (
          <div style={{ marginTop: 8 }}>
            <div style={{ color: '#9ad7ff', textShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>Your promo code</div>
            <div
              onClick={handleCopy}
              role="button"
              tabIndex={0}
              style={{
                marginTop: 8,
                fontSize: 22,
                fontWeight: 700,
                color: '#ffd166',
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
            {copied && <div style={{ color: '#a7f3d0', marginTop: 8 }}>Copied!</div>}
          </div>
        ) : (
          <div style={{ marginTop: 12, color: '#9fb3c8', textShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>Better luck — try again</div>
        )}

        <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onReset}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
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
  )
}

export default ResultDialog

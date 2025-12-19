import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

type Props = {
  text?: string
  theme?: 'dark' | 'light'
  themeOverride?: 'dark' | 'light'
}

export default function LoadingBlock({ text = 'Loading assets', theme = 'light', themeOverride }: Props) {
  const effectiveTheme = themeOverride ?? theme
  const isDark = effectiveTheme === 'dark'
  const gradientId = React.useId()

  return (
    <Box role="status" aria-live="polite" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 0.5, borderRadius: 1 }}>
      {isDark ? (
        <Box component="span" aria-hidden sx={{ display: 'inline-block', width: 28, height: 28 }}>
          <svg viewBox="0 0 44 44" width={28} height={28} style={{ display: 'block' }} aria-hidden>
            <defs>
              <linearGradient id={`loadingGradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <g>
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke={`url(#loadingGradient-${gradientId})`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="80 200"
              >
                <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="1s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </Box>
      ) : (
        <CircularProgress
          size={28}
          thickness={5}
          color={isDark ? 'secondary' : 'inherit'}
          sx={{ color: isDark ? undefined : '#ffffff' }}
          aria-hidden
        />
      )}

      <Typography
        variant="subtitle1"
        sx={
          isDark
            ? { background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 24, fontWeight: 300 }
            : { color: '#ffffff', fontSize: 24, fontWeight: 300 }
        }
      >
        {text}
      </Typography>
    </Box>
  )
}

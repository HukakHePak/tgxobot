import React from 'react'
import { AppBar, Toolbar, Box, Typography } from '@mui/material'

const HEADER_HEIGHT = 96

export default function Header() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(6px)', background: 'linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.2))' }}>
      <Toolbar sx={{ height: HEADER_HEIGHT, display: 'flex', gap: 2 }}>
        <Box component="img" src="/logo.svg" alt="OXO" sx={{ height: 64 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#e6eef9' }}>OXO</Typography>
          <Typography variant="caption" sx={{ color: '#9fb3c8' }}>Крестики‑нолики — космическая версия</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export { HEADER_HEIGHT }

import React from 'react'
import { AppBar, Toolbar, Box } from '@mui/material'

const HEADER_HEIGHT = 96

export default function Header() {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(6px)',
        background: 'linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.2))'
      }}
    >
      <Toolbar sx={{ height: HEADER_HEIGHT, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box component="img" src="/logo.svg" alt="OXO" sx={{ height: 64, margin: '0 auto' }} />
      </Toolbar>
    </AppBar>
  )
}

export { HEADER_HEIGHT }

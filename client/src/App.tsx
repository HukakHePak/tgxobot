import React from 'react'
import { ThemeProvider, createTheme, Box } from '@mui/material'
import Game from './components/Game'

const theme = createTheme({
  palette: {
    primary: { main: '#3b82f6' },
    secondary: { main: '#7c3aed' }
  }
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="app-shell">
        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 12, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <Box component="img" src="/logo.svg" alt="OXO" sx={{ height: 64, pointerEvents: 'auto' }} />
        </Box>
        <Box className="app-content">
          <Game />
        </Box>
      </div>
    </ThemeProvider>
  )
}

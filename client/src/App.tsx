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
        <Box className="app-content">
          <Game />
        </Box>
      </div>
    </ThemeProvider>
  )
}

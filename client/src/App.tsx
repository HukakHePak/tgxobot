import React from 'react'
import { ThemeProvider, createTheme, Container, Typography, Box } from '@mui/material'
import Game from './components/Game'

const theme = createTheme({
  palette: {
    primary: { main: '#d291bc' },
    secondary: { main: '#f7c6d7' }
  }
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h4" gutterBottom>Крестики‑нолики</Typography>
          <Typography variant="subtitle1" gutterBottom>Игра против компьютера — удачи!</Typography>
          <Game />
        </Box>
      </Container>
    </ThemeProvider>
  )
}

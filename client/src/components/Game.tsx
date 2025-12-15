import React, { useState, useEffect } from 'react'
import { Box, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material'

type Player = 'X' | 'O' | null

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

function checkWinner(squares: Player[]) {
  for (const [a,b,c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a]
  }
  return null
}

export default function Game(){
  const [squares, setSquares] = useState<Player[]>(Array(9).fill(null))
  const [isPlayerTurn, setPlayerTurn] = useState(true)
  const [result, setResult] = useState<'win'|'loss'|null>(null)
  const [promo, setPromo] = useState<string | null>(null)

  useEffect(()=>{
    const winner = checkWinner(squares)
    if (winner === 'X') {
      setResult('win')
      const code = String(Math.floor(10000 + Math.random()*90000))
      setPromo(code)
      notifyServer('win', code)
    } else if (winner === 'O') {
      setResult('loss')
      notifyServer('loss')
    } else if (squares.every(Boolean)) {
      setResult('loss')
      notifyServer('loss')
    }
  },[squares])

  useEffect(()=>{
    if (!isPlayerTurn && !result) {
      const empty = squares.map((v,i)=>v?null:i).filter(Boolean) as number[]
      const choice = empty[Math.floor(Math.random()*empty.length)]
      if (choice !== undefined) {
        const next = squares.slice(); next[choice]= 'O'; setSquares(next)
      }
      setPlayerTurn(true)
    }
  },[isPlayerTurn, squares, result])

  function handleClick(i:number){
    if (!isPlayerTurn) return
    if (squares[i] || result) return
    const next = squares.slice(); next[i] = 'X'; setSquares(next); setPlayerTurn(false)
  }

  function reset(){ setSquares(Array(9).fill(null)); setResult(null); setPromo(null); setPlayerTurn(true) }

  async function notifyServer(r:'win'|'loss', code?:string){
    try{
      const base = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3001'
      await fetch(`${base}/api/send-result`, {
        method: 'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ result: r, code })
      })
    }catch(err){
      // ignore network errors locally
      console.warn('notify error', err)
    }
  }

  return (
    <Box sx={{ mt:4 }}>
      <Grid container spacing={1} sx={{ width: 300, margin: '0 auto' }}>
        {squares.map((s,i)=> (
          <Grid item xs={4} key={i}>
            <Paper onClick={()=>handleClick(i)} elevation={3} sx={{ height:80, display:'flex', alignItems:'center', justifyContent:'center', cursor: result? 'default' : 'pointer', bgcolor: '#fff0f6' }}>
              <Typography variant="h4">{s}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign:'center', mt:3 }}>
        <Button variant="contained" color="secondary" onClick={reset}>Сбросить</Button>
      </Box>

      <Dialog open={!!result}>
        <DialogTitle>{result === 'win' ? 'Вы победили!' : 'Вы проиграли'}</DialogTitle>
        <DialogContent>
          {result === 'win' ? (
            <Box>
              <Typography>Ваш промокод:</Typography>
              <Typography variant="h5" sx={{ mt:1, color:'#b85b8a' }}>{promo}</Typography>
            </Box>
          ) : (
            <Typography>Попробуйте ещё раз?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={reset}>Играть ещё</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

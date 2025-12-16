import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Player } from '../types/game';

interface BoardProps {
  squares: Player[];
  onClick: (i: number) => void;
  disabled: boolean;
}

export const Board: React.FC<BoardProps> = ({ squares, onClick, disabled }) => (
  <Grid container spacing={1} sx={{ width: 300, margin: '0 auto' }}>
    {squares.map((s, i) => (
      <Grid item xs={4} key={i}>
        <Paper
          onClick={() => !disabled && onClick(i)}
          elevation={3}
          sx={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: disabled || s ? 'default' : 'pointer',
            bgcolor: '#fff0f6',
          }}
        >
          <Typography variant="h4">{s}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

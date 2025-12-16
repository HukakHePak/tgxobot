import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

interface ResultDialogProps {
  open: boolean;
  result: 'win' | 'loss' | null;
  promo: string | null;
  onReset: () => void;
}

export const ResultDialog: React.FC<ResultDialogProps> = ({ open, result, promo, onReset }) => (
  <Dialog open={open}>
    <DialogTitle>{result === 'win' ? 'Вы победили!' : 'Вы проиграли'}</DialogTitle>
    <DialogContent>
      {result === 'win' ? (
        <Box>
          <Typography>Ваш промокод:</Typography>
          <Typography variant="h5" sx={{ mt: 1, color: '#b85b8a' }}>{promo}</Typography>
        </Box>
      ) : (
        <Typography>Попробуйте ещё раз?</Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onReset}>Играть ещё</Button>
    </DialogActions>
  </Dialog>
);

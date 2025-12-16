import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { getTelegramChatId } from '../api/telegram';
import { sendResult } from '../api/sendResult';
import ThreeBoard from './ThreeBoard';
import { ResultDialog } from './ResultDialog';
import { useTicTacToe } from '../hooks/useTicTacToe';

export default function Game() {
  const [chatId, setChatId] = useState<number | undefined>(undefined);

  useEffect(() => {
    setChatId(getTelegramChatId());
  }, []);

  const notifyServer = async (r: 'win' | 'loss', code?: string) => {
    await sendResult(r, chatId, code);
  };

  const { squares, isPlayerTurn, result, promo, handleClick, reset } = useTicTacToe(notifyServer);

  return (
    <Box sx={{ mt: 4 }}>
      <ThreeBoard squares={squares} onClick={handleClick} disabled={!!result || !isPlayerTurn} />
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={reset}>
          Сбросить
        </Button>
      </Box>
      <ResultDialog open={!!result} result={result} promo={promo} onReset={reset} />
    </Box>
  );
}
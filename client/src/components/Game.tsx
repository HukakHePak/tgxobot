import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { getTelegramChatId } from '../api/telegram';
import { Board } from './Board';
import { ResultDialog } from './ResultDialog';
import { useTicTacToe } from '../hooks/useTicTacToe';

export default function Game() {
  const [chatId, setChatId] = useState<number | undefined>(undefined);

  useEffect(() => {
    setChatId(getTelegramChatId());
  }, []);

  const notifyServer = async (r: 'win' | 'loss', code?: string) => {
    try {
      let base = '';
      const webAppUrl = import.meta.env.VITE_WEBAPP_URL as string | undefined;
      if (webAppUrl) {
        try {
          const url = new URL(webAppUrl);
          base = url.origin;
        } catch {}
      }
      if (!base) base = 'http://localhost:3001';
      await fetch(`${base}/api/send-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: r, code, chat_id: chatId })
      });
    } catch (err) {
      // ignore network errors locally
      console.warn('notify error', err);
    }
  };

  const { squares, isPlayerTurn, result, promo, handleClick, reset } = useTicTacToe(notifyServer);

  return (
    <Box sx={{ mt: 4 }}>
      <Board squares={squares} onClick={handleClick} disabled={!!result || !isPlayerTurn} />
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={reset}>
          Сбросить
        </Button>
      </Box>
      <ResultDialog open={!!result} result={result} promo={promo} onReset={reset} />
    </Box>
  );
}
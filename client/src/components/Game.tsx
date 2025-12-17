import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { getTelegramChatId } from '../api/telegram';
import { sendResult } from '../api/sendResult';
import ThreeBoard from './three/Board';
import { ResultDialog } from './ResultDialog';
import { useTicTacToe } from '../hooks/useTicTacToeReducer';

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
    <Box sx={{ width: '100%' }}>
      <div className="full-canvas">
        <ThreeBoard squares={squares} onClick={handleClick} disabled={!!result || !isPlayerTurn} reset={reset} />
      </div>
      <ResultDialog open={!!result} result={result} promo={promo} onReset={reset} />
    </Box>
  )
}
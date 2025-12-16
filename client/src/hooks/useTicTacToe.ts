import { useState, useEffect, useCallback } from 'react';
import { Player } from '../types/game';
import { checkWinner } from '../utils/checkWinner';

export function useTicTacToe(onResult: (result: 'win' | 'loss', code?: string) => void) {
  const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setPlayerTurn] = useState(true);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [promo, setPromo] = useState<string | null>(null);

  useEffect(() => {
    const winner = checkWinner(squares);
    if (winner === 'X' && result !== 'win') {
      const code = String(Math.floor(10000 + Math.random() * 90000));
      setResult('win');
      setPromo(code);
      onResult('win', code);
    } else if ((winner === 'O' || (squares.every(Boolean) && !winner)) && result !== 'loss') {
      setResult('loss');
      onResult('loss');
    }
    // eslint-disable-next-line
  }, [squares, result]);

  useEffect(() => {
    if (!isPlayerTurn && !result) {
      const empty = squares.map((v, i) => v ? null : i).filter((v) => v !== null) as number[];
      const choice = empty[Math.floor(Math.random() * empty.length)];
      if (choice !== undefined) {
        const next = squares.slice();
        next[choice] = 'O';
        setSquares(next);
      }
      setPlayerTurn(true);
    }
  }, [isPlayerTurn, squares, result]);

  const handleClick = useCallback((i: number) => {
    if (!isPlayerTurn) return;
    if (squares[i] || result) return;
    const next = squares.slice();
    next[i] = 'X';
    setSquares(next);
    setPlayerTurn(false);
  }, [isPlayerTurn, squares, result]);

  const reset = useCallback(() => {
    setSquares(Array(9).fill(null));
    setResult(null);
    setPromo(null);
    setPlayerTurn(true);
  }, []);

  return { squares, isPlayerTurn, result, promo, handleClick, reset };
}

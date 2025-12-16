import { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '../types/game';
import { checkWinner } from '../utils/checkWinner';

export function useTicTacToe(onResult: (result: 'win' | 'loss', code?: string) => void) {
  const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setPlayerTurn] = useState(true);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [promo, setPromo] = useState<string | null>(null);
  const aiTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const winner = checkWinner(squares);
    // Only set result if it's not already set. Prevents race where both
    // win/loss could be triggered sequentially and flip the dialog.
    if (result == null) {
      if (winner === 'X') {
        const code = String(Math.floor(10000 + Math.random() * 90000));
        setResult('win');
        setPromo(code);
        onResult('win', code);
      } else if (winner === 'O' || (squares.every(Boolean) && !winner)) {
        setResult('loss');
        onResult('loss');
      }
    }
    // eslint-disable-next-line
  }, [squares, result]);

  useEffect(() => {
    if (!isPlayerTurn && !result) {
      // If the board already has a winner or is full, don't let AI play.
      const immediateWinner = checkWinner(squares);
      if (immediateWinner || squares.every(Boolean)) return;

      const empty = squares.map((v, i) => v ? null : i).filter((v) => v !== null) as number[];

      const computeAIMove = (): number | undefined => {
        // 1) Win if possible
        for (const idx of empty) {
          const test = squares.slice();
          test[idx] = 'O';
          if (checkWinner(test) === 'O') return idx;
        }
        // 2) Block opponent win
        for (const idx of empty) {
          const test = squares.slice();
          test[idx] = 'X';
          if (checkWinner(test) === 'X') return idx;
        }
        // 3) Take center
        if (empty.includes(4)) return 4;
        // 4) Take any corner
        const corners = [0, 2, 6, 8];
        for (const c of corners) if (empty.includes(c)) return c;
        // 5) Take any side
        const sides = [1, 3, 5, 7];
        for (const s of sides) if (empty.includes(s)) return s;
        return undefined;
      };

      const choice = computeAIMove();
      if (choice !== undefined) {
        // schedule AI move with small delay; use functional setState to avoid
        // stale closures and check current board before applying move
        const delay = 300 + Math.floor(Math.random() * 300);
        // clear any previous scheduled move
        if (aiTimeoutRef.current) {
          clearTimeout(aiTimeoutRef.current);
        }
        aiTimeoutRef.current = window.setTimeout(() => {
          let applied = false;
          setSquares((prev) => {
            // if game already decided or cell occupied, don't apply
            if (checkWinner(prev) || prev.every(Boolean) || prev[choice] != null) return prev;
            const next = prev.slice();
            next[choice] = 'O';
            applied = true;
            return next;
          });
          if (applied) setPlayerTurn(true);
          aiTimeoutRef.current = null;
        }, delay);
      } else {
        setPlayerTurn(true);
      }
    }
  }, [isPlayerTurn, squares, result]);

  // cleanup on unmount: clear any pending AI timeout
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  const handleClick = useCallback((i: number) => {
    if (!isPlayerTurn) return;
    if (squares[i] || result) return;
    const next = squares.slice();
    next[i] = 'X';
    setSquares(next);
    setPlayerTurn(false);
  }, [isPlayerTurn, squares, result]);

  const reset = useCallback(() => {
    // clear any scheduled AI move
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    setSquares(Array(9).fill(null));
    setResult(null);
    setPromo(null);
    setPlayerTurn(true);
  }, []);

  return { squares, isPlayerTurn, result, promo, handleClick, reset };
}

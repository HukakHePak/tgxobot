import { useReducer, useEffect, useCallback, useRef } from 'react'
import { Player } from '../types/game'
import { checkWinner } from '../utils/checkWinner'

type State = {
  squares: Player[]
  isPlayerTurn: boolean
  result: 'win' | 'loss' | null
  promo: string | null
}

type Action =
  | { type: 'PLAYER_MOVE'; index: number }
  | { type: 'AI_MOVE'; index: number }
  | { type: 'SET_RESULT'; result: 'win' | 'loss'; promo?: string }
  | { type: 'SET_PLAYER_TURN'; playerTurn: boolean }
  | { type: 'RESET' }

const initialState: State = {
  squares: Array(9).fill(null),
  isPlayerTurn: true,
  result: null,
  promo: null
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'PLAYER_MOVE': {
      const { index } = action
      if (state.squares[index] || state.result) return state
      const squares = state.squares.slice()
      squares[index] = 'X'
      return { ...state, squares, isPlayerTurn: false }
    }
    case 'AI_MOVE': {
      const { index } = action
      if (state.squares[index] || state.result) return state
      const squares = state.squares.slice()
      squares[index] = 'O'
      return { ...state, squares, isPlayerTurn: true }
    }
    case 'SET_RESULT': {
      return { ...state, result: action.result, promo: action.promo ?? null }
    }
    case 'SET_PLAYER_TURN': {
      return { ...state, isPlayerTurn: action.playerTurn }
    }
    case 'RESET': {
      return { ...initialState }
    }
    default:
      return state
  }
}

export function useTicTacToeReducer(onResult: (result: 'win' | 'loss', code?: string) => void) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const aiTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const winner = checkWinner(state.squares)
    if (state.result == null) {
      if (winner === 'X') {
        const code = String(Math.floor(10000 + Math.random() * 90000))
        dispatch({ type: 'SET_RESULT', result: 'win', promo: code })
        onResult('win', code)
      } else if (winner === 'O' || (state.squares.every(Boolean) && !winner)) {
        dispatch({ type: 'SET_RESULT', result: 'loss' })
        onResult('loss')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.squares, state.result])

  useEffect(() => {
    if (!state.isPlayerTurn && !state.result) {
      const immediateWinner = checkWinner(state.squares)
      if (immediateWinner || state.squares.every(Boolean)) return

      const empty = state.squares.map((v, i) => (v ? null : i)).filter((v) => v !== null) as number[]

      const computeAIMove = (): number | undefined => {
        for (const idx of empty) {
          const test = state.squares.slice()
          test[idx] = 'O'
          if (checkWinner(test) === 'O') return idx
        }
        for (const idx of empty) {
          const test = state.squares.slice()
          test[idx] = 'X'
          if (checkWinner(test) === 'X') return idx
        }
        if (empty.includes(4)) return 4
        const corners = [0, 2, 6, 8]
        for (const c of corners) if (empty.includes(c)) return c
        const sides = [1, 3, 5, 7]
        for (const s of sides) if (empty.includes(s)) return s
        return undefined
      }

      const choice = computeAIMove()
      if (choice !== undefined) {
        if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
        const delay = 300 + Math.floor(Math.random() * 300)
        aiTimeoutRef.current = window.setTimeout(() => {
          dispatch({ type: 'AI_MOVE', index: choice })
          aiTimeoutRef.current = null
        }, delay) as unknown as number
      } else {
        dispatch({ type: 'SET_PLAYER_TURN', playerTurn: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPlayerTurn, state.squares, state.result])

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current)
    }
  }, [])

  const handleClick = useCallback(
    (i: number) => {
      if (!state.isPlayerTurn) return
      if (state.squares[i] || state.result) return
      dispatch({ type: 'PLAYER_MOVE', index: i })
    },
    [state.isPlayerTurn, state.squares, state.result]
  )

  const reset = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current)
      aiTimeoutRef.current = null
    }
    dispatch({ type: 'RESET' })
  }, [])

  return {
    squares: state.squares,
    isPlayerTurn: state.isPlayerTurn,
    result: state.result,
    promo: state.promo,
    handleClick,
    reset
  }
}

export default useTicTacToeReducer

// Backwards compatible named export used by Game.tsx
export const useTicTacToe = useTicTacToeReducer

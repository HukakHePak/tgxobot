import React, { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Cell from './three/Cell'
import BoardField from './three/BoardField'

type Square = 'X' | 'O' | null

interface ThreeBoardProps {
  squares: Square[]
  onClick: (index: number) => void
  disabled?: boolean
}

const PLANET_COUNT = 4

export const ThreeBoard: React.FC<ThreeBoardProps> = ({ squares, onClick, disabled }) => {
  const positions = [
    [-3.2, 0, -3.2],
    [0, 0, -3.2],
    [3.2, 0, -3.2],
    [-3.2, 0, 0],
    [0, 0, 0],
    [3.2, 0, 0],
    [-3.2, 0, 3.2],
    [0, 0, 3.2],
    [3.2, 0, 3.2]
  ]

  // persistent random variant assignment for planets, assign only on transition to 'O'
  const planetVariantsRef = useRef<(number | null)[]>(Array(9).fill(null))
  const prevSquaresRef = useRef<Square[] | null>(null)

  useEffect(() => {
    const prev = prevSquaresRef.current
    for (let i = 0; i < squares.length; i++) {
      const prevVal = prev ? prev[i] : null
      const curVal = squares[i]
      if (prevVal !== 'O' && curVal === 'O' && planetVariantsRef.current[i] == null) {
        planetVariantsRef.current[i] = Math.floor(Math.random() * PLANET_COUNT)
      }
      if (curVal !== 'O' && planetVariantsRef.current[i] != null) {
        planetVariantsRef.current[i] = null
      }
    }
    prevSquaresRef.current = [...squares]
  }, [squares])

  return (
    <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box' }}>
      <Canvas
        camera={{ position: [0, 24, 0], fov: 50 }}
        onCreated={({ camera }) => {
          const phi = (30 * Math.PI) / 180
          const r = 30
          const y = r * Math.cos(phi)
          const z = r * Math.sin(phi)
          camera.position.set(0, y, z)
          camera.lookAt(0, 0, 0)
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 20, 10]} intensity={1.2} />
        <pointLight position={[-10, 10, -10]} intensity={0.6} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        <BoardField />

        {positions.map((pos, i) => (
          <Cell key={i} idx={i} value={squares[i]} position={pos} onClick={onClick} disabled={disabled} planetVariant={planetVariantsRef.current[i]} />
        ))}

        <OrbitControls enablePan={false} maxDistance={48} minDistance={12} />
      </Canvas>
    </div>
  )
}

export default ThreeBoard


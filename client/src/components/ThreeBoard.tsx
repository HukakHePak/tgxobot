import React, { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Cell from './three/Cell'
import BoardField from './three/BoardField'
import RocketModel from './models/RocketModel'
import PlanetModel, { PLANET_COLORS } from './models/PlanetModel'
import ResetModel from './models/ResetModel'

type Square = 'X' | 'O' | null

interface ThreeBoardProps {
  squares: Square[]
  onClick: (index: number) => void
  disabled?: boolean
  reset: () => void
}

const PLANET_COUNT = 4

export const ThreeBoard: React.FC<ThreeBoardProps> = ({ squares, onClick, disabled, reset }) => {
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

  // Choose a planet color for the whole game; PlanetModel maps color -> model URL.
  const [planetColor, setPlanetColor] = useState<string>(() => {
    return PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)] ?? 'blue'
  })

  const prevSquaresRef = useRef<Square[] | null>(null)

  useEffect(() => {
    const prev = prevSquaresRef.current
    // detect reset: previous had marks and now all cleared
    const prevHadAny = prev ? prev.some((v) => v !== null) : false
    const nowAllNull = squares.every((v) => v === null)
    if (prevHadAny && nowAllNull) {
      // pick a new planet color for the new game
      const pick = PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)]
      setPlanetColor(pick)
    }
    prevSquaresRef.current = [...squares]
  }, [squares])

  return (
    <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box' }}>
      <Canvas
        camera={{ position: [0, 40, 0], fov: 50 }}
        onCreated={({ camera }) => {
          // top-down view: place camera directly above the board and look at center
          camera.position.set(0, 40, 0)
          camera.lookAt(0, 0, 0)
        }}
      >
        <ambientLight intensity={0.6} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        <BoardField />

        {positions.map((pos, i) => (
          <group key={i}>
            {/* edgeColor set from cell value so rim matches highlighted/selected cell */}
            <Cell
              idx={i}
              value={squares[i]}
              position={pos}
              onClick={onClick}
              disabled={disabled}
              edgeColor={squares[i] === 'X' ? '#7dd3fc' : squares[i] === 'O' ? '#ffd166' : undefined}
            />

            {squares[i] === 'X' && (
              <group position={pos}>
                <RocketModel scale={0.4} y={0} />
              </group>
            )}

            {squares[i] === 'O' && (
              <group position={pos}>
                <PlanetModel color={planetColor} scale={0.4} />
              </group>
            )}
          </group>
        ))}

        {/* Reset model centered below the board and moved further away */}
        <group key="reset" position={[0, 0, 6.2]}>
          {/* y set near 0 so cone is at cell level but model lowered slightly */}
          <ResetModel scale={0.85} y={0.0} onClick={reset} />
        </group>

        <OrbitControls enablePan={false} enableRotate={true} maxDistance={80} minDistance={12} />
      </Canvas>
    </div>
  )
}

export default ThreeBoard


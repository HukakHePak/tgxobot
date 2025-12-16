import React, { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Cell from './three/Cell'
import BoardField from './three/BoardField'
import RocketModel from './models/RocketModel'
import PlanetModel, { PLANET_COLORS } from './models/PlanetModel'

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
          <group key={i}>
            <Cell idx={i} value={squares[i]} position={pos} onClick={onClick} disabled={disabled} />

            {squares[i] === 'X' && (
              <group position={pos}>
                <RocketModel scale={0.4} y={0.9} />
              </group>
            )}

            {squares[i] === 'O' && (
              <group position={pos}>
                <group position={[0, 1.05, 0]}>
                  <PlanetModel color={planetColor} scale={0.4} />
                </group>
              </group>
            )}
          </group>
        ))}

        <OrbitControls enablePan={false} maxDistance={48} minDistance={12} />
      </Canvas>
    </div>
  )
}

export default ThreeBoard


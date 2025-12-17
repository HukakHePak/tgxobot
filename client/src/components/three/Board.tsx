import React, { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Cell from './Cell'
import RocketModel from '../models/RocketModel'
import PlanetModel, { PLANET_COLORS } from '../models/PlanetModel'
import BananaModel from '../models/BananaModel'
import DonutModel from '../models/DonutModel'
import { useTheme } from '../../theme/ThemeContext'
import ResetModel from '../models/ResetModel'
import LogoSprite from './LogoSprite'

type Square = 'X' | 'O' | null

interface BoardProps {
  squares: Square[]
  onClick: (index: number) => void
  disabled?: boolean
  reset: () => void
}

export const Board: React.FC<BoardProps> = ({ squares, onClick, disabled, reset }) => {
  const positions: [number, number, number][] = [
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

  const [planetColor, setPlanetColor] = useState<string>(() => {
    return PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)] ?? 'blue'
  })

  const prevSquaresRef = useRef<Square[] | null>(null)

  useEffect(() => {
    const prev = prevSquaresRef.current
    const prevHadAny = prev ? prev.some((v) => v !== null) : false
    const nowAllNull = squares.every((v) => v === null)
    if (prevHadAny && nowAllNull) {
      const pick = PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)]
      setPlanetColor(pick)
    }
    prevSquaresRef.current = [...squares]
  }, [squares])

  const { theme } = useTheme()

  const containerStyle: React.CSSProperties = theme === 'light'
    ? {
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        backgroundImage: `linear-gradient(150deg, #ffd1dcff 0%, #FFB3C7 60%)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    : { width: '100%', height: '100vh', boxSizing: 'border-box', background: '#0b1220' }

  return (
    <div style={containerStyle}>
      <Canvas
        camera={{ position: [0, 40, 0], fov: 50 }}
        onCreated={({ camera }) => {
          camera.position.set(0, 40, 0)
          camera.lookAt(0, 0, 0)
        }}
      >
        {theme === 'light' ? (
          <>
            <ambientLight intensity={1.0} />
            <hemisphereLight skyColor={'#FFFFFF'} groundColor={'#FFF5F8'} intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={0.6} />
            <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade />
          </>
        ) : (
          <>
            <ambientLight intensity={0.6} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          </>
        )}

        <group position={[0, 0, 0]}>
          {positions.map((pos, i) => (
            <group key={i}>
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
                  {theme === 'light' ? <BananaModel scale={0.45} /> : <RocketModel scale={0.4} y={0} />}
                </group>
              )}

              {squares[i] === 'O' && (
                <group position={pos}>
                  {theme === 'light' ? <DonutModel color={planetColor} scale={0.36} /> : <PlanetModel color={planetColor} scale={0.4} />}
                </group>
              )}
            </group>
          ))}

          <group key="reset" position={[0, -0.1, 7.2]}>
            <ResetModel scale={0.85} y={0.0} onClick={reset} />
          </group>

          <LogoSprite position={[0, 0, -10]} scale={[5, 2, 1]} />
        </group>

        <OrbitControls enablePan={false} enableRotate={true} maxDistance={80} minDistance={12} />
      </Canvas>
    </div>
  )
}

export default Board

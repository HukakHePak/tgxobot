// Provide a lightweight declaration so TypeScript can find the
// react-three-fiber jsx runtime module path used by the compiler.
// This re-exports the public types from @react-three/fiber so TS
// recognizes intrinsic elements like <group>, <mesh>, <primitive>, etc.
declare module '@react-three/fiber/jsx-runtime' {
  export * from '@react-three/fiber'
}

// Also ensure vite's import.meta.env types are available (tsconfig "types": ["vite/client"])
export {}

// Temporary global JSX intrinsic elements fallback to allow
// react-three/fiber elements like <group>, <mesh>, <primitive>, etc.
// This widens types to `any` for intrinsic elements to silence TS errors
// until full type integration for @react-three/fiber is in place.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {}

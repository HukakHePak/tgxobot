// Shared model loader utilities — use static import.meta.glob patterns so Vite can bundle them.
export async function loadRocketGltf(): Promise<string | null> {
  const modules = import.meta.glob('../../assets/models/rocket/*.gltf', { as: 'url' }) as Record<string, () => Promise<string>>
  const keys = Object.keys(modules)
  if (keys.length === 0) return null
  try {
    return await modules[keys[0]]()
  } catch {
    return null
  }
}

export async function loadPlanetGltf(): Promise<string | null> {
  // Prefer explicit planet_blue scene
  const explicit = import.meta.glob('../../assets/models/planets/planet_blue/scene.gltf', { as: 'url' }) as Record<string, () => Promise<string>>
  const explicitKeys = Object.keys(explicit)
  if (explicitKeys.length > 0) {
    try {
      return await explicit[explicitKeys[0]]()
    } catch {
      // fall through to fallback
    }
  }

  // Fallback: any scene.gltf under planets/**
  const fallback = import.meta.glob('../../assets/models/planets/**/scene.gltf', { as: 'url' }) as Record<string, () => Promise<string>>
  const keys = Object.keys(fallback)
  if (keys.length === 0) return null
  try {
    return await fallback[keys[0]]()
  } catch {
    return null
  }
}

// Synchronous eager getters (useful to avoid hook-order issues)
export function getRocketGltfSync(): string | null {
  const mods = (import.meta as any).glob('../../assets/models/rocket/*.gltf', { as: 'url', eager: true }) as Record<string, string>
  const keys = Object.keys(mods || {})
  if (keys.length === 0) return null
  return mods[keys[0]]
}

export function getPlanetGltfSync(): string | null {
  const explicit = (import.meta as any).glob('../../assets/models/planets/planet_blue/scene.gltf', { as: 'url', eager: true }) as Record<string, string>
  const explicitKeys = Object.keys(explicit || {})
  if (explicitKeys.length > 0) return explicit[explicitKeys[0]]

  const fallback = (import.meta as any).glob('../../assets/models/planets/**/scene.gltf', { as: 'url', eager: true }) as Record<string, string>
  const fallbackKeys = Object.keys(fallback || {})
  if (fallbackKeys.length === 0) return null
  return fallback[fallbackKeys[0]]
}

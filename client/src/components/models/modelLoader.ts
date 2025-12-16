// Centralized model URLs — resolved once at module init
const ROCKET_URL: string | null = (() => {
  try {
    return new URL('../../assets/models/toon_rocket/scene.gltf', import.meta.url).href
  } catch {
    return null
  }
})()

const PLANET_BLUE_URL: string | null = (() => {
  try {
    return new URL('../../assets/models/planets/planet_blue/scene.gltf', import.meta.url).href
  } catch {
    return null
  }
})()

export async function loadRocketGltf(): Promise<string | null> {
  return ROCKET_URL
}

export async function loadPlanetGltf(): Promise<string | null> {
  return PLANET_BLUE_URL
}

export function getRocketGltfSync(): string | null {
  return ROCKET_URL
}

export function getPlanetGltfSync(): string | null {
  return PLANET_BLUE_URL
}

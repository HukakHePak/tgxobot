export function resolveAssetUrl(relativePath: string): string | null {
  try {
    return new URL(relativePath, import.meta.url).href
  } catch {
    return null
  }
}

export default resolveAssetUrl

export function resolveAssetUrl(relativePath: string): string | null {
  // If path is already an absolute URL, return as-is
  try {
    if (/^https?:\/\//.test(relativePath)) return relativePath

    // If caller passed a path with ../ segments (common when referencing
    // assets from module files), build a stable URL under `/src/` which
    // Vite serves for bundled assets during dev and build.
    const upMatch = relativePath.match(/^(?:\.\.\/)+(.+)$/)
    if (upMatch) {
      const stripped = upMatch[1].replace(/^\/?/, '')
      // Use origin if available at runtime, otherwise return a root-relative path
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return `${window.location.origin}/src/${stripped}`
      }
      return `/src/${stripped}`
    }

    // Fall back to using import.meta.url resolution for other paths
    return new URL(relativePath, import.meta.url).href
  } catch {
    return null
  }
}

export default resolveAssetUrl

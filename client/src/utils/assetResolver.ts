export function resolveAssetUrl(relativePath: string): string | null {
  // If path is already an absolute URL, return as-is
  try {
    if (/^https?:\/\//.test(relativePath)) return relativePath
    // Prefer module-relative resolution which Vite transforms at build time
    // This works in dev (resolves to /src/...) and in production (resolves
    // to the built asset URL under /assets/...)
    return new URL(relativePath, import.meta.url).href
  } catch {
    return null
  }
}

export default resolveAssetUrl

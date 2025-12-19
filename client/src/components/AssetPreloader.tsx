import React, { useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useTheme } from '../theme/ThemeContext'
import LoadingBlock from './LoadingBlock'

const LIGHT_ASSETS = ['/assets/models/donut/scene.gltf', '/assets/models/banana/scene.gltf']
const DARK_ASSETS = [
  '/assets/models/toon_rocket/scene.gltf',
  '/assets/models/planets/planet_blue/scene.gltf',
  '/assets/models/planets/planet_green/scene.gltf',
  '/assets/models/planets/planet_purple/scene.gltf',
  '/assets/models/planets/planet_red/scene.gltf'
]

async function loadUrls(urls: string[]) {
  const loader = new GLTFLoader()
  const promises = urls.map(
    (u) =>
      new Promise((res) =>
        loader.load(
          u,
          (gltf) => res(gltf),
          undefined,
          () => {
            // ignore individual load errors, resolve to null
            res(null)
          }
        )
      )
  )
  await Promise.all(promises)
}

// AssetPreloader no longer blocks rendering: it starts preloading only after
// the top-level page 'load' event (or immediately if already loaded), and it
// shows the centered loading overlay during model downloads.
export default function AssetPreloader({ onLoadingChange, themeOverride }: { onLoadingChange?: (loading: boolean) => void; themeOverride?: 'dark' | 'light' }) {
  // prefer explicit theme passed from parent (Board) because this component
  // may be rendered inside the R3F <Html> portal where React context from
  // the app's ThemeProvider does not propagate.
  const { theme: ctxTheme } = useTheme()
  const theme = themeOverride ?? ctxTheme
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false

    function startPreloadAfterPaint() {
      // ensure initial paint has occurred before starting heavy loads
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cancelled) return
        const urls = theme === 'light' ? LIGHT_ASSETS : DARK_ASSETS

        // Delay showing the overlay briefly so that cached/fast loads
        // don't flash the preloader. Only show overlay if loading lasts
        // longer than SHOW_DELAY_MS.
        const SHOW_DELAY_MS = 150
        let showTimer: number | undefined = window.setTimeout(() => {
          if (!cancelled) {
            setLoading(true)
            onLoadingChange?.(true)
          }
        }, SHOW_DELAY_MS)

        loadUrls(urls)
          .catch(() => {})
          .finally(() => {
            if (!cancelled) {
              if (showTimer !== undefined) {
                clearTimeout(showTimer)
                showTimer = undefined
              }
              setDone(true)
              setLoading(false)
              onLoadingChange?.(false)
            }
          })
      }))
    }

    if (document.readyState === 'complete') {
      startPreloadAfterPaint()
    } else {
      const onLoad = () => startPreloadAfterPaint()
      window.addEventListener('load', onLoad)
      return () => {
        cancelled = true
        window.removeEventListener('load', onLoad)
      }
    }

    return () => {
      cancelled = true
    }
  }, [theme])

//   if (loading && !done) return <LoadingBlock />
//   return null

    return <LoadingBlock themeOverride={theme} />
}

/**
 * Map state management using Zustand
 * Optimized for mobile performance and React 19 concurrency
 */

import React from 'react'
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { ViewState } from '@vis.gl/react-maplibre'
import { MapBounds, PerformanceConfig, DriveSoCalMap } from '@/types/map'
import { OPENSTREETMAP_STYLES, GTA_MAP_STYLES } from '@/lib/map/config'

interface MapState {
  // View state
  viewState: ViewState | null
  setViewState: (viewState: ViewState) => void

  // Map style and theme
  mapStyle: string | Record<string, unknown>
  mapTheme: 'day' | 'night' | 'satellite' | 'hybrid'
  setMapStyle: (style: string | Record<string, unknown>) => void
  setMapTheme: (theme: MapState['mapTheme']) => void

  // Boundaries
  boundaries: MapBounds | null
  updateBoundaries: (bounds: MapBounds) => void

  // Map instance
  map: DriveSoCalMap | null
  setMap: (map: DriveSoCalMap | null) => void

  // UI state
  isFullscreen: boolean
  setIsFullscreen: (fullscreen: boolean) => void

  // Interaction state
  isDragging: boolean
  isZooming: boolean
  isRotating: boolean
  setIsDragging: (dragging: boolean) => void
  setIsZooming: (zooming: boolean) => void
  setIsRotating: (rotating: boolean) => void

  // Performance
  performanceMode: boolean
  performanceConfig: PerformanceConfig
  setPerformanceMode: (enabled: boolean) => void
  setPerformanceConfig: (config: Partial<PerformanceConfig>) => void

  // Loading states
  isLoading: boolean
  isStyleLoaded: boolean
  isSourceLoaded: boolean
  setLoading: (loading: boolean) => void
  setStyleLoaded: (loaded: boolean) => void
  setSourceLoaded: (loaded: boolean) => void

  // Error handling
  error: Error | null
  setError: (error: Error | null) => void

  // Animation state
  isAnimating: boolean
  setIsAnimating: (animating: boolean) => void

  // Mobile-specific state
  touchEnabled: boolean
  gesturesEnabled: boolean
  setTouchEnabled: (enabled: boolean) => void
  setGesturesEnabled: (enabled: boolean) => void

  // Cache management
  tileCache: Map<string, unknown>
  clearTileCache: () => void
  addToTileCache: (key: string, data: unknown) => void

  // Viewport tracking
  viewport: {
    width: number
    height: number
    pixelRatio: number
  } | null
  setViewport: (viewport: MapState['viewport']) => void
}

export const useMapStore = create<MapState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // View state
      viewState: null,
      setViewState: (viewState) => set({ viewState }),

      // Map style and theme
      mapStyle: OPENSTREETMAP_STYLES.osm_standard,
      mapTheme: 'day',
      setMapStyle: (mapStyle) => set({ mapStyle }),
      setMapTheme: (mapTheme) => {
        set({
          mapTheme,
          mapStyle: GTA_MAP_STYLES[mapTheme]
        })
      },

      // Boundaries
      boundaries: null,
      updateBoundaries: (boundaries) => set({ boundaries }),

      // Map instance
      map: null,
      setMap: (map) => set({ map }),

      // UI state
      isFullscreen: false,
      setIsFullscreen: (isFullscreen) => set({ isFullscreen }),

      // Interaction state
      isDragging: false,
      isZooming: false,
      isRotating: false,
      setIsDragging: (isDragging) => set({ isDragging }),
      setIsZooming: (isZooming) => set({ isZooming }),
      setIsRotating: (isRotating) => set({ isRotating }),

      // Performance
      performanceMode: false,
      performanceConfig: {
        enablePerformanceMode: false,
        maxTileCacheSize: 50,
        enableCollisionDetection: true,
        enableTerrain: false,
        enable3D: false,
        antialias: false,
        fadeDuration: 300,
      },
      setPerformanceMode: (performanceMode) => set({ performanceMode }),
      setPerformanceConfig: (configUpdate) =>
        set((state) => ({
          performanceConfig: { ...state.performanceConfig, ...configUpdate }
        })),

      // Loading states
      isLoading: true,
      isStyleLoaded: false,
      isSourceLoaded: false,
      setLoading: (isLoading) => set({ isLoading }),
      setStyleLoaded: (isStyleLoaded) => set({ isStyleLoaded }),
      setSourceLoaded: (isSourceLoaded) => set({ isSourceLoaded }),

      // Error handling
      error: null,
      setError: (error) => set({ error }),

      // Animation state
      isAnimating: false,
      setIsAnimating: (isAnimating) => set({ isAnimating }),

      // Mobile-specific state
      touchEnabled: true,
      gesturesEnabled: true,
      setTouchEnabled: (touchEnabled) => set({ touchEnabled }),
      setGesturesEnabled: (gesturesEnabled) => set({ gesturesEnabled }),

      // Cache management
      tileCache: new Map(),
      clearTileCache: () => set({ tileCache: new Map() }),
      addToTileCache: (key, data) => {
        const { tileCache } = get()
        const newCache = new Map(tileCache)
        newCache.set(key, data)
        set({ tileCache: newCache })
      },

      // Viewport tracking
      viewport: null,
      setViewport: (viewport) => set({ viewport }),
    })),
    {
      name: 'map-store',
      // Enable persisted state for map preferences
      // Note: In production, consider using localStorage or sessionStorage
    }
  )
)

// Selectors for optimized re-renders
export const useMapViewState = () => useMapStore((state) => state.viewState)
export const useMapLoadingState = () => useMapStore((state) => ({
  isLoading: state.isLoading,
  isStyleLoaded: state.isStyleLoaded,
  isSourceLoaded: state.isSourceLoaded,
  error: state.error,
}))
export const useMapInteractionState = () => useMapStore((state) => ({
  isDragging: state.isDragging,
  isZooming: state.isZooming,
  isRotating: state.isRotating,
  isAnimating: state.isAnimating,
}))
export const useMapPerformanceState = () => useMapStore((state) => ({
  performanceMode: state.performanceMode,
  performanceConfig: state.performanceConfig,
}))

// Actions for complex operations
export const useMapActions = () => useMapStore((state) => ({
  // Animate to new location
  flyTo: (coordinates: [number, number], zoom?: number) => {
    const { map } = state
    if (!map) return

    map.flyTo({
      center: coordinates,
      zoom: zoom || map.getZoom(),
      duration: 1000,
      essential: true,
    })
  },

  // Ease to new location
  easeTo: (coordinates: [number, number], zoom?: number) => {
    const { map } = state
    if (!map) return

    map.easeTo({
      center: coordinates,
      zoom: zoom || map.getZoom(),
      duration: 500,
      essential: true,
    })
  },

  // Jump to new location (no animation)
  jumpTo: (coordinates: [number, number], zoom?: number) => {
    const { map } = state
    if (!map) return

    map.jumpTo({
      center: coordinates,
      zoom: zoom || map.getZoom(),
    })
  },

  // Reset map to initial view
  resetView: () => {
    const { map } = state
    if (!map) return

    map.flyTo({
      center: [-118.2437, 34.0522], // Downtown LA
      zoom: 11,
      bearing: 0,
      pitch: 0,
      duration: 1500,
    })
  },

  // Toggle fullscreen mode
  toggleFullscreen: () => {
    const { isFullscreen, setIsFullscreen, map } = state

    if (!map) return

    if (isFullscreen) {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    } else {
      // Enter fullscreen
      const mapContainer = map.getContainer()
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  },

  // Optimize performance for mobile
  optimizeForMobile: () => {
    const { setPerformanceMode, setPerformanceConfig } = state

    setPerformanceMode(true)
    setPerformanceConfig({
      maxTileCacheSize: 25,
      fadeDuration: 0,
      antialias: false,
      enableTerrain: false,
      enable3D: false,
    })
  },

  // Restore normal performance settings
  restorePerformance: () => {
    const { setPerformanceMode, setPerformanceConfig } = state

    setPerformanceMode(false)
    setPerformanceConfig({
      maxTileCacheSize: 50,
      fadeDuration: 300,
      antialias: false,
      enableTerrain: false,
      enable3D: false,
    })
  },
}))

// Hooks for common patterns
export const useMapEffect = (effect: (map: DriveSoCalMap | null) => void | (() => void), deps?: unknown[]) => {
  const map = useMapStore((state) => state.map)

  React.useEffect(() => {
    if (map) {
      return effect(map)
    }
  }, [map, ...(deps || [])])
}

// Performance monitoring hook
export const useMapPerformanceMonitor = () => {
  const { map, performanceMode, setPerformanceMode } = useMapStore()

  React.useEffect(() => {
    if (!map) return

    let frameCount = 0
    let lastTime = performance.now()
    let fpsTimeout: ReturnType<typeof requestAnimationFrame>

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime)

        // Auto-enable performance mode if FPS is too low
        if (fps < 30 && !performanceMode) {
          console.warn(`Low FPS detected: ${fps}, enabling performance mode`)
          setPerformanceMode(true)
        }

        frameCount = 0
        lastTime = currentTime
      }

      fpsTimeout = requestAnimationFrame(measureFPS)
    }

    fpsTimeout = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(fpsTimeout)
    }
  }, [map, performanceMode, setPerformanceMode])
}

// Export store type for external access if needed
export type { MapState }
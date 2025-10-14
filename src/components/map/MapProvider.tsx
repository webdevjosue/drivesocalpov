/**
 * Map Provider Component - Drive SoCal POV
 * Mobile-optimized MapLibre GL integration following official documentation
 * Updated for @vis.gl/react-maplibre v8
 */

'use client'

import React, { useMemo, useCallback, useEffect, useRef } from 'react'
import Map from '@vis.gl/react-maplibre'
import { MAP_CONFIG, MOBILE_PERFORMANCE_CONFIG, getOptimizedConfig, OPENSTREETMAP_STYLES } from '@/lib/map/config'
import { useMapStore } from '@/store/mapStore'
import { useIsMobile } from '@/hooks/useIsMobile'

// Import styles for mobile optimization
import '@/styles/map.css'

interface MapProviderProps {
  children: React.ReactNode
  className?: string
  onMapLoad?: (map: any) => void
  onMapError?: (error: any) => void
  enablePerformanceMode?: boolean
}

export function MapProvider({
  children,
  className = '',
  onMapLoad,
  onMapError,
  enablePerformanceMode: enablePerfMode = true,
}: MapProviderProps) {
  const isMobile = useIsMobile()
  const {
    setMap,
    mapStyle,
    setLoading,
    setStyleLoaded,
    setError,
    setPerformanceMode,
    setViewport,
  } = useMapStore()

  const mapRef = useRef<any>(null)
  const performanceTimerRef = useRef<number>(0)
  // const [mapLoading, setMapLoading] = useState(true)

  // Mobile-optimized configuration
  const mapConfig = useMemo(() => {
    const baseConfig = {
      ...MAP_CONFIG,
      mapStyle: mapStyle || MAP_CONFIG.mapStyle,
      ...MOBILE_PERFORMANCE_CONFIG,
    }

    // Apply device-specific optimizations
    const deviceConfig = getOptimizedConfig()
    const optimizedConfig = { ...baseConfig, ...deviceConfig }

    // Additional mobile-specific settings
    if (isMobile) {
      return {
        ...optimizedConfig,
        // Enhanced mobile touch settings (per official docs)
        touchZoomRotate: true,
        touchPitch: false,
        dragRotate: false,
        // Disable double-click zoom on mobile (use pinch instead)
        doubleClickZoom: false,
        // Note: maxTileCacheSize handled in MAP_CONFIG
        // Reduce animation complexity on mobile
        transitionDuration: enablePerfMode ? 0 : 200,
        // Better gesture handling
        cooperativeGestures: true,
      }
    }

    return optimizedConfig
  }, [isMobile, mapStyle, enablePerfMode])

  // Map load handler with mobile optimizations
  const handleMapLoad = useCallback(
    (event: any) => {
      const map = event.target
      mapRef.current = map

      // Set map instance in store
      setMap(map)
      // setMapLoading(false)
      setLoading(false)
      setStyleLoaded(true)

      // Set maxBounds for ALL users to enforce boundaries
      map.setMaxBounds(MAP_CONFIG.maxBounds)
      map.setRenderWorldCopies(false)

      // Mobile-specific optimizations
      if (isMobile) {
        // Enable touch gestures
        map.touchZoomRotate.enable()
        map.dragPan.enable()
        map.dragRotate.disable()
        map.touchPitch.disable()

        // Optimize for mobile rendering
        const canvas = map.getCanvas()
        if (canvas) {
          const devicePixelRatio = window.devicePixelRatio
          if (devicePixelRatio > 2) {
            // Reduce rendering quality on high-DPI devices for performance
            canvas.style.imageRendering = 'optimizeSpeed'
          }

          // Enable hardware acceleration
          canvas.style.transform = 'translateZ(0)'
        }

        // Optimize font rendering for mobile
        if (map.style && map.style.glyphs) {
          // Force better font rendering on mobile
          canvas.style.fontSmooth = 'always'
          canvas.style.webkitFontSmoothing = 'antialiased'
        }
      }

      // Performance mode setup
      if (enablePerfMode) {
        setPerformanceMode(true)

        // Note: MapLibre GL doesn't have setMaxTileCacheSize method
        // Performance is handled through config.maxTileCacheSize in MAP_CONFIG

        // Monitor performance
        setupPerformanceMonitoring(map)
      }

      // Set viewport information
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
      })

      // Custom load callback
      if (onMapLoad) {
        onMapLoad(map)
      }

      console.log('Map loaded successfully:', {
        isMobile,
        performanceMode: enablePerfMode,
        config: mapConfig,
      })
    },
    [isMobile, setMap, setLoading, setStyleLoaded, setPerformanceMode, setViewport, onMapLoad, enablePerfMode, mapConfig]
  )

  // Error handling with fallback strategies
  const handleError = useCallback(
    (error: any) => {
      console.error('Map loading error:', error)

      // Set error state
      setError(error)

      // Try to recover from common errors
      if (error.error?.message) {
        const errorMessage = error.error.message.toLowerCase()

        // Style loading error - try fallback style
        if (errorMessage.includes('style') || errorMessage.includes('tile')) {
          console.log('Attempting fallback map style...')
          // Reset to basic OpenStreetMap style (free fallback)
          MAP_CONFIG.mapStyle = OPENSTREETMAP_STYLES.osm_standard
        }

        // Authentication error
        if (errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
          console.error('Map authentication error. Check your API token.')
        }

        // Network error
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          console.log('Network error detected. Retrying in 5 seconds...')
          setTimeout(() => {
            window.location.reload()
          }, 5000)
        }
      }

      // Custom error callback
      if (onMapError) {
        onMapError(error)
      }
    },
    [setError, onMapError]
  )

  // Performance monitoring setup
  const setupPerformanceMonitoring = useCallback((map: any) => {
    let frameCount = 0
    let lastTime = performance.now()

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime)

        // Adjust performance based on FPS
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}, enabling performance optimizations`)

          // Note: MapLibre GL doesn't have setMaxTileCacheSize method
          // Performance is handled through maxTileCacheSize config

          // Disable animations
          if (map.setPaintProperty) {
            map.setPaintProperty('background', 'background-color', '#1a1a1a')
          }

          // Enable performance mode if not already enabled
          setPerformanceMode(true)
        }

        frameCount = 0
        lastTime = currentTime
      }

      if (mapRef.current) {
        performanceTimerRef.current = requestAnimationFrame(measurePerformance)
      }
    }

    performanceTimerRef.current = requestAnimationFrame(measurePerformance)
  }, [setPerformanceMode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (performanceTimerRef.current) {
        cancelAnimationFrame(performanceTimerRef.current)
      }
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        // Get the container element to calculate proper dimensions
        const container = mapRef.current.getContainer()
        if (container) {
          const containerRect = container.getBoundingClientRect()

          setViewport({
            width: containerRect.width,
            height: containerRect.height,
            pixelRatio: window.devicePixelRatio,
          })

          // Only resize if container dimensions are valid
          if (containerRect.width > 0 && containerRect.height > 0) {
            mapRef.current.resize()
          }
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setViewport])

  // Handle visibility change (performance optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (mapRef.current) {
        if (document.hidden) {
          // Pause rendering when tab is not visible
          // Note: MapLibre GL doesn't have built-in pause/resume like some other libraries
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <div className={`map-provider ${className}`}>
      <Map
        {...mapConfig}
        ref={mapRef}
        onLoad={handleMapLoad}
        onError={handleError}
        attributionControl={false}
        // Event handlers for debugging
        onClick={(e) => {
          // Log clicks for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('Map clicked:', e.lngLat)
          }
        }}
        onMove={() => {
          // Update view state in store and enforce bounds strictly
          if (mapRef.current) {
            const center = mapRef.current.getCenter()
            const zoom = mapRef.current.getZoom()
            const bearing = mapRef.current.getBearing()
            const pitch = mapRef.current.getPitch()

            // Check if center is within bounds
            const bounds = MAP_CONFIG.maxBounds
            const [[west, south], [east, north]] = bounds

            // If outside bounds, immediately snap back to bounds
            const clampedLng = Math.max(west, Math.min(east, center.lng))
            const clampedLat = Math.max(south, Math.min(north, center.lat))

            // Strict bounds enforcement - if outside bounds, immediately return
            if (clampedLng !== center.lng || clampedLat !== center.lat) {
              // Immediately jump back to bounds without animation
              mapRef.current.jumpTo({
                center: [clampedLng, clampedLat],
                zoom: zoom,
                bearing: bearing,
                pitch: pitch
              })

              // Update view state with clamped coordinates
              useMapStore.getState().setViewState({
                longitude: clampedLng,
                latitude: clampedLat,
                zoom,
                bearing,
                pitch,
                padding: { top: 0, bottom: 0, left: 0, right: 0 },
              })
              return
            }

            useMapStore.getState().setViewState({
              longitude: center.lng,
              latitude: center.lat,
              zoom,
              bearing,
              pitch,
              padding: { top: 0, bottom: 0, left: 0, right: 0 },
            })
          }
        }}
        onMoveStart={() => {
          useMapStore.getState().setIsDragging(true)
        }}
        onMoveEnd={() => {
          useMapStore.getState().setIsDragging(false)
        }}
        onZoomStart={() => {
          useMapStore.getState().setIsZooming(true)
        }}
        onZoomEnd={() => {
          useMapStore.getState().setIsZooming(false)

          // Enforce zoom bounds
          if (mapRef.current) {
            const zoom = mapRef.current.getZoom()
            const minZoom = MAP_CONFIG.minZoom || 8
            const maxZoom = MAP_CONFIG.maxZoom || 16

            if (zoom < minZoom) {
              mapRef.current.setZoom(minZoom)
            } else if (zoom > maxZoom) {
              mapRef.current.setZoom(maxZoom)
            }
          }
        }}
      >
        {children}
      </Map>
    </div>
  )
}

// HOC for withMapProvider
export function withMapProvider<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { mapProviderProps?: Partial<MapProviderProps> }> {
  return function WrappedComponent({ mapProviderProps, ...props }) {
    return (
      <MapProvider {...(mapProviderProps || {})}>
        <Component {...(props as P)} />
      </MapProvider>
    )
  }
}

export default MapProvider
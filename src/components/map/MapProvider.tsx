/**
 * Map Provider Component - Drive SoCal POV
 * Mobile-optimized MapLibre GL integration following official documentation
 * Updated for @vis.gl/react-maplibre v8
 */

'use client'

import React, { useMemo, useCallback, useEffect, useRef } from 'react'
import Map, { MapRef } from '@vis.gl/react-maplibre'
import { MAP_CONFIG, MOBILE_PERFORMANCE_CONFIG, getOptimizedConfig, OPENSTREETMAP_STYLES } from '@/lib/map/config'
import { useMapStore } from '@/store/mapStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { DriveSoCalMap } from '@/types/map'

// Import MapLibre types for proper typing
import type { Map as MapLibreMap } from 'maplibre-gl'

// Import real location markers
import LocationMarkers from './LocationMarkers'

// Import styles for mobile optimization
import '@/styles/map.css'

interface MapProviderProps {
  children: React.ReactNode
  className?: string
  onMapLoad?: (map: DriveSoCalMap) => void
  onMapError?: (error: { error: Error }) => void
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

  const mapRef = useRef<MapRef | null>(null)
  const performanceTimerRef = useRef<number>(0)
  // const [mapLoading, setMapLoading] = useState(true)

  // Progressive tile loading setup
  const setupProgressiveLoading = useCallback((map: any) => {
    let loadingLevel = 1 // Start with basic tiles
    const loadingLevels = [
      { zoom: 10, quality: 'basic' },      // Far zoom - minimal tiles
      { zoom: 12, quality: 'standard' },   // Medium zoom - standard tiles
      { zoom: 14, quality: 'high' },       // Close zoom - high quality tiles
      { zoom: 16, quality: 'maximum' },    // Very close - maximum detail
    ]

    const updateLoadingLevel = () => {
      if (!mapRef.current) return

      const currentZoom = mapRef.current.getZoom()

      // Determine loading level based on zoom
      for (let i = loadingLevels.length - 1; i >= 0; i--) {
        const currentLevel = loadingLevels[i]
        if (currentLevel && currentZoom >= currentLevel.zoom) {
          loadingLevel = i + 1
          break
        }
      }

      // Adjust tile loading based on level and device performance
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4

      if (isLowEndDevice && loadingLevel > 2) {
        loadingLevel = 2 // Limit quality on low-end devices
      }

      // Configure tile loading strategy
      if (mapRef.current.style && mapRef.current.style.sourceCaches) {
        // Implement progressive loading based on current level
        console.log(`Progressive loading: Level ${loadingLevel} at zoom ${currentZoom}`)
      }
    }

    // Update loading level on zoom changes
    map.on('zoomend', updateLoadingLevel)

    // Initial setup
    updateLoadingLevel()
  }, [])

  // Enhanced performance monitoring with adaptive quality
  const setupPerformanceMonitoring = useCallback((map: MapLibreMap) => {
    let frameCount = 0
    let lastTime = performance.now()
    let performanceWarnings = 0

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime)

        // Adaptive performance adjustments
        if (fps < 30) {
          performanceWarnings++
          console.warn(`Low FPS detected: ${fps}, enabling performance optimizations (Warning ${performanceWarnings}/3)`)

          const mapInstance = map as MapLibreMap & {
            setPaintProperty?: (layer: string, property: string, value: unknown) => void,
            setTerrain?: (terrain: any) => void,
            setFog?: (fog: any) => void
          }

          // Progressive performance degradation
          if (performanceWarnings === 1) {
            // First warning: Reduce visual quality
            if (mapInstance.setPaintProperty && (map as any).style && (map as any).style.getLayer && !(map as any)._disableBackgroundOptimizations) {
              // Check if background layer exists before trying to style it
              try {
                const backgroundLayer = (map as any).style.getLayer('background')
                if (backgroundLayer) {
                  mapInstance.setPaintProperty('background', 'background-color', '#1a1a1a')
                } else {
                  console.log('Background layer not found in current style, skipping background optimization')
                }
              } catch (layerError) {
                console.log('Background layer styling failed, disabling future background optimizations:', layerError)
                ;(map as any)._disableBackgroundOptimizations = true
              }
            }
          } else if (performanceWarnings === 2) {
            // Second warning: Disable terrain and fog
            if (mapInstance.setTerrain) mapInstance.setTerrain(null)
            if (mapInstance.setFog) mapInstance.setFog(null)
          } else if (performanceWarnings >= 3) {
            // Third warning: Enable aggressive performance mode
            setPerformanceMode(true)
          }
        } else if (fps > 55 && performanceWarnings > 0) {
          // Performance recovered: gradually restore quality
          performanceWarnings = Math.max(0, performanceWarnings - 1)
          console.log(`Performance recovered: ${fps} FPS, restoring quality`)
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
      const map = event.target.getMap ? event.target.getMap() : event.target
      mapRef.current = event.target

      // Set map instance in store
      setMap(map as unknown as DriveSoCalMap)
      // setMapLoading(false)
      setLoading(false)
      setStyleLoaded(true)

      // Get the native map instance for optimizations
      const mapInstance = mapRef.current?.getMap()

      // Set maxBounds for ALL users to enforce boundaries
      if (mapInstance) {
        mapInstance.setMaxBounds(MAP_CONFIG.maxBounds)
        mapInstance.setRenderWorldCopies(false)
      }

      // Mobile-specific optimizations
      if (isMobile && mapRef.current) {
        const mobileMapInstance = mapRef.current.getMap()
        if (!mobileMapInstance) return

        // Enable touch gestures
        mobileMapInstance.touchZoomRotate.enable()
        mobileMapInstance.dragPan.enable()
        mobileMapInstance.dragRotate.disable()
        mobileMapInstance.touchPitch.disable()

        // Optimize for mobile rendering
        const canvas = mobileMapInstance.getCanvas()
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
        if ((mobileMapInstance as any).style && (mobileMapInstance as any).style.glyphs) {
          // Force better font rendering on mobile
          ;(canvas.style as any).fontSmooth = 'always'
          ;(canvas.style as any).webkitFontSmoothing = 'antialiased'
        }
      }

      // Performance mode setup
      if (enablePerfMode) {
        setPerformanceMode(true)

        // Note: MapLibre GL doesn't have setMaxTileCacheSize method
        // Performance is handled through config.maxTileCacheSize in MAP_CONFIG

        // Monitor performance
        if (mapInstance) {
          setupPerformanceMonitoring(mapInstance)
          setupProgressiveLoading(mapInstance)
        }
      }

      // Set viewport information
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
      })

      // Custom load callback
      if (onMapLoad) {
        onMapLoad(map as unknown as DriveSoCalMap)
      }

      console.log('Map loaded successfully:', {
        isMobile,
        performanceMode: enablePerfMode,
        config: mapConfig,
      })
    },
    [isMobile, setMap, setLoading, setStyleLoaded, setPerformanceMode, setViewport, onMapLoad, enablePerfMode, mapConfig, setupProgressiveLoading, setupPerformanceMonitoring]
  )

  // Error handling with fallback strategies
  const handleError = useCallback(
    (error: { error: Error }) => {
      console.error('Map loading error:', error.error)

      // Set error state
      setError(error.error)

      // Try to recover from common errors
      if (error.error && 'message' in error.error) {
        const errorMessage = error.error.message.toLowerCase()

        // Background layer error - specific handling
        if (errorMessage.includes('background') && errorMessage.includes('layer')) {
          console.log('Background layer styling error detected, disabling background optimizations')
          // Disable background layer optimizations by setting a flag
          if (mapRef.current) {
            (mapRef.current as any)._disableBackgroundOptimizations = true
          }
        }

        // Style loading error - try fallback style
        if (errorMessage.includes('style') || errorMessage.includes('tile')) {
          console.log('Style loading error, attempting fallback map style...')
          // Reset to basic OpenStreetMap style (free fallback)
          if (mapRef.current) {
            const mapInstance = mapRef.current.getMap()
            if (mapInstance && 'setStyle' in mapInstance) {
              try {
                (mapInstance as any).setStyle(OPENSTREETMAP_STYLES.osm_standard)
                console.log('Successfully switched to fallback OSM style')
              } catch (styleError) {
                console.error('Failed to apply fallback style:', styleError)
              }
            }
          }
        }

        // Authentication error
        if (errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
          console.error('Map authentication error. Using free OpenStreetMap tiles.')
          if (mapRef.current) {
            const mapInstance = mapRef.current.getMap()
            if (mapInstance && 'setStyle' in mapInstance) {
              try {
                (mapInstance as any).setStyle(OPENSTREETMAP_STYLES.osm_standard)
              } catch (styleError) {
                console.error('Failed to apply fallback style:', styleError)
              }
            }
          }
        }

        // Network error
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          console.log('Network error detected. Retrying in 5 seconds...')
          setTimeout(() => {
            if (mapRef.current) {
              const mapInstance = mapRef.current.getMap()
              if (mapInstance && 'setStyle' in mapInstance) {
                try {
                  (mapInstance as any).setStyle(OPENSTREETMAP_STYLES.osm_standard)
                } catch (styleError) {
                  console.error('Failed to apply fallback style:', styleError)
                }
              }
            }
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
        {/* Real location markers from database */}
        <LocationMarkers />
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
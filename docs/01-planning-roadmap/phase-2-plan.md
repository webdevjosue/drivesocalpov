# Phase 2: Core Map Implementation - Drive SoCal POV

## Phase Overview

Phase 2 focuses on implementing the core map functionality for the Drive SoCal POV mobile-first travel guide app. This phase builds upon the Phase 1 foundation to create an interactive, GTA V-inspired map experience optimized for mobile devices with smooth touch interactions and performance optimizations.

**📋 Official Documentation References:**
- [Next.js 15+ Documentation](https://nextjs.org/docs) - React 19 Server Components, Turbopack optimization
- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/) - Mobile touch interactions, performance optimization
- [Tailwind CSS Typography](https://tailwindcss.com/docs/typography-plugin) - Mobile responsive typography
- [Chrome DevTools Performance Guide](https://developer.chrome.com/docs/devtools/performance/) - Performance profiling workflows

**Estimated Duration:** 5-7 days
**Priority:** High - Core functionality for the entire application
**Dependencies:** Phase 1 completion required

## 🔧 Development Workflow Integration

### Chrome DevTools Debugging Workflows

**Performance Monitoring Setup:**
1. **Performance Tab**: Record map interactions during typical user flows
2. **Memory Tab**: Monitor for memory leaks during prolonged use
3. **Network Tab**: Optimize tile loading and API requests
4. **Device Mode**: Test touch interactions on various device viewports
5. **Lighthouse**: Run accessibility and performance audits

**Key Performance Metrics to Monitor:**
- Frame rate during map pan/zoom (target: 60fps, minimum: 30fps)
- Memory usage trends (watch for leaks during marker operations)
- Tile loading times (target: <1 second per tile on 3G)
- Touch response latency (target: <100ms)
- JavaScript execution time during interactions

### Official Documentation Best Practices

**Next.js 15+ Implementation:**
- Use App Router with React 19 Server Components for optimal performance
- Implement Suspense boundaries for loading states
- Leverage Turbopack for faster development builds
- Follow Next.js 15+ partial prerendering patterns
- Use proper TypeScript configuration with strict mode

**MapLibre GL Mobile Optimization:**
- Enable `touchZoomRotate: true` and `cooperativeGestures: true` for better mobile UX
- Use `fadeDuration: 0` for better performance on lower-end devices
- Implement `trackResize: false` when appropriate to reduce reflows
- Optimize tile loading with `maxTiles` limits for mobile
- Use `renderWorldCopies: false` to reduce memory usage

**Mobile Design Standards:**
- Follow Apple HIG and Material Design guidelines for touch targets (44px minimum)
- Use system fonts for optimal performance and consistency
- Implement safe area support for notched devices
- Ensure WCAG 2.1 AA contrast ratios (4.5:1 for normal text)
- Use semantic HTML5 elements for accessibility

## Phase 2 Scope

### Core Deliverables
- **MapLibre GL Integration**: Full react-map-gl implementation with MapLibre GL
- **Southern California Boundaries**: Geofenced map region with smooth transitions
- **Mobile Touch Controls**: Native mobile gesture support (pinch, pan, rotate)
- **Map Styling**: GTA V-inspired visual theme with custom map styles
- **Location Marker System**: Dynamic marker rendering and management
- **Information Display**: Interactive popups and location details
- **Performance Optimization**: Mobile-optimized rendering and interactions
- **Component Architecture**: Scalable React component structure

### Technical Requirements
- **Mobile-First**: Touch-optimized interactions and gestures
- **GTA V-Inspired**: Smooth camera movements, zoom transitions, and UI overlays
- **Performance**: 60fps animations on mobile devices
- **TypeScript**: Full type safety for all map features
- **Responsive**: Adaptive UI for different screen sizes
- **Accessibility**: WCAG 2.1 AA compliance for map interactions

## Implementation Architecture

### Component Structure Overview

```
src/components/map/
├── MapContainer.tsx          # Main map wrapper with providers
├── MapController.tsx         # Map state and interaction management
├── MapLayers/               # Layer management system
│   ├── BaseMapLayer.tsx     # Base map rendering
│   ├── MarkerLayer.tsx      # Location markers
│   ├── PopupLayer.tsx       # Information popups
│   └── OverlayLayer.tsx     # UI overlays and controls
├── Controls/                # Map control components
│   ├── ZoomControls.tsx     # Zoom in/out buttons
│   ├── CompassControl.tsx   # North direction indicator
│   ├── LocationButton.tsx   # GPS location button
│   └── LayerToggle.tsx      # Map style switcher
├── Markers/                 # Marker system
│   ├── LocationMarker.tsx   # Individual location marker
│   ├── ClusterMarker.tsx    # Clustered markers
│   └── UserLocationMarker.tsx # Current position marker
├── Popups/                  # Information display
│   ├── LocationPopup.tsx    # Location details popup
│   ├── ClusterPopup.tsx     # Cluster information popup
│   └── Tooltip.tsx          # Simple tooltip component
└── Hooks/                   # Custom map hooks
    ├── useMapState.ts       # Map state management
    ├── useMarkers.ts        # Marker management
    ├── usePopups.ts         # Popup state management
    └── useGestures.ts       # Touch gesture handling
```

### State Management Architecture

```
src/store/map/
├── mapStore.ts              # Zustand store for map state
├── markerStore.ts           # Marker data and interactions
├── popupStore.ts            # Popup visibility and content
└── gestureStore.ts          # Touch gesture state
```

## Detailed Implementation Steps

### 1. MapLibre GL Integration Setup (Priority: Critical)

#### 1.1 Enhanced Map Configuration
**File:** `src/lib/map/config.ts`

```typescript
import { MapboxProps, ViewState } from 'react-map-gl'
import { MapStyle } from 'maplibre-gl'

export interface MapConfig extends MapboxProps {
  initialViewState: ViewState
  maxBounds: [[number, number], [number, number]]
  mapStyle: string | MapStyle
  projection?: string
}

export const SOUTHERN_CALIFORNIA_BOUNDS = {
  // Precise Southern California boundaries
  north: 34.823,   // Santa Barbara area
  south: 32.534,   // US-Mexico border (San Diego)
  east: -114.131,  // Colorado River/Arizona border
  west: -118.668,  // Pacific coastline (Ventura)
}

export const MAP_CONFIG: MapConfig = {
  // Optimized initial view for mobile
  initialViewState: {
    latitude: 34.0522,  // Downtown LA
    longitude: -118.2437,
    zoom: 11,           // Slightly zoomed in for mobile
    bearing: 0,
    pitch: 0,
  },

  // Strict boundary enforcement
  maxBounds: [
    [SOUTHERN_CALIFORNIA_BOUNDS.west, SOUTHERN_CALIFORNIA_BOUNDS.south],
    [SOUTHERN_CALIFORNIA_BOUNDS.east, SOUTHERN_CALIFORNIA_BOUNDS.north]
  ],

  // Map styling
  mapStyle: 'https://api.maptiler.com/maps/streets-v2/style.json',
  projection: 'mercator',

  // Mobile-optimized controls
  dragPan: true,
  dragRotate: false,
  scrollZoom: true,
  scrollZoomZoomIn: true,
  scrollZoomZoomOut: true,
  doubleClickZoom: false,
  touchZoomRotate: true,
  touchPitch: false,
  keyboard: false,

  // Performance settings
  maxZoom: 18,
  minZoom: 8,
  maxPitch: 0,
  minPitch: 0,

  // Rendering optimization
  reuseMaps: true,
  mapboxAccessToken: process.env.NEXT_PUBLIC_MAPLIBRE_TOKEN,
}

// GTA V-inspired map styles
export const GTA_MAP_STYLES = {
  day: 'https://api.maptiler.com/maps/bright-v2/style.json',
  night: 'https://api.maptiler.com/maps/night-v2/style.json',
  satellite: 'https://api.maptiler.com/maps/satellite-v2/style.json',
  hybrid: 'https://api.maptiler.com/maps/hybrid-v2/style.json',
  streets: 'https://api.maptiler.com/maps/streets-v2/style.json',
}

// Mobile performance settings
export const MOBILE_PERFORMANCE_CONFIG = {
  // Reduce tile requests for better performance
  maxTiles: 20,
  enableCollisionDetection: true,
  enableTerrain: false,
  enable3D: false,

  // Optimized rendering
  fadeDuration: 300,
  antialias: false,
  // Disable resource-intensive features
  renderWorldCopies: false,
  preserveDrawingBuffer: false,
}
```

#### 1.2 Enhanced Map Provider
**File:** `src/components/map/MapProvider.tsx`

```typescript
'use client'

import React, { useMemo, useCallback } from 'react'
import { Map } from 'react-map-gl'
import { MapProvider as MapLibreProvider } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG, MOBILE_PERFORMANCE_CONFIG } from '@/lib/map/config'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useMapStore } from '@/store/mapStore'

interface MapProviderProps {
  children: React.ReactNode
  className?: string
}

export function MapProvider({ children, className = '' }: MapProviderProps) {
  const isMobile = useIsMobile()
  const { setMap, mapStyle } = useMapStore()

  // Mobile-optimized configuration
  const mapConfig = useMemo(() => {
    const baseConfig = {
      ...MAP_CONFIG,
      mapStyle: mapStyle || MAP_CONFIG.mapStyle,
      ...MOBILE_PERFORMANCE_CONFIG,
    }

    if (isMobile) {
      return {
        ...baseConfig,
        // Enhanced mobile touch settings
        touchZoomRotate: true,
        touchPitch: false,
        dragRotate: false,
        // Disable double-click zoom on mobile (use pinch instead)
        doubleClickZoom: false,
        // Optimize tile loading for mobile
        maxTiles: 15,
        // Reduce animation complexity on mobile
        transitionDuration: 200,
      }
    }

    return baseConfig
  }, [isMobile, mapStyle])

  // Map load handler
  const handleMapLoad = useCallback((event: any) => {
    const map = event.target
    setMap(map)

    // Mobile optimizations
    if (isMobile) {
      // Disable unnecessary features for performance
      map.setMaxBounds(MAP_CONFIG.maxBounds)

      // Optimize for mobile rendering
      map.setPaintProperty('background', 'background-color', '#1a1a1a')
    }
  }, [isMobile, setMap])

  // Error boundary for map loading
  const handleError = useCallback((error: any) => {
    console.error('Map loading error:', error)
    // Fallback to basic map style
    if (error.error?.message?.includes('style')) {
      MAP_CONFIG.mapStyle = 'https://api.maptiler.com/maps/streets/style.json'
    }
  }, [])

  return (
    <div className={`map-container ${className}`}>
      <MapLibreProvider mapLib={maplibregl}>
        <Map
          {...mapConfig}
          onLoad={handleMapLoad}
          onError={handleError}
          attributionControl={false}
          className="w-full h-full"
        >
          {children}
        </Map>
      </MapLibreProvider>
    </div>
  )
}
```

### 2. Mobile Touch Gesture Implementation (Priority: Critical)

#### 2.1 Touch Gesture Hook
**File:** `src/hooks/useGestures.ts`

```typescript
'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useMap } from 'react-map-gl'
import { MapRef } from 'react-map-gl'
import { GestureHandling } from '@/types/map'

interface GestureState {
  isPinching: boolean
  isPanning: boolean
  initialDistance: number
  initialZoom: number
  lastTouchTime: number
  touchCount: number
}

export function useGestures() {
  const { current: map } = useMap()
  const [gestureState, setGestureState] = useState<GestureState>({
    isPinching: false,
    isPanning: false,
    initialDistance: 0,
    initialZoom: 0,
    lastTouchTime: 0,
    touchCount: 0,
  })

  const gestureTimeoutRef = useRef<NodeJS.Timeout>()
  const touchStartRef = useRef<TouchList | null>(null)

  // Calculate distance between two touch points
  const getDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0

    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Handle touch start
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touches = event.touches
    const currentTime = Date.now()

    setGestureState(prev => ({
      ...prev,
      touchCount: touches.length,
      lastTouchTime: currentTime,
    }))

    if (touches.length === 2) {
      // Start pinch gesture
      const distance = getDistance(touches)
      const currentZoom = map?.getZoom() || 10

      setGestureState(prev => ({
        ...prev,
        isPinching: true,
        initialDistance: distance,
        initialZoom: currentZoom,
      }))

      // Prevent default behavior to override map controls
      event.preventDefault()
    } else if (touches.length === 1) {
      // Single touch - allow pan but with enhanced behavior
      touchStartRef.current = touches
    }
  }, [map, getDistance])

  // Handle touch move
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    const touches = event.touches

    if (touches.length === 2 && gestureState.isPinching) {
      // Handle pinch zoom
      const currentDistance = getDistance(touches)
      const scale = currentDistance / gestureState.initialDistance
      const newZoom = Math.max(
        8,
        Math.min(18, gestureState.initialZoom + Math.log2(scale))
      )

      if (map && Math.abs(newZoom - map.getZoom()) > 0.1) {
        map.easeTo({
          zoom: newZoom,
          duration: 0,
          essential: true,
        })
      }

      event.preventDefault()
    }
  }, [gestureState, map, getDistance])

  // Handle touch end
  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    const touches = event.touches

    setGestureState(prev => ({
      ...prev,
      isPinching: false,
      isPanning: false,
      touchCount: touches.length,
    }))

    // Clear gesture timeout
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current)
    }

    // Reset gesture state after delay
    gestureTimeoutRef.current = setTimeout(() => {
      setGestureState({
        isPinching: false,
        isPanning: false,
        initialDistance: 0,
        initialZoom: 0,
        lastTouchTime: 0,
        touchCount: 0,
      })
    }, 100)
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current)
      }
    }
  }, [])

  return {
    gestureState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isGestureActive: gestureState.isPinching || gestureState.isPanning,
  }
}
```

#### 2.2 Enhanced Map Controller
**File:** `src/components/map/MapController.tsx`

```typescript
'use client'

import React, { useEffect, useCallback } from 'react'
import { useMap } from 'react-map-gl'
import { useMapStore } from '@/store/mapStore'
import { useGestures } from '@/hooks/useGestures'
import { useIsMobile } from '@/hooks/useIsMobile'
import { SOUTHERN_CALIFORNIA_BOUNDS } from '@/lib/map/config'

interface MapControllerProps {
  children: React.ReactNode
}

export function MapController({ children }: MapControllerProps) {
  const { current: map } = useMap()
  const isMobile = useIsMobile()
  const {
    setViewState,
    mapStyle,
    boundaries,
    updateBoundaries
  } = useMapStore()

  const {
    gestureState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isGestureActive,
  } = useGestures()

  // Enforce boundaries
  const enforceBoundaries = useCallback(() => {
    if (!map || !boundaries) return

    const center = map.getCenter()
    const { lat, lng } = center

    // Check if map is outside boundaries
    if (
      lat < boundaries.south ||
      lat > boundaries.north ||
      lng < boundaries.west ||
      lng > boundaries.east
    ) {
      // Smooth pan back to valid area
      map.easeTo({
        center: {
          lat: Math.max(boundaries.south, Math.min(boundaries.north, lat)),
          lng: Math.max(boundaries.west, Math.min(boundaries.east, lng)),
        },
        duration: 500,
        essential: true,
      })
    }
  }, [map, boundaries])

  // Handle map movement
  const handleMove = useCallback(() => {
    if (!map) return

    const center = map.getCenter()
    const zoom = map.getZoom()
    const bearing = map.getBearing()
    const pitch = map.getPitch()

    setViewState({
      latitude: center.lat,
      longitude: center.lng,
      zoom,
      bearing,
      pitch,
    })

    // Enforce boundaries after move
    if (!isGestureActive) {
      enforceBoundaries()
    }
  }, [map, setViewState, isGestureActive, enforceBoundaries])

  // Mobile-specific optimizations
  useEffect(() => {
    if (!map || !isMobile) return

    // Disable high-DPI rendering for performance
    const canvas = map.getCanvas()
    if (canvas) {
      const devicePixelRatio = window.devicePixelRatio
      if (devicePixelRatio > 2) {
        canvas.style.imageRendering = 'optimizeSpeed'
      }
    }

    // Optimize tile loading
    map.setMaxBounds([
      [SOUTHERN_CALIFORNIA_BOUNDS.west, SOUTHERN_CALIFORNIA_BOUNDS.south],
      [SOUTHERN_CALIFORNIA_BOUNDS.east, SOUTHERN_CALIFORNIA_BOUNDS.north]
    ])

    // Set initial boundaries
    updateBoundaries(SOUTHERN_CALIFORNIA_BOUNDS)
  }, [map, isMobile, updateBoundaries])

  // Map event listeners
  useEffect(() => {
    if (!map) return

    map.on('move', handleMove)
    map.on('moveend', enforceBoundaries)

    return () => {
      map.off('move', handleMove)
      map.off('moveend', enforceBoundaries)
    }
  }, [map, handleMove, enforceBoundaries])

  return (
    <div
      className="map-controller relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}
```

### 3. Location Marker System (Priority: High)

#### 3.1 Marker Types and Interfaces
**File:** `src/types/map.ts`

```typescript
import { MarkerProps } from 'react-map-gl'
import { Location, LocationCategory } from '@/lib/types'

export interface MapMarker {
  id: string
  location: Location
  coordinates: [number, number]
  category: LocationCategory
  isActive: boolean
  isSelected: boolean
  isVisible: boolean
  zIndex: number
}

export interface ClusterMarker {
  id: string
  coordinates: [number, number]
  count: number
  locations: Location[]
  category: LocationCategory[]
  isActive: boolean
  zIndex: number
}

export interface UserLocationMarker {
  id: string
  coordinates: [number, number]
  accuracy: number
  heading?: number
  speed?: number
  timestamp: number
}

export interface MarkerInteraction {
  onClick: (marker: MapMarker) => void
  onDoubleClick: (marker: MapMarker) => void
  onHover: (marker: MapMarker | null) => void
  onLongPress: (marker: MapMarker) => void
}

export type MarkerStyle = {
  size: 'small' | 'medium' | 'large'
  color: string
  icon: string
  animation?: 'bounce' | 'pulse' | 'none'
  opacity?: number
}

export const MARKER_STYLES: Record<LocationCategory, MarkerStyle> = {
  attraction: {
    size: 'medium',
    color: '#ef4444',
    icon: 'attraction',
    animation: 'bounce',
  },
  restaurant: {
    size: 'medium',
    color: '#f59e0b',
    icon: 'restaurant',
    animation: 'none',
  },
  event: {
    size: 'large',
    color: '#8b5cf6',
    icon: 'event',
    animation: 'pulse',
  },
  park: {
    size: 'medium',
    color: '#10b981',
    icon: 'park',
    animation: 'none',
  },
  beach: {
    size: 'medium',
    color: '#06b6d4',
    icon: 'beach',
    animation: 'none',
  },
  entertainment: {
    size: 'medium',
    color: '#ec4899',
    icon: 'entertainment',
    animation: 'bounce',
  },
}
```

#### 3.2 Location Marker Component
**File:** `src/components/map/Markers/LocationMarker.tsx`

```typescript
'use client'

import React, { useMemo, useCallback } from 'react'
import { Marker } from 'react-map-gl'
import { MapMarker, MarkerInteraction, MARKER_STYLES } from '@/types/map'
import { cn } from '@/lib/utils'

interface LocationMarkerProps {
  marker: MapMarker
  interactions: MarkerInteraction
  isClustered?: boolean
}

export function LocationMarker({
  marker,
  interactions,
  isClustered = false
}: LocationMarkerProps) {
  const {
    id,
    location,
    coordinates,
    category,
    isActive,
    isSelected
  } = marker

  const markerStyle = MARKER_STYLES[category]

  // Generate marker size classes
  const sizeClasses = useMemo(() => {
    const base = 'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200'
    const sizes = {
      small: 'w-8 h-8',
      medium: 'w-10 h-10',
      large: 'w-12 h-12',
    }

    return cn(base, sizes[markerStyle.size])
  }, [markerStyle.size])

  // Generate animation classes
  const animationClasses = useMemo(() => {
    if (isClustered) return ''

    const animations = {
      bounce: 'animate-bounce',
      pulse: 'animate-pulse',
      none: '',
    }

    return cn(animations[markerStyle.animation || 'none'])
  }, [markerStyle.animation, isClustered])

  // Handle click interactions
  const handleClick = useCallback((event: any) => {
    event.originalEvent.stopPropagation()
    interactions.onClick(marker)
  }, [interactions, marker])

  // Handle hover interactions
  const handleMouseEnter = useCallback(() => {
    interactions.onHover(marker)
  }, [interactions, marker])

  const handleMouseLeave = useCallback(() => {
    interactions.onHover(null)
  }, [interactions])

  // Generate marker content
  const markerContent = useMemo(() => {
    const baseClasses = cn(
      'rounded-full flex items-center justify-center cursor-pointer shadow-lg',
      'border-2 border-white',
      sizeClasses,
      animationClasses,
      isActive && 'ring-4 ring-blue-400 ring-opacity-50',
      isSelected && 'ring-4 ring-yellow-400 ring-opacity-50',
      !isActive && !isSelected && 'hover:scale-110'
    )

    return (
      <div className={baseClasses} style={{ backgroundColor: markerStyle.color }}>
        {/* Icon */}
        <div className="text-white text-xs font-bold">
          {markerStyle.icon.charAt(0).toUpperCase()}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
        )}

        {/* Active indicator */}
        {isActive && !isSelected && (
          <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30" />
        )}
      </div>
    )
  }, [markerStyle, sizeClasses, animationClasses, isActive, isSelected])

  return (
    <Marker
      key={id}
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="center"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {markerContent}
    </Marker>
  )
}
```

#### 3.3 Marker Management Hook
**File:** `src/hooks/useMarkers.ts`

```typescript
'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useMap } from 'react-map-gl'
import { ViewState } from 'react-map-gl'
import { MapMarker, ClusterMarker, Location } from '@/types/map'
import { useMarkerStore } from '@/store/markerStore'

interface MarkerManagerOptions {
  clusterRadius?: number
  minZoom?: number
  maxZoom?: number
}

export function useMarkers(options: MarkerManagerOptions = {}) {
  const { current: map } = useMap()
  const {
    markers,
    clusters,
    selectedMarker,
    hoveredMarker,
    setMarkers,
    setClusters,
    setSelectedMarker,
    setHoveredMarker
  } = useMarkerStore()

  const {
    clusterRadius = 50,
    minZoom = 8,
    maxZoom = 18,
  } = options

  // Current view state
  const [viewState, setViewState] = useState<ViewState | null>(null)

  // Cluster markers based on zoom level and proximity
  const clusterMarkers = useCallback((markers: MapMarker[], zoom: number): ClusterMarker[] => {
    if (zoom > 14) return [] // Don't cluster at high zoom levels

    const clusters: ClusterMarker[] = []
    const processed = new Set<string>()

    markers.forEach(marker => {
      if (processed.has(marker.id)) return

      const nearbyMarkers = markers.filter(other => {
        if (processed.has(other.id)) return false
        if (other.id === marker.id) return false

        const distance = calculateDistance(
          marker.coordinates,
          other.coordinates
        )

        // Adjust clustering radius based on zoom level
        const adjustedRadius = clusterRadius * Math.pow(2, 14 - zoom)
        return distance < adjustedRadius
      })

      if (nearbyMarkers.length > 0) {
        // Create cluster
        const clusterMarkers = [marker, ...nearbyMarkers]
        const centerPoint = calculateCenterPoint(
          clusterMarkers.map(m => m.coordinates)
        )

        const cluster: ClusterMarker = {
          id: `cluster_${marker.id}`,
          coordinates: centerPoint,
          count: clusterMarkers.length,
          locations: clusterMarkers.map(m => m.location),
          category: [...new Set(clusterMarkers.map(m => m.category))],
          isActive: false,
          zIndex: 1000,
        }

        clusters.push(cluster)
        clusterMarkers.forEach(m => processed.add(m.id))
      } else {
        processed.add(marker.id)
      }
    })

    return clusters
  }, [clusterRadius])

  // Calculate distance between two coordinates
  const calculateDistance = useCallback((coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c * 1000 // Convert to meters
  }, [])

  // Calculate center point of multiple coordinates
  const calculateCenterPoint = useCallback((coordinates: [number, number][]): [number, number] => {
    const sumLat = coordinates.reduce((sum, coord) => sum + coord[1], 0)
    const sumLng = coordinates.reduce((sum, coord) => sum + coord[0], 0)

    return [
      sumLng / coordinates.length,
      sumLat / coordinates.length
    ]
  }, [])

  // Update view state
  const updateViewState = useCallback(() => {
    if (!map) return

    const newViewState = {
      latitude: map.getCenter().lat,
      longitude: map.getCenter().lng,
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    }

    setViewState(newViewState)
  }, [map])

  // Filter markers based on view bounds
  const getVisibleMarkers = useCallback((markers: MapMarker[]): MapMarker[] => {
    if (!map || !viewState) return markers

    const bounds = map.getBounds()
    if (!bounds) return markers

    return markers.filter(marker => {
      const [lng, lat] = marker.coordinates
      return bounds.contains([lng, lat])
    })
  }, [map, viewState])

  // Handle marker click
  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker.id === selectedMarker ? null : marker.id)
  }, [selectedMarker, setSelectedMarker])

  // Handle marker hover
  const handleMarkerHover = useCallback((marker: MapMarker | null) => {
    setHoveredMarker(marker?.id || null)
  }, [setHoveredMarker])

  // Update clusters when markers or view state changes
  useEffect(() => {
    if (!markers.length || !viewState) return

    const visibleMarkers = getVisibleMarkers(markers)
    const newClusters = clusterMarkers(visibleMarkers, viewState.zoom)

    setClusters(newClusters)
  }, [markers, viewState, clusterMarkers, getVisibleMarkers, setClusters])

  // Listen to map movements
  useEffect(() => {
    if (!map) return

    map.on('move', updateViewState)
    map.on('moveend', updateViewState)

    return () => {
      map.off('move', updateViewState)
      map.off('moveend', updateViewState)
    }
  }, [map, updateViewState])

  // Initial view state
  useEffect(() => {
    updateViewState()
  }, [updateViewState])

  return {
    markers,
    clusters,
    selectedMarker,
    hoveredMarker,
    visibleMarkers: viewState ? getVisibleMarkers(markers) : markers,
    handleMarkerClick,
    handleMarkerHover,
    updateViewState,
  }
}
```

### 4. Information Display System (Priority: High)

#### 4.1 Location Popup Component
**File:** `src/components/map/Popups/LocationPopup.tsx`

```typescript
'use client'

import React, { useState, useCallback } from 'react'
import { Popup } from 'react-map-gl'
import { Location } from '@/lib/types'
import { cn } from '@/lib/utils'
import { StarIcon, HeartIcon, ShareIcon, NavigationIcon } from 'lucide-react'

interface LocationPopupProps {
  location: Location
  coordinates: [number, number]
  onClose: () => void
  onFavorite?: (locationId: string) => void
  onShare?: (location: Location) => void
  onNavigate?: (location: Location) => void
  className?: string
}

export function LocationPopup({
  location,
  coordinates,
  onClose,
  onFavorite,
  onShare,
  onNavigate,
  className = ''
}: LocationPopupProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleFavorite = useCallback(() => {
    setIsFavorited(!isFavorited)
    onFavorite?.(location.id)
  }, [isFavorited, onFavorite, location.id])

  const handleShare = useCallback(() => {
    onShare?.(location)
  }, [onShare, location])

  const handleNavigate = useCallback(() => {
    onNavigate?.(location)
  }, [onNavigate, location])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  // Format price range for display
  const formatPriceRange = useCallback((priceRange?: string): string => {
    if (!priceRange) return ''

    const priceMap: Record<string, string> = {
      '$': 'Budget-friendly',
      '$$': 'Moderate',
      '$$$': 'Expensive',
      '$$$$': 'Very Expensive',
    }

    return priceMap[priceRange] || priceRange
  }, [])

  return (
    <Popup
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      className={cn('location-popup', className)}
      maxWidth="320px"
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Image Section */}
        {location.images.length > 0 && !imageError && (
          <div className="relative h-48 w-full">
            <img
              src={location.images[0]}
              alt={location.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />

            {/* Premium Badge */}
            {location.isPremium && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                PREMIUM
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold capitalize">
              {location.category}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {location.name}
              </h3>

              {location.rating && (
                <div className="flex items-center mt-1">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {location.rating.toFixed(1)}
                  </span>
                  {location.reviewCount && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({location.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {location.description}
          </p>

          {/* Price Range */}
          {location.priceRange && (
            <div className="text-sm text-gray-500 mb-3">
              {formatPriceRange(location.priceRange)}
            </div>
          )}

          {/* Tags */}
          {location.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {location.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {location.tags.length > 3 && (
                <span className="text-gray-400 text-xs">
                  +{location.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleNavigate}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
            >
              <NavigationIcon className="w-4 h-4" />
              Navigate
            </button>

            <button
              onClick={handleFavorite}
              className={cn(
                'p-2 rounded-md transition-colors',
                isFavorited
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              aria-label="Add to favorites"
            >
              <HeartIcon className={cn('w-4 h-4', isFavorited && 'fill-current')} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Share location"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Popup>
  )
}
```

#### 4.2 Popup Management Hook
**File:** `src/hooks/usePopups.ts`

```typescript
'use client'

import { useState, useCallback, useEffect } from 'react'
import { Location } from '@/lib/types'
import { usePopupStore } from '@/store/popupStore'

interface PopupState {
  location: Location | null
  coordinates: [number, number] | null
  isOpen: boolean
  source: 'marker' | 'search' | 'list' | null
}

export function usePopups() {
  const {
    activePopup,
    popupHistory,
    setActivePopup,
    closePopup,
    addToHistory,
  } = usePopupStore()

  const [popupState, setPopupState] = useState<PopupState>({
    location: null,
    coordinates: null,
    isOpen: false,
    source: null,
  })

  // Open popup for location
  const openPopup = useCallback((
    location: Location,
    coordinates: [number, number],
    source: PopupState['source'] = 'marker'
  ) => {
    const newPopupState = {
      location,
      coordinates,
      isOpen: true,
      source,
    }

    setPopupState(newPopupState)
    setActivePopup(location.id)
    addToHistory(location.id)
  }, [setActivePopup, addToHistory])

  // Close current popup
  const closeCurrentPopup = useCallback(() => {
    setPopupState(prev => ({
      ...prev,
      isOpen: false,
    }))
    closePopup()
  }, [closePopup])

  // Handle popup interactions
  const handleFavorite = useCallback((locationId: string) => {
    // TODO: Implement favorite functionality
    console.log('Favorite location:', locationId)
  }, [])

  const handleShare = useCallback((location: Location) => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: location.description,
        url: window.location.href,
      }).catch(console.error)
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }, [])

  const handleNavigate = useCallback((location: Location) => {
    // Open in maps app
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`
    window.open(url, '_blank')
  }, [])

  // Sync with store
  useEffect(() => {
    if (activePopup) {
      // TODO: Fetch location data and update popup state
    } else {
      closeCurrentPopup()
    }
  }, [activePopup, closeCurrentPopup])

  return {
    popupState,
    openPopup,
    closePopup: closeCurrentPopup,
    handleFavorite,
    handleShare,
    handleNavigate,
  }
}
```

### 5. Map Controls System (Priority: Medium)

#### 5.1 Zoom Controls Component
**File:** `src/components/map/Controls/ZoomControls.tsx`

```typescript
'use client'

import React, { useCallback } from 'react'
import { useMap } from 'react-map-gl'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ZoomControlsProps {
  className?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function ZoomControls({
  className = '',
  position = 'top-right'
}: ZoomControlsProps) {
  const { current: map } = useMap()

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  const handleZoomIn = useCallback(() => {
    if (!map) return
    map.easeTo({
      zoom: Math.min(map.getZoom() + 1, 18),
      duration: 300,
    })
  }, [map])

  const handleZoomOut = useCallback(() => {
    if (!map) return
    map.easeTo({
      zoom: Math.max(map.getZoom() - 1, 8),
      duration: 300,
    })
  }, [map])

  const canZoomIn = map ? map.getZoom() < 18 : false
  const canZoomOut = map ? map.getZoom() > 8 : false

  return (
    <div className={cn(
      'absolute z-10 flex flex-col gap-2',
      positionClasses[position],
      className
    )}>
      <button
        onClick={handleZoomIn}
        disabled={!canZoomIn}
        className={cn(
          'w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center transition-all',
          'hover:bg-gray-100 active:bg-gray-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'touch-manipulation' // Optimize for touch
        )}
        aria-label="Zoom in"
      >
        <ZoomInIcon className="w-5 h-5 text-gray-700" />
      </button>

      <button
        onClick={handleZoomOut}
        disabled={!canZoomOut}
        className={cn(
          'w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center transition-all',
          'hover:bg-gray-100 active:bg-gray-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'touch-manipulation' // Optimize for touch
        )}
        aria-label="Zoom out"
      >
        <ZoomOutIcon className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  )
}
```

#### 5.2 Location Button Component
**File:** `src/components/map/Controls/LocationButton.tsx`

```typescript
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useMap } from 'react-map-gl'
import { NavigationIcon, CrosshairIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LocationButtonProps {
  className?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  onLocationFound?: (coordinates: [number, number]) => void
}

export function LocationButton({
  className = '',
  position = 'top-right',
  onLocationFound
}: LocationButtonProps) {
  const { current: map } = useMap()
  const [isTracking, setIsTracking] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)

  const positionClasses = {
    'top-right': 'top-20 right-4', // Positioned below zoom controls
    'top-left': 'top-20 left-4',
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
  }

  // Handle location success
  const handleLocationSuccess = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords
    const coordinates: [number, number] = [longitude, latitude]

    if (map) {
      // Center map on user location
      map.easeTo({
        center: coordinates,
        zoom: Math.max(map.getZoom(), 14),
        duration: 1000,
      })

      // Add accuracy circle (TODO: Implement accuracy circle layer)
      console.log('Location accuracy:', accuracy)
    }

    onLocationFound?.(coordinates)
    setIsLocating(false)
  }, [map, onLocationFound])

  // Handle location error
  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    console.error('Location error:', error)
    setIsLocating(false)
    setIsTracking(false)

    // TODO: Show user-friendly error message
    alert('Unable to get your location. Please check your location settings.')
  }, [])

  // Start location tracking
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }

    // Get current position first
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      options
    )

    // Start watching position
    const id = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        ...options,
        maximumAge: 60000, // Allow 1 minute cache for watch
      }
    )

    setWatchId(id)
    setIsTracking(true)
  }, [handleLocationSuccess, handleLocationError])

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
  }, [watchId])

  // Toggle location tracking
  const toggleTracking = useCallback(() => {
    if (isTracking) {
      stopTracking()
    } else {
      startTracking()
    }
  }, [isTracking, startTracking, stopTracking])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return (
    <button
      onClick={toggleTracking}
      className={cn(
        'absolute z-10 w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center transition-all',
        'hover:bg-gray-100 active:bg-gray-200',
        'touch-manipulation',
        positionClasses[position],
        isTracking && 'bg-blue-500 hover:bg-blue-600',
        isLocating && 'animate-pulse',
        className
      )}
      aria-label={isTracking ? 'Stop tracking location' : 'Track my location'}
      disabled={isLocating}
    >
      {isTracking ? (
        <CrosshairIcon className="w-5 h-5 text-white" />
      ) : (
        <NavigationIcon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}
```

### 6. Performance Optimization (Priority: High)

#### 6.1 Mobile Performance Hook
**File:** `src/hooks/useMobilePerformance.ts`

```typescript
'use client'

import { useEffect, useCallback, useState } from 'react'
import { useMap } from 'react-map-gl'

interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
  tileCount: number
}

export function useMobilePerformance() {
  const { current: map } = useMap()
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    tileCount: 0,
  })

  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())

  // Detect low-end device
  useEffect(() => {
    const checkDevicePerformance = () => {
      // Check hardware concurrency
      const cpuCores = navigator.hardwareConcurrency || 4

      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory || 4

      // Check connection quality
      const connection = (navigator as any).connection
      const effectiveType = connection?.effectiveType || '4g'

      // Determine if low-end device
      const isLowEnd =
        cpuCores <= 4 ||
        memory <= 2 ||
        effectiveType === 'slow-2g' ||
        effectiveType === '2g'

      setIsLowEndDevice(isLowEnd)
    }

    checkDevicePerformance()
  }, [])

  // FPS monitoring
  useEffect(() => {
    let animationId: number

    const measureFPS = () => {
      frameCountRef.current++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTimeRef.current

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime)

        setMetrics(prev => ({
          ...prev,
          fps,
        }))

        frameCountRef.current = 0
        lastTimeRef.current = currentTime

        // Adjust performance based on FPS
        if (fps < 30 && map) {
          enablePerformanceMode()
        }
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [map])

  // Enable performance mode
  const enablePerformanceMode = useCallback(() => {
    if (!map) return

    // Reduce rendering quality
    map.setPaintProperty('background', 'background-color', '#1a1a1a')

    // Disable animations
    map.setStyle({
      ...map.getStyle(),
      transition: {
        duration: 0,
        delay: 0,
      },
    })

    // Reduce tile requests
    map.setMaxTiles(10)

    console.log('Performance mode enabled')
  }, [map])

  // Disable performance mode
  const disablePerformanceMode = useCallback(() => {
    if (!map) return

    // Restore normal settings
    map.setMaxTiles(25)

    console.log('Performance mode disabled')
  }, [map])

  // Monitor memory usage
  useEffect(() => {
    const checkMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / memory.totalJSHeapSize,
        }))
      }
    }

    const interval = setInterval(checkMemory, 5000)
    return () => clearInterval(interval)
  }, [])

  return {
    metrics,
    isLowEndDevice,
    enablePerformanceMode,
    disablePerformanceMode,
  }
}
```

#### 6.2 Performance-Optimized Map Container
**File:** `src/components/map/MapContainer.tsx`

```typescript
'use client'

import React, { useMemo, useCallback, useEffect } from 'react'
import { MapProvider } from './MapProvider'
import { MapController } from './MapController'
import { BaseMapLayer } from './MapLayers/BaseMapLayer'
import { MarkerLayer } from './MapLayers/MarkerLayer'
import { PopupLayer } from './MapLayers/PopupLayer'
import { ZoomControls } from './Controls/ZoomControls'
import { LocationButton } from './Controls/LocationButton'
import { LayerToggle } from './Controls/LayerToggle'
import { useMobilePerformance } from '@/hooks/useMobilePerformance'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

interface MapContainerProps {
  className?: string
  children?: React.ReactNode
  showControls?: boolean
  enablePerformanceMode?: boolean
}

export function MapContainer({
  className = '',
  children,
  showControls = true,
  enablePerformanceMode: enablePerfMode = true,
}: MapContainerProps) {
  const isMobile = useIsMobile()
  const {
    metrics,
    isLowEndDevice,
    enablePerformanceMode,
    disablePerformanceMode
  } = useMobilePerformance()

  // Auto-enable performance mode on low-end devices
  useEffect(() => {
    if (enablePerfMode && (isLowEndDevice || metrics.fps < 30)) {
      enablePerformanceMode()
    }
  }, [isLowEndDevice, metrics.fps, enablePerfMode, enablePerformanceMode])

  // Memoize control visibility based on device and performance
  const controlsConfig = useMemo(() => {
    const base = {
      showZoom: true,
      showLocation: true,
      showLayerToggle: !isLowEndDevice, // Hide on low-end devices
      showCompass: false, // Disable for mobile
    }

    // Adjust for mobile
    if (isMobile) {
      return {
        ...base,
        showLayerToggle: false, // Simplify mobile UI
      }
    }

    return base
  }, [isMobile, isLowEndDevice])

  // Handle map load with performance optimizations
  const handleMapLoad = useCallback((event: any) => {
    const map = event.target

    // Mobile optimizations
    if (isMobile) {
      // Disable high-DPI rendering for performance
      const canvas = map.getCanvas()
      if (canvas && window.devicePixelRatio > 2) {
        canvas.style.imageRendering = 'optimizeSpeed'
      }

      // Optimize touch interactions
      map.touchZoomRotate.enable()
      map.dragPan.enable()
      map.dragRotate.disable()
      map.touchPitch.disable()
    }

    // Performance mode optimizations
    if (isLowEndDevice) {
      map.setMaxTiles(10)
      map.setRenderWorldCopies(false)

      // Simplify terrain and 3D features
      if (map.getTerrain()) {
        map.setTerrain(null)
      }
    }

    console.log('Map loaded with optimizations:', {
      isMobile,
      isLowEndDevice,
      initialFPS: metrics.fps,
    })
  }, [isMobile, isLowEndDevice, metrics.fps])

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <MapProvider onLoad={handleMapLoad}>
        <MapController>
          {/* Map Layers */}
          <BaseMapLayer />
          <MarkerLayer />
          <PopupLayer />

          {/* Map Controls */}
          {showControls && (
            <>
              {controlsConfig.showZoom && (
                <ZoomControls position="top-right" />
              )}

              {controlsConfig.showLocation && (
                <LocationButton
                  position="top-right"
                  onLocationFound={(coords) => {
                    console.log('User location found:', coords)
                  }}
                />
              )}

              {controlsConfig.showLayerToggle && (
                <LayerToggle position="bottom-right" />
              )}
            </>
          )}

          {/* Custom Children */}
          {children}
        </MapController>
      </MapProvider>

      {/* Performance Indicator (Debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
          <div>FPS: {metrics.fps}</div>
          <div>Memory: {metrics.memoryUsage ? `${Math.round(metrics.memoryUsage * 100)}%` : 'N/A'}</div>
          <div>Device: {isLowEndDevice ? 'Low-end' : 'High-end'}</div>
          <div>Mode: {isLowEndDevice || metrics.fps < 30 ? 'Performance' : 'Normal'}</div>
        </div>
      )}
    </div>
  )
}
```

### 7. State Management (Priority: High)

#### 7.1 Map Store
**File:** `src/store/mapStore.ts`

```typescript
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { ViewState } from 'react-map-gl'

interface MapState {
  // View state
  viewState: ViewState | null
  setViewState: (viewState: ViewState) => void

  // Map style
  mapStyle: string
  setMapStyle: (style: string) => void

  // Boundaries
  boundaries: {
    north: number
    south: number
    east: number
    west: number
  } | null
  updateBoundaries: (bounds: any) => void

  // Map instance
  map: any
  setMap: (map: any) => void

  // UI state
  isFullscreen: boolean
  setIsFullscreen: (fullscreen: boolean) => void

  // Interaction state
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void

  // Performance
  performanceMode: boolean
  setPerformanceMode: (enabled: boolean) => void
}

export const useMapStore = create<MapState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // View state
      viewState: null,
      setViewState: (viewState) => set({ viewState }),

      // Map style
      mapStyle: 'https://api.maptiler.com/maps/streets-v2/style.json',
      setMapStyle: (mapStyle) => set({ mapStyle }),

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
      setIsDragging: (isDragging) => set({ isDragging }),

      // Performance
      performanceMode: false,
      setPerformanceMode: (performanceMode) => set({ performanceMode }),
    })),
    { name: 'map-store' }
  )
)
```

#### 7.2 Marker Store
**File:** `src/store/markerStore.ts`

```typescript
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { MapMarker, ClusterMarker } from '@/types/map'

interface MarkerState {
  // Markers
  markers: MapMarker[]
  clusters: ClusterMarker[]
  setMarkers: (markers: MapMarker[]) => void
  setClusters: (clusters: ClusterMarker[]) => void

  // Selection
  selectedMarker: string | null
  hoveredMarker: string | null
  setSelectedMarker: (markerId: string | null) => void
  setHoveredMarker: (markerId: string | null) => void

  // Visibility
  visibleCategories: string[]
  setVisibleCategories: (categories: string[]) => void

  // Filtering
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Favorites
  favoriteMarkers: Set<string>
  toggleFavorite: (markerId: string) => void

  // Clustering
  clusteringEnabled: boolean
  setClusteringEnabled: (enabled: boolean) => void
}

export const useMarkerStore = create<MarkerState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Markers
      markers: [],
      clusters: [],
      setMarkers: (markers) => set({ markers }),
      setClusters: (clusters) => set({ clusters }),

      // Selection
      selectedMarker: null,
      hoveredMarker: null,
      setSelectedMarker: (selectedMarker) => set({ selectedMarker }),
      setHoveredMarker: (hoveredMarker) => set({ hoveredMarker }),

      // Visibility
      visibleCategories: ['attraction', 'restaurant', 'event', 'park', 'beach', 'entertainment'],
      setVisibleCategories: (visibleCategories) => set({ visibleCategories }),

      // Filtering
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Favorites
      favoriteMarkers: new Set(),
      toggleFavorite: (markerId) => {
        const { favoriteMarkers } = get()
        const newFavorites = new Set(favoriteMarkers)

        if (newFavorites.has(markerId)) {
          newFavorites.delete(markerId)
        } else {
          newFavorites.add(markerId)
        }

        set({ favoriteMarkers: newFavorites })
      },

      // Clustering
      clusteringEnabled: true,
      setClusteringEnabled: (clusteringEnabled) => set({ clusteringEnabled }),
    })),
    { name: 'marker-store' }
  )
)
```

#### 7.3 Popup Store
**File:** `src/store/popupStore.ts`

```typescript
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface PopupState {
  // Active popup
  activePopup: string | null
  setActivePopup: (popupId: string | null) => void
  closePopup: () => void

  // History
  popupHistory: string[]
  addToHistory: (popupId: string) => void
  clearHistory: () => void

  // State
  popupData: Record<string, any>
  setPopupData: (popupId: string, data: any) => void

  // Position
  popupPosition: { x: number; y: number } | null
  setPopupPosition: (position: { x: number; y: number } | null) => void

  // Auto-close
  autoCloseEnabled: boolean
  autoCloseDelay: number
  setAutoCloseEnabled: (enabled: boolean) => void
  setAutoCloseDelay: (delay: number) => void
}

export const usePopupStore = create<PopupState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Active popup
      activePopup: null,
      setActivePopup: (activePopup) => set({ activePopup }),
      closePopup: () => set({ activePopup: null }),

      // History
      popupHistory: [],
      addToHistory: (popupId) => {
        const { popupHistory } = get()
        const newHistory = [popupId, ...popupHistory.filter(id => id !== popupId)]
        set({ popupHistory: newHistory.slice(0, 10) }) // Keep last 10
      },
      clearHistory: () => set({ popupHistory: [] }),

      // Data
      popupData: {},
      setPopupData: (popupId, data) => {
        const { popupData } = get()
        set({
          popupData: {
            ...popupData,
            [popupId]: data,
          },
        })
      },

      // Position
      popupPosition: null,
      setPopupPosition: (popupPosition) => set({ popupPosition }),

      // Auto-close
      autoCloseEnabled: true,
      autoCloseDelay: 5000,
      setAutoCloseEnabled: (autoCloseEnabled) => set({ autoCloseEnabled }),
      setAutoCloseDelay: (autoCloseDelay) => set({ autoCloseDelay }),
    })),
    { name: 'popup-store' }
  )
)
```

### 8. TypeScript Types (Priority: High)

#### 8.1 Complete Map Type Definitions
**File:** `src/types/map.ts`

```typescript
import { ViewState, MapEvent, MapLayerMouseEvent } from 'react-map-gl'
import { Location, LocationCategory } from '@/lib/types'

// Base map types
export interface MapConfig {
  initialViewState: ViewState
  maxBounds: [[number, number], [number, number]]
  mapStyle: string
  projection?: string
  maxZoom: number
  minZoom: number
  maxPitch: number
  minPitch: number
}

// Marker types
export interface MapMarker {
  id: string
  location: Location
  coordinates: [number, number]
  category: LocationCategory
  isActive: boolean
  isSelected: boolean
  isVisible: boolean
  zIndex: number
}

export interface ClusterMarker {
  id: string
  coordinates: [number, number]
  count: number
  locations: Location[]
  category: LocationCategory[]
  isActive: boolean
  zIndex: number
}

export interface UserLocationMarker {
  id: string
  coordinates: [number, number]
  accuracy: number
  heading?: number
  speed?: number
  timestamp: number
}

// Marker interactions
export interface MarkerInteraction {
  onClick: (marker: MapMarker) => void
  onDoubleClick: (marker: MapMarker) => void
  onHover: (marker: MapMarker | null) => void
  onLongPress: (marker: MapMarker) => void
}

export type MarkerStyle = {
  size: 'small' | 'medium' | 'large'
  color: string
  icon: string
  animation?: 'bounce' | 'pulse' | 'none'
  opacity?: number
}

// Popup types
export interface PopupData {
  location: Location
  coordinates: [number, number]
  source: 'marker' | 'search' | 'list' | null
  isVisible: boolean
}

export interface PopupOptions {
  closeOnClick?: boolean
  closeOnMove?: boolean
  anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  maxWidth?: string
}

// Control types
export interface ControlConfig {
  showZoom: boolean
  showLocation: boolean
  showLayerToggle: boolean
  showCompass: boolean
  showFullscreen: boolean
}

export interface ControlPosition {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

// Gesture types
export interface GestureState {
  isPinching: boolean
  isPanning: boolean
  initialDistance: number
  initialZoom: number
  lastTouchTime: number
  touchCount: number
}

export interface GestureEvent {
  type: 'pinchstart' | 'pinchmove' | 'pinchend' | 'panstart' | 'panmove' | 'panend'
  touches: TouchList
  center: { x: number; y: number }
  scale?: number
  distance?: number
}

// Performance types
export interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
  tileCount: number
  networkLatency?: number
}

export interface PerformanceConfig {
  enablePerformanceMode: boolean
  maxTiles: number
  enableCollisionDetection: boolean
  enableTerrain: boolean
  enable3D: boolean
  antialias: boolean
  fadeDuration: number
}

// Layer types
export interface LayerConfig {
  id: string
  type: 'background' | 'fill' | 'line' | 'symbol' | 'raster' | 'circle' | 'fill-extrusion' | 'heatmap' | 'hillshade'
  source: string
  layout?: Record<string, any>
  paint?: Record<string, any>
  filter?: any[]
  minzoom?: number
  maxzoom?: number
}

// Event types
export interface MapClickEvent extends MapLayerMouseEvent {
  features: any[]
  lngLat: { lng: number; lat: number }
  point: { x: number; y: number }
}

export interface MarkerClickEvent {
  marker: MapMarker
  originalEvent: React.MouseEvent
}

// Error types
export interface MapError extends Error {
  code: string
  source: 'maplibre' | 'react-map-gl' | 'network' | 'geolocation'
  recoverable: boolean
}

// Utility types
export type MapBounds = {
  north: number
  south: number
  east: number
  west: number
}

export type MapCoordinates = [number, number] // [longitude, latitude]

export type MapStyle = {
  id: string
  name: string
  url: string
  thumbnail?: string
  category: 'streets' | 'satellite' | 'hybrid' | 'terrain' | 'custom'
}

// Animation types
export interface MapAnimation {
  type: 'flyTo' | 'easeTo' | 'jumpTo'
  duration: number
  delay?: number
  curve?: number
  speed?: number
  screenSpeed?: number
}

// State types
export interface MapInteractionState {
  isDragging: boolean
  isZooming: boolean
  isRotating: boolean
  isPitching: boolean
  isFullscreen: boolean
}

// Export all marker styles
export const MARKER_STYLES: Record<LocationCategory, MarkerStyle>
```

### 9. Integration with Phase 3 (Preparation)

#### 9.1 Integration Hooks
**File:** `src/hooks/useIntegrationHooks.ts`

```typescript
'use client'

import { useEffect, useCallback } from 'react'
import { useMarkerStore } from '@/store/markerStore'
import { usePopupStore } from '@/store/popupStore'
import { Location } from '@/lib/types'

// Hook for Phase 3 data integration
export function useDataIntegration() {
  const { setMarkers, setVisibleCategories } = useMarkerStore()
  const { setActivePopup } = usePopupStore()

  // Load locations from API (Phase 3 integration)
  const loadLocations = useCallback(async (bounds?: MapBounds) => {
    try {
      // TODO: Replace with actual API call in Phase 3
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bounds }),
      })

      if (!response.ok) throw new Error('Failed to load locations')

      const locations: Location[] = await response.json()

      // Convert to map markers
      const markers = locations.map(location => ({
        id: location.id,
        location,
        coordinates: [location.longitude, location.latitude],
        category: location.category,
        isActive: false,
        isSelected: false,
        isVisible: true,
        zIndex: 100,
      }))

      setMarkers(markers)
    } catch (error) {
      console.error('Error loading locations:', error)
    }
  }, [setMarkers])

  // Filter locations by category
  const filterByCategory = useCallback((categories: string[]) => {
    setVisibleCategories(categories)
  }, [setVisibleCategories])

  // Select location (for integration with search/detail views)
  const selectLocation = useCallback((location: Location) => {
    setActivePopup(location.id)

    // TODO: Update URL and state for Phase 3 routing
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('location', location.id)
      window.history.replaceState({}, '', url.toString())
    }
  }, [setActivePopup])

  return {
    loadLocations,
    filterByCategory,
    selectLocation,
  }
}

// Hook for search integration (Phase 3)
export function useSearchIntegration() {
  const { setSearchQuery } = useMarkerStore()

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)

    // TODO: Call search API in Phase 3
    console.log('Search query:', query)
  }, [setSearchQuery])

  return {
    handleSearch,
  }
}

// Hook for user location integration (Phase 3)
export function useUserLocationIntegration() {
  const updateUserLocation = useCallback((coordinates: [number, number]) => {
    // TODO: Send location to backend for personalized recommendations
    console.log('User location updated:', coordinates)
  }, [])

  return {
    updateUserLocation,
  }
}
```

## Performance Benchmarks & Testing

### Mobile Performance Targets

```typescript
// Performance targets for mobile devices
export const PERFORMANCE_TARGETS = {
  // Frame rate
  TARGET_FPS: 60,
  MINIMUM_FPS: 30,

  // Load time
  INITIAL_LOAD_TIME: 3000, // 3 seconds
  TILE_LOAD_TIME: 1000, // 1 second per tile

  // Memory
  MAX_MEMORY_USAGE: 150, // MB
  MAX_TILE_MEMORY: 50, // MB

  // Touch response
  TOUCH_RESPONSE_TIME: 100, // milliseconds
  GESTURE_RESPONSE_TIME: 16, // 60fps

  // Network
  MAX_CONCURRENT_REQUESTS: 6,
  TILE_REQUEST_TIMEOUT: 5000, // 5 seconds
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 60,
    renderTime: 0,
    tileCount: 0,
  }

  private frameCount = 0
  private lastTime = performance.now()
  private observers: PerformanceObserver[] = []

  constructor() {
    this.setupObservers()
    this.startMonitoring()
  }

  private setupObservers() {
    // FPS monitoring
    const fpsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          this.updateMetrics(entry.name, entry.duration)
        }
      })
    })

    fpsObserver.observe({ entryTypes: ['measure'] })
    this.observers.push(fpsObserver)
  }

  private startMonitoring() {
    const measureFrame = () => {
      this.frameCount++
      const currentTime = performance.now()
      const deltaTime = currentTime - this.lastTime

      if (deltaTime >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime)
        this.frameCount = 0
        this.lastTime = currentTime

        this.checkPerformanceThresholds()
      }

      requestAnimationFrame(measureFrame)
    }

    requestAnimationFrame(measureFrame)
  }

  private updateMetrics(name: string, value: number) {
    switch (name) {
      case 'render-time':
        this.metrics.renderTime = value
        break
      case 'tile-count':
        this.metrics.tileCount = value
        break
    }
  }

  private checkPerformanceThresholds() {
    const { fps, renderTime, tileCount } = this.metrics

    if (fps < PERFORMANCE_TARGETS.MINIMUM_FPS) {
      console.warn(`Low FPS detected: ${fps}`)
      this.triggerPerformanceOptimization()
    }

    if (renderTime > 16) { // > 16ms means < 60fps
      console.warn(`High render time: ${renderTime}ms`)
    }

    if (tileCount > 25) {
      console.warn(`High tile count: ${tileCount}`)
    }
  }

  private triggerPerformanceOptimization() {
    // TODO: Implement automatic performance optimization
    console.log('Triggering performance optimization')
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect())
  }
}
```

## Success Criteria

### Functional Requirements
- [ ] MapLibre GL renders successfully on mobile devices
- [ ] Touch gestures (pinch zoom, pan) work smoothly
- [ ] Southern California boundaries are enforced
- [ ] Location markers display correctly
- [ ] Popups show location information
- [ ] Map controls are functional on mobile
- [ ] Performance maintains 30+ FPS on target devices
- [ ] Cluster markers work at appropriate zoom levels
- [ ] User location tracking functions properly
- [ ] Map styles load and switch correctly

### Performance Requirements
- [ ] Initial map load time < 3 seconds on 3G
- [ ] Touch response time < 100ms
- [ ] Memory usage < 150MB on mobile devices
- [ ] Smooth animations at 60fps (or 30fps minimum)
- [ ] Tile requests complete within 5 seconds
- [ ] No layout shifts during map interactions

### Mobile Experience Requirements
- [ ] No horizontal scrolling on mobile devices
- [ ] Touch targets are at least 44px (iOS) or 48dp (Android)
- [ ] Gestures don't conflict with browser defaults
- [ ] Safe area support for notched devices
- [ ] Readable text and buttons at default zoom
- [ ] Accessible controls for screen readers

### Integration Requirements
- [ ] TypeScript compilation passes without errors
- [ ] Zustand state management works correctly
- [ ] Component architecture is scalable
- [ ] Error boundaries handle map loading failures
- [ ] Hooks are reusable and documented
- [ ] Store integration works for future phases

## Testing Strategy

### Unit Testing
- Component rendering and props
- Hook functionality and edge cases
- Store state management
- Utility functions and calculations

### Integration Testing
- Map interactions and state updates
- Marker clustering algorithms
- Popup display and interactions
- Touch gesture handling
- Performance monitoring

### Mobile Testing
- Touch interactions on real devices
- Performance on various device classes
- Responsive design at different screen sizes
- Memory usage monitoring
- Network condition testing

### Performance Testing
- FPS monitoring during interactions
- Memory usage profiling
- Network request optimization
- Tile loading performance
- Animation smoothness assessment

## Risk Mitigation

### Technical Risks
1. **MapLibre GL Performance**: Mitigate with performance monitoring and adaptive quality
2. **Touch Gesture Conflicts**: Test extensively and implement proper event handling
3. **Memory Leaks**: Implement proper cleanup and monitoring
4. **Browser Compatibility**: Test across mobile browsers and implement fallbacks

### Mobile-Specific Risks
1. **Device Performance Variations**: Implement device detection and performance modes
2. **Network Conditions**: Optimize tile loading and implement offline strategies
3. **Touch Interface Limitations**: Ensure touch targets are properly sized
4. **Battery Usage**: Optimize rendering and implement power-saving features

### Integration Risks
1. **State Management Complexity**: Keep stores focused and well-documented
2. **Component Coupling**: Maintain loose coupling through props and hooks
3. **Future Extensibility**: Design interfaces for Phase 3 integration
4. **Performance Regression**: Implement continuous monitoring

## Documentation Requirements

### Technical Documentation
- [x] Phase 2 Implementation Plan (this document)
- [ ] Component API Documentation
- [ ] Hook Usage Guide
- [ ] Performance Optimization Guide
- [ ] Mobile Testing Checklist
- [ ] Troubleshooting Guide

### Code Documentation
- JSDoc comments for all functions and components
- TypeScript interface documentation
- Storybook stories for UI components
- Usage examples for custom hooks
- Performance benchmarking documentation

## Conclusion

Phase 2 establishes the core map functionality that serves as the foundation for the Drive SoCal POV application. The focus on mobile-first design, performance optimization, and GTA V-inspired interactions creates an engaging and responsive user experience.

The comprehensive component architecture, robust state management, and extensive performance monitoring ensure that the map system can scale to support future features while maintaining excellent performance on mobile devices.

**Key Achievements:**
- Fully functional MapLibre GL integration optimized for mobile
- Touch-first interaction design with gesture support
- Scalable component architecture built for extensibility
- Performance monitoring and optimization systems
- TypeScript-based type safety throughout the application
- Integration hooks prepared for Phase 3 features

The successful completion of Phase 2 provides a solid foundation for implementing advanced features like route planning, social features, and content management in subsequent phases.
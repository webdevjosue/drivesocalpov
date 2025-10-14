/**
 * MapLibre GL configuration for Drive SoCal POV
 * Mobile-optimized settings using OpenStreetMap tiles
 * Completely free solution with no API tokens required
 * Updated for @vis.gl/react-maplibre v8
 */

import { MapProps } from '@vis.gl/react-maplibre'

export interface MapConfig extends Omit<MapProps, 'mapboxAccessToken'> {
  initialViewState: {
    longitude: number
    latitude: number
    zoom: number
    pitch?: number
    bearing?: number
  }
  maxBounds: [[number, number], [number, number]]
  mapStyle: string | any
  projection?: 'mercator' | 'globe'
}

/**
 * Original Southern California boundaries (restrictive)
 */
export const SOUTHERN_CALIFORNIA_BOUNDS = {
  north: 35.5,    // Just north of LA County
  south: 32.5,    // Just south of Orange County
  east: -117.0,   // Inland Empire border
  west: -118.8,   // Pacific Ocean coastline
}

/**
 * Custom boundaries for Drive SoCal POV
 * Optimized for Southern California coverage with user-specified limits
 */
export const EXPANDED_BOUNDS = {
  north: 34.6,    // Palmdale area
  south: 31.5,    // Past Ensenada, Baja California
  east: -113.5,   // Past Yuma, Arizona
  west: -120.5,   // Past Santa Barbara
}

/**
 * Free OpenStreetMap tile sources
 * Completely free to use with no API tokens required
 */
export const OPENSTREETMAP_TILES = {
  // Standard OpenStreetMap tiles (free, no attribution required beyond standard)
  standard: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  },

  // CartoDB (free, based on OpenStreetMap data)
  cartodb: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors © CartoDB',
    maxZoom: 19,
  },

  // CartoDB Dark theme
  cartodb_dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors © CartoDB',
    maxZoom: 19,
  },

  // OpenTopoMap (topographic maps)
  opentopomap: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors © OpenTopoMap',
    maxZoom: 17,
  },

  // Stamen Toner (artistic maps)
  stamen_toner: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors © Stamen Design',
    maxZoom: 20,
  },

  // Stamen Terrain (terrain maps)
  stamen_terrain: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors © Stamen Design',
    maxZoom: 18,
  }
}

/**
 * MapLibre style definitions for OpenStreetMap tiles
 * Custom styles using free OSM tile sources
 */
export const OPENSTREETMAP_STYLES = {
  // Standard OSM style
  osm_standard: {
    version: 8,
    name: 'OpenStreetMap Standard',
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [OPENSTREETMAP_TILES.standard.url],
        tileSize: 256,
        attribution: OPENSTREETMAP_TILES.standard.attribution,
        maxzoom: OPENSTREETMAP_TILES.standard.maxZoom,
      }
    },
    layers: [
      {
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: OPENSTREETMAP_TILES.standard.maxZoom,
      }
    ]
  },

  // CartoDB Light style
  cartodb_light: {
    version: 8,
    name: 'CartoDB Light',
    sources: {
      'cartodb-tiles': {
        type: 'raster',
        tiles: [OPENSTREETMAP_TILES.cartodb.url],
        tileSize: 256,
        attribution: OPENSTREETMAP_TILES.cartodb.attribution,
        maxzoom: OPENSTREETMAP_TILES.cartodb.maxZoom,
      }
    },
    layers: [
      {
        id: 'cartodb-tiles-layer',
        type: 'raster',
        source: 'cartodb-tiles',
        minzoom: 0,
        maxzoom: OPENSTREETMAP_TILES.cartodb.maxZoom,
      }
    ]
  },

  // CartoDB Dark style
  cartodb_dark: {
    version: 8,
    name: 'CartoDB Dark',
    sources: {
      'cartodb-dark-tiles': {
        type: 'raster',
        tiles: [OPENSTREETMAP_TILES.cartodb_dark.url],
        tileSize: 256,
        attribution: OPENSTREETMAP_TILES.cartodb_dark.attribution,
        maxzoom: OPENSTREETMAP_TILES.cartodb_dark.maxZoom,
      }
    },
    layers: [
      {
        id: 'cartodb-dark-tiles-layer',
        type: 'raster',
        source: 'cartodb-dark-tiles',
        minzoom: 0,
        maxzoom: OPENSTREETMAP_TILES.cartodb_dark.maxZoom,
      }
    ]
  },

  // Stamen Toner style
  stamen_toner: {
    version: 8,
    name: 'Stamen Toner',
    sources: {
      'stamen-toner-tiles': {
        type: 'raster',
        tiles: [OPENSTREETMAP_TILES.stamen_toner.url],
        tileSize: 256,
        attribution: OPENSTREETMAP_TILES.stamen_toner.attribution,
        maxzoom: OPENSTREETMAP_TILES.stamen_toner.maxZoom,
      }
    },
    layers: [
      {
        id: 'stamen-toner-tiles-layer',
        type: 'raster',
        source: 'stamen-toner-tiles',
        minzoom: 0,
        maxzoom: OPENSTREETMAP_TILES.stamen_toner.maxZoom,
      }
    ]
  }
}

/**
 * Mobile-optimized map configuration
 * Following MapLibre GL JS official documentation best practices
 */
export const MAP_CONFIG: MapConfig = {
  // Optimized initial view for mobile devices
  initialViewState: {
    longitude: -118.2437, // Downtown LA
    latitude: 34.0522,
    zoom: 11,            // Slightly zoomed in for better mobile experience
    pitch: 0,
    bearing: 0,
  },

  // Custom boundaries: Palmdale (N), Ensenada (S), Yuma (E), Santa Barbara (W)
  // Strict enforcement prevents panning outside these bounds
  maxBounds: [
    [EXPANDED_BOUNDS.west, EXPANDED_BOUNDS.south],
    [EXPANDED_BOUNDS.east, EXPANDED_BOUNDS.north]
  ],

  // OpenStreetMap configuration - Completely free tiles, no API tokens required
  mapStyle: OPENSTREETMAP_STYLES.osm_standard,
  projection: 'mercator' as const,

  // Mobile-optimized touch interactions (per official docs)
  dragPan: true,
  dragRotate: false,           // Disabled for better mobile UX
  scrollZoom: true,
  doubleClickZoom: false,      // Use pinch zoom on mobile instead
  touchZoomRotate: true,       // Enable pinch-to-zoom
  touchPitch: false,           // Disabled for mobile performance
  keyboard: false,             // Disabled on mobile

  // Performance-optimized zoom levels
  maxZoom: 18,
  minZoom: 8,
  maxPitch: 0,
  minPitch: 0,

  // Rendering optimization settings
  reuseMaps: true,
}

/**
 * Drive SoCal POV map styles - Free OpenStreetMap alternatives (no API tokens required)
 * Multiple style options for different use cases and visual preferences
 */
export const GTA_MAP_STYLES = {
  day: OPENSTREETMAP_STYLES.osm_standard,        // Standard OpenStreetMap
  night: OPENSTREETMAP_STYLES.cartodb_dark,      // Dark theme for night driving
  satellite: OPENSTREETMAP_STYLES.cartodb_light,  // Light view (closest to satellite available)
  hybrid: OPENSTREETMAP_STYLES.cartodb_light,     // Clean hybrid view
  streets: OPENSTREETMAP_STYLES.stamen_toner,     // High contrast street view
}

/**
 * Mobile performance configuration
 * Based on MapLibre GL JS performance optimization guidelines
 */
export const MOBILE_PERFORMANCE_CONFIG = {
  // Reduce tile requests for better mobile performance
  maxTileCacheSize: 50,
  enableCollisionDetection: true,
  enableTerrain: false,        // Disabled for mobile performance
  enable3D: false,            // Disabled for mobile performance

  // Optimized rendering settings
  fadeDuration: 300,          // Faster transitions on mobile
  antialias: false,           // Disabled for performance on mobile

  // Resource optimization (per official docs)
  renderWorldCopies: false,   // Reduce memory usage
  preserveDrawingBuffer: false, // Reduce memory usage
}

/**
 * Touch gesture configuration
 * Following mobile UX best practices from official documentation
 */
export const TOUCH_GESTURE_CONFIG = {
  // Enhanced mobile touch settings
  cooperativeGestures: true,  // Better gesture handling on mobile
  touchZoomRotate: true,
  touchPitch: false,          // Disabled for simpler mobile UX

  // Performance optimizations
  touchAction: 'pan-y',       // CSS touch-action for better performance

  // Gesture sensitivity settings
  zoomSpeed: 0.5,            // Reduced for smoother mobile zoom
  panSpeed: 1.0,              // Standard pan speed
}

/**
 * Performance thresholds and limits
 * Based on mobile device capabilities and user experience standards
 */
export const PERFORMANCE_THRESHOLDS = {
  // Frame rate targets
  TARGET_FPS: 60,
  MINIMUM_FPS: 30,

  // Memory limits (in MB)
  MAX_MEMORY_USAGE: 150,
  MAX_TILE_MEMORY: 50,

  // Network performance (in milliseconds)
  TILE_LOAD_TIMEOUT: 5000,
  API_REQUEST_TIMEOUT: 3000,

  // Touch response times
  TOUCH_RESPONSE_TIME: 100,
  GESTURE_RESPONSE_TIME: 16, // 60fps
}

/**
 * Default marker styles for different location categories
 * Following mobile design guidelines for touch targets
 */
export const MARKER_STYLE_CONFIG = {
  // Touch target size (44px minimum per Apple HIG)
  touchTargetSize: 44,

  // Visual sizes
  small: 32,
  medium: 40,
  large: 48,

  // Z-index layers for proper visual hierarchy
  layers: {
    base: 100,
    markers: 200,
    clusters: 300,
    selected: 400,
    userLocation: 500,
    popups: 600,
    controls: 700,
  },
}

/**
 * Map bounds utilities
 * Helper functions for geographic calculations
 */
export const BOUNDS_UTILS = {
  // Check if coordinates are within original Southern California bounds
  isInSouthernCalifornia: (lat: number, lng: number): boolean => {
    return (
      lat >= SOUTHERN_CALIFORNIA_BOUNDS.south &&
      lat <= SOUTHERN_CALIFORNIA_BOUNDS.north &&
      lng >= SOUTHERN_CALIFORNIA_BOUNDS.west &&
      lng <= SOUTHERN_CALIFORNIA_BOUNDS.east
    )
  },

  // Check if coordinates are within expanded bounds (for local development)
  isInExpandedBounds: (lat: number, lng: number): boolean => {
    return (
      lat >= EXPANDED_BOUNDS.south &&
      lat <= EXPANDED_BOUNDS.north &&
      lng >= EXPANDED_BOUNDS.west &&
      lng <= EXPANDED_BOUNDS.east
    )
  },

  // Clamp coordinates to expanded bounds (for local development)
  clampToExpandedBounds: (lat: number, lng: number): [number, number] => {
    return [
      Math.max(EXPANDED_BOUNDS.west,
               Math.min(EXPANDED_BOUNDS.east, lng)),
      Math.max(EXPANDED_BOUNDS.south,
               Math.min(EXPANDED_BOUNDS.north, lat))
    ]
  },

  // Clamp coordinates to Southern California bounds (original restrictive behavior)
  clampToSouthernCalifornia: (lat: number, lng: number): [number, number] => {
    return [
      Math.max(SOUTHERN_CALIFORNIA_BOUNDS.west,
               Math.min(SOUTHERN_CALIFORNIA_BOUNDS.east, lng)),
      Math.max(SOUTHERN_CALIFORNIA_BOUNDS.south,
               Math.min(SOUTHERN_CALIFORNIA_BOUNDS.north, lat))
    ]
  },

  // Calculate center point of expanded bounds (for local development)
  getExpandedBoundsCenter: (): [number, number] => {
    return [
      (EXPANDED_BOUNDS.west + EXPANDED_BOUNDS.east) / 2,
      (EXPANDED_BOUNDS.south + EXPANDED_BOUNDS.north) / 2
    ]
  },

  // Calculate center point of Southern California (original)
  getSouthernCaliforniaCenter: (): [number, number] => {
    return [
      (SOUTHERN_CALIFORNIA_BOUNDS.west + SOUTHERN_CALIFORNIA_BOUNDS.east) / 2,
      (SOUTHERN_CALIFORNIA_BOUNDS.south + SOUTHERN_CALIFORNIA_BOUNDS.north) / 2
    ]
  },
}

/**
 * Environment validation
 * OpenStreetMap tiles are completely free - no API tokens required
 */
export function validateMapEnvironment(): void {
  // OpenStreetMap tiles are free and don't require any API tokens
  // No validation needed for free tile sources
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '✅ Using OpenStreetMap tiles - Completely free with no API tokens required!\n' +
      '🗺️  Tile sources: OpenStreetMap, CartoDB, Stamen Design\n' +
      '📍  Coverage: Worldwide\n' +
      '🔄  Max Zoom: 19-20 depending on style\n' +
      '💰  Cost: FREE'
    )
  }
}

/**
 * Get optimized configuration for current device
 * Adapts settings based on device capabilities
 */
export function getOptimizedConfig(): Partial<MapConfig> {
  // Check for mobile device
  const isMobile = typeof window !== 'undefined' &&
    ('ontouchstart' in window) &&
    (window.innerWidth <= 768)

  // Check for low-end device
  const isLowEnd = typeof navigator !== 'undefined' && (
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2)
  )

  const config: Partial<MapConfig> = {}

  if (isMobile) {
    // Mobile optimizations
    Object.assign(config, {
      ...MOBILE_PERFORMANCE_CONFIG,
      fadeDuration: isLowEnd ? 0 : 300,
    })
  }

  if (isLowEnd) {
    // Low-end device optimizations
    Object.assign(config, {
      maxTileCacheSize: 25,
      fadeDuration: 0,
      renderWorldCopies: false,
    })
  }

  return config
}
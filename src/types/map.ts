/**
 * Comprehensive TypeScript types for Drive SoCal POV map system
 * Following official MapLibre GL and React Map GL type patterns
 * Updated for @vis.gl/react-maplibre v8
 */

import { ViewState, MapLayerMouseEvent } from '@vis.gl/react-maplibre'
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

export interface PopupState {
  popupData: PopupData | null
  options: PopupOptions
  isOpen: boolean
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
  maxTileCacheSize: number
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
  layout?: Record<string, unknown>
  paint?: Record<string, unknown>
  filter?: unknown[]
  minzoom?: number
  maxzoom?: number
}

// Event types
export interface MapClickEvent {
  features: unknown[]
  lngLat: { lng: number; lat: number }
  point: { x: number; y: number }
  originalEvent: MapLayerMouseEvent
}

export interface MarkerClickEvent {
  marker: MapMarker
  originalEvent: React.MouseEvent
}

// Error types
export interface MapError extends Error {
  code: string
  source: 'maplibre' | 'react-maplibre' | 'network' | 'geolocation'
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

// Touch-specific types for mobile
export interface TouchConfig {
  touchAction: 'auto' | 'none' | 'pan-x' | 'pan-y' | 'manipulation'
  touchZoomRotate: boolean
  touchPitch: boolean
  cooperativeGestures: boolean
}

export interface MobileDeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isTouchDevice: boolean
  devicePixelRatio: number
  screenWidth: number
  screenHeight: number
  orientation: 'portrait' | 'landscape'
  isLowEndDevice: boolean
  connectionType: string
  memoryInfo: {
    deviceMemory?: number
    hardwareConcurrency?: number
  }
}

// Map loading states
export type MapLoadingState =
  | 'loading'
  | 'loaded'
  | 'error'
  | 'style-loading'
  | 'style-loaded'
  | 'source-loading'
  | 'source-loaded'

// Map style types for GTA V theme
export interface GTAMapStyle extends MapStyle {
  timeOfDay: 'day' | 'night' | 'dawn' | 'dusk'
  theme: 'gta-v' | 'gta-online' | 'custom'
}

// Location clustering types
export interface ClusteringConfig {
  enabled: boolean
  radius: number
  maxZoom: number
  minPoints: number
  extent: number
  nodeSize: number
}

// Geolocation types
export interface GeolocationState {
  isTracking: boolean
  isLocating: boolean
  currentPosition: MapCoordinates | null
  accuracy: number | null
  heading: number | null
  speed: number | null
  error: GeolocationPositionError | null
}

// Map bounds for API calls
export interface MapBoundsForAPI {
  northEast: MapCoordinates
  southWest: MapCoordinates
}

// Search integration types
export interface MapSearchState {
  query: string
  isSearching: boolean
  results: Location[]
  selectedIndex: number | null
  showResults: boolean
}

// Route planning types (for future Phase 4)
export interface RoutePoint {
  coordinates: MapCoordinates
  location?: Location
  type: 'start' | 'waypoint' | 'end'
}

export interface RouteOptions {
  mode: 'driving' | 'walking' | 'cycling'
  avoidTolls: boolean
  avoidHighways: boolean
  optimize: boolean
}

// Component prop types
export interface MapContainerProps {
  className?: string
  children?: React.ReactNode
  showControls?: boolean
  enablePerformanceMode?: boolean
  initialViewState?: Partial<ViewState>
}

export interface MarkerLayerProps {
  markers: MapMarker[]
  clusters: ClusterMarker[]
  onMarkerClick: (marker: MapMarker) => void
  onClusterClick: (cluster: ClusterMarker) => void
  selectedMarkerId?: string | null
}

export interface PopupLayerProps {
  popupData: PopupData | null
  onClose: () => void
  onFavorite?: (locationId: string) => void
  onShare?: (location: Location) => void
  onNavigate?: (location: Location) => void
}

// MapLibre interface for Drive SoCal POV
export interface DriveSoCalMap {
  // Core map methods
  getCenter(): { lng: number; lat: number }
  getZoom(): number
  getBearing(): number
  getPitch(): number
  setCenter(center: { lng: number; lat: number }): void
  setZoom(zoom: number): void
  setBearing(bearing: number): void
  setPitch(pitch: number): void
  jumpTo(options: { center?: [number, number]; zoom?: number; bearing?: number; pitch?: number; essential?: boolean }): void
  flyTo(options: { center?: [number, number]; zoom?: number; bearing?: number; pitch?: number; duration?: number; essential?: boolean }): void
  easeTo(options: { center?: [number, number]; zoom?: number; bearing?: number; pitch?: number; duration?: number; essential?: boolean }): void

  // Map state methods
  getContainer(): HTMLElement
  getCanvas(): HTMLCanvasElement
  getBounds(): { getNorthEast(): { lng: number; lat: number }; getSouthWest(): { lng: number; lat: number } }
  getMaxBounds(): { getNorthEast(): { lng: number; lat: number }; getSouthWest(): { lng: number; lat: number } } | null
  setMaxBounds(bounds: [[number, number], [number, number]] | null): void
  getMinZoom(): number
  getMaxZoom(): number
  setMinZoom(zoom: number): void
  setMaxZoom(zoom: number): void
  setRenderWorldCopies(renderWorldCopies: boolean): void
  resize(): void

  // Map style methods
  getStyle(): Record<string, unknown> | undefined
  setStyle(style: string | Record<string, unknown>): void
  setPaintProperty(layer: string, name: string, value: unknown): void

  // Style object access
  style?: { glyphs?: string }

  // Touch interactions
  touchZoomRotate: { enable(): void; disable(): void; isEnabled(): boolean }
  dragPan: { enable(): void; disable(): void; isEnabled(): boolean }
  dragRotate: { enable(): void; disable(): void; isEnabled(): boolean }
  touchPitch: { enable(): void; disable(): void; isEnabled(): boolean }

  // React MapLibre compatibility
  getMap(): DriveSoCalMap
}

// Hook return types
export interface UseMapReturn {
  map: DriveSoCalMap | null
  isLoaded: boolean
  isLoading: boolean
  error: MapError | null
  viewState: ViewState | null
}

export interface UseMarkersReturn {
  markers: MapMarker[]
  clusters: ClusterMarker[]
  selectedMarker: string | null
  hoveredMarker: string | null
  visibleMarkers: MapMarker[]
  handleMarkerClick: (marker: MapMarker) => void
  handleMarkerHover: (marker: MapMarker | null) => void
  updateViewState: () => void
}

export interface UsePopupsReturn {
  popupState: PopupState
  openPopup: (location: Location, coordinates: [number, number], source?: string) => void
  closePopup: () => void
  handleFavorite: (locationId: string) => void
  handleShare: (location: Location) => void
  handleNavigate: (location: Location) => void
}

// Performance monitoring types
export interface PerformanceMonitor {
  start: () => void
  stop: () => void
  getMetrics: () => PerformanceMetrics
  isMonitoring: boolean
}

// Animation easing types
export type EasingFunction =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | ((t: number) => number)

// Map feature types for GeoJSON
export interface MapFeature {
  type: 'Feature'
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon'
    coordinates: number[] | number[][] | number[][][]
  }
  properties: Record<string, unknown>
}

export interface MapFeatureCollection {
  type: 'FeatureCollection'
  features: MapFeature[]
}

// Accessibility types
export interface MapAccessibility {
  announcements: string[]
  keyboardNavigation: boolean
  screenReaderEnabled: boolean
  highContrastMode: boolean
  reducedMotion: boolean
}

// Debug types
export interface DebugInfo {
  fps: number
  memoryUsage: number
  tileCount: number
  markerCount: number
  networkRequests: number
  lastError: MapError | null
}


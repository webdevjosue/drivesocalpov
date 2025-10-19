# Technical Architecture Documentation

## 📋 Overview

Drive SoCal POV is built on a modern, performance-optimized technology stack designed specifically for mobile-first interactive map experiences. The architecture prioritizes performance, type safety, and developer experience.

## 🏗️ System Architecture

### **Layer 1: Foundation Framework**
```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15+ (App Router)                  │
│  • Turbopack for ultra-fast builds                         │
│  • Server Components by default                            │
│  • Client Components for interactivity                      │
│  • File-based routing                                       │
└─────────────────────────────────────────────────────────────┘
```

### **Layer 2: UI Framework**
```
┌─────────────────────────────────────────────────────────────┐
│                       React 19                              │
│  • Concurrent Features                                      │
│  • Automatic Batching                                       │
│  • Suspense + Streaming                                     │
│  • Server Components                                        │
└─────────────────────────────────────────────────────────────┘
```

### **Layer 3: State Management**
```
┌─────────────────────────────────────────────────────────────┐
│                      Zustand v5                             │
│  • Lightweight (2.5kb)                                      │
│  • React 19 concurrency support                             │
│  • TypeScript first                                         │
│  • Devtools integration                                     │
└─────────────────────────────────────────────────────────────┘
```

### **Layer 4: Map System**
```
┌─────────────────────────────────────────────────────────────┐
│                  @vis.gl/react-maplibre v8                   │
│  • Modern React MapLibre integration                        │
│  • TypeScript support                                       │
│  • Mobile optimized                                         │
│  • Performance monitoring                                   │
└─────────────────────────────────────────────────────────────┘
```

### **Layer 5: Tile Rendering**
```
┌─────────────────────────────────────────────────────────────┐
│                  MapLibre GL v5.9                            │
│  • Hardware acceleration                                    │
│  • Vector tile rendering                                    │
│  • Custom styling                                           │
│  • Bounds enforcement                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🗺️ Map Architecture

### **Tile Provider System**
```typescript
// Multiple free tile sources with fallback
export const OPENSTREETMAP_TILES = {
  standard: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  },
  cartodb: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors © CartoDB',
    maxZoom: 19,
  },
  // ... additional providers
}
```

### **Bounds Enforcement System**
```typescript
// Real-time boundary checking
export const EXPANDED_BOUNDS = {
  north: 34.6,    // Palmdale area
  south: 31.5,    // Past Ensenada, Baja California
  east: -113.5,   // Past Yuma, Arizona
  west: -120.5,   // Past Santa Barbara
}

// Enforcement through MapLibre maxBounds
maxBounds: [
  [EXPANDED_BOUNDS.west, EXPANDED_BOUNDS.south],
  [EXPANDED_BOUNDS.east, EXPANDED_BOUNDS.north]
]
```

### **Style System**
```typescript
// MapLibre Style Specification v8
export const OPENSTREETMAP_STYLES = {
  osm_standard: {
    version: 8,
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
  }
}
```

## 📱 Mobile Architecture

### **Device Detection System**
```typescript
interface MobileDeviceInfo {
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
```

### **Performance Optimization**
```typescript
export const MOBILE_PERFORMANCE_CONFIG = {
  maxTileCacheSize: 50,        // Reduced cache for mobile
  enableCollisionDetection: true,
  fadeDuration: 300,            // Faster transitions
  antialias: false,             // Disable for performance
  pitchWithRotate: false,       // Reduce 3D calculations
  dragRotate: false,            // Simplify interactions
  touchZoomRotate: true,        // Enable pinch zoom
  doubleClickZoom: false,       // Disable on mobile
}
```

### **Touch Gesture System**
```typescript
// Custom touch handlers for mobile optimization
const touchHandlers = {
  onTouchStart: handleTouchStart,
  onTouchMove: handleTouchMove,
  onTouchEnd: handleTouchEnd,
  onPinchStart: handlePinchStart,
  onPinchMove: handlePinchMove,
  onPinchEnd: handlePinchEnd,
}
```

## 🔧 Component Architecture

### **Map Component Hierarchy**
```
MapProvider (Main map component)
├── MapContainer (State management wrapper)
│   ├── useMapStore (Zustand state)
│   ├── useMobileDetection (Device detection)
│   └── usePerformanceMonitor (Performance tracking)
├── MapLibre (Core map rendering)
│   ├── Custom controls (Mobile-optimized)
│   ├── Touch handlers (Gesture recognition)
│   └── Bounds enforcement (Geographic limits)
└── ErrorBoundary (Error handling & recovery)
```

### **State Management Architecture**
```typescript
// Zustand store with React 19 concurrency
interface MapState {
  // View state
  viewState: ViewState | null
  setViewState: (viewState: ViewState) => void

  // Map configuration
  mapStyle: any
  performanceMode: boolean

  // Mobile optimization
  deviceInfo: MobileDeviceInfo | null
  performanceMetrics: PerformanceMetrics

  // Loading states
  loading: boolean
  error: Error | null
  styleLoaded: boolean
}
```

## 🚀 Performance Architecture

### **Performance Monitoring**
```typescript
interface PerformanceMetrics {
  fps: number                    // Frame rate monitoring
  renderTime: number            // Render time tracking
  tileCount: number             // Tile count optimization
  deviceLoad: number            // CPU/GPU usage
  networkLatency: number        // Network performance
  memoryUsage?: number          // Memory optimization
}
```

### **Optimization Strategies**
1. **Lazy Loading**: Components and tiles loaded on demand
2. **Memoization**: React.memo for expensive components
3. **Debouncing**: Input event optimization
4. **Virtual Scrolling**: For large datasets (future)
5. **Code Splitting**: Automatic with Next.js
6. **Image Optimization**: Next.js Image component
7. **Tile Caching**: Intelligent caching strategies

## 🛡️ Error Handling Architecture

### **Error Boundaries**
```typescript
class MapErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map Error:', error, errorInfo)
    // Attempt recovery strategies
  }
}
```

### **Fallback Strategies**
1. **Style Fallback**: Multiple tile sources
2. **Network Recovery**: Automatic retry mechanism
3. **Performance Mode**: Degraded quality for low-end devices
4. **Offline Support**: Cached tiles for offline viewing

## 🔒 Security Architecture

### **Security Measures**
1. **No API Keys**: OpenStreetMap requires no authentication
2. **CSP Headers**: Content Security Policy for XSS protection
3. **HTTPS Only**: Secure connections required
4. **Input Validation**: TypeScript ensures type safety
5. **Dependency Security**: Regular audits with npm audit

## 📊 Monitoring & Analytics

### **Performance Monitoring**
```typescript
// Real-time performance tracking
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    tileCount: 0,
    deviceLoad: 0,
    networkLatency: 0,
  })

  // Performance optimization logic
  const optimizePerformance = useCallback(() => {
    // Automatic quality adjustment based on metrics
  }, [metrics])
}
```

### **Error Tracking**
- Console error monitoring
- Performance metric alerts
- Network failure detection
- User interaction logging

## 🚀 Deployment Architecture

### **Build Process**
1. **Development**: Turbopack for sub-second builds
2. **Production**: Optimized webpack build
3. **Static Assets**: CDN optimization
4. **Code Splitting**: Automatic route-based splitting
5. **Bundle Analysis**: Size optimization

### **Environment Configuration**
```typescript
// Environment-specific configuration
const config = {
  development: {
    mapStyle: OPENSTREETMAP_STYLES.osm_standard,
    performanceMonitoring: true,
    debugMode: true,
  },
  production: {
    mapStyle: OPENSTREETMAP_STYLES.osm_standard,
    performanceMonitoring: false,
    debugMode: false,
  }
}
```

## 🔮 Future Architecture Considerations

### **Phase 3 Enhancements**
1. **UI Component Library**: Reusable mobile components
2. **Navigation System**: Slide-out menu implementation
3. **Gesture System**: Advanced touch interactions
4. **Animation System**: Smooth transitions

### **Phase 4 Integration**
1. **Supabase Integration**: Database and authentication
2. **Data Layer**: Location content management
3. **API Integration**: Real-time data fetching
4. **Caching Strategy**: Offline-first approach

### **Performance Roadmap**
1. **Web Workers**: Background processing
2. **Service Workers**: Offline capabilities
3. **Progressive Web App**: Native app experience
4. **WebAssembly**: Performance-critical calculations

---

*Architecture documentation current as of Phase 2 completion*
# Chrome DevTools Debugging Guide - Drive SoCal POV

## Overview

This comprehensive guide provides debugging workflows and troubleshooting techniques specifically tailored for the Drive SoCal POV mobile-first travel guide application. Learn how to effectively use Chrome DevTools to debug performance issues, optimize mobile experience, and troubleshoot map-related problems.

## 🎯 Essential Chrome DevTools Workflows

### 1. Performance Profiling Workflow

**Setup for Drive SoCal POV Map Debugging:**

1. **Open Chrome DevTools** (F12 or Ctrl+Shift+I)
2. **Navigate to Performance Tab**
3. **Start Recording** with these settings:
   - ✅ Screenshots (for visual debugging)
   - ✅ Memory (for leak detection)
   - ✅ Network throttling (set to "Fast 3G" for mobile testing)
4. **Execute typical user flows**:
   - Map pan and zoom gestures
   - Marker interactions
   - Popup opening/closing
   - Location search
5. **Stop recording** and analyze results

**Key Metrics to Analyze:**

```javascript
// Monitor in Console during performance recording
console.time('map-render-time');
// ... perform map operations
console.timeEnd('map-render-time');

// Memory usage tracking
console.log('Memory used:', performance.memory?.usedJSHeapSize);

// FPS monitoring
let lastTime = performance.now();
let frames = 0;

function checkFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${Math.round(frames * 1000 / (currentTime - lastTime))}`);
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(checkFPS);
}
checkFPS();
```

**Performance Analysis Checklist:**

- [ ] **Main Thread Activity**: Look for long tasks (>50ms) that block UI
- [ ] **FPS Consistency**: Frame rate should stay above 30fps during interactions
- [ ] **Memory Allocation**: Watch for memory growth patterns indicating leaks
- [ ] **Network Requests**: Identify slow or unnecessary requests
- [ ] **Rendering Pipeline**: Check for expensive paint/composite operations

### 2. Mobile Device Debugging Workflow

**Device Mode Setup:**

1. **Toggle Device Toolbar** (Ctrl+Shift+M or Cmd+Shift+M)
2. **Select Mobile Devices** for testing:
   - iPhone SE (375x667) - Small mobile
   - iPhone 12 Pro (390x844) - Standard mobile
   - iPad (768x1024) - Tablet
3. **Set Network Throttling**:
   - "Fast 3G" for baseline mobile testing
   - "Slow 3G" for worst-case testing
   - "Offline" for offline functionality testing

**Mobile-Specific Debugging:**

```javascript
// Touch interaction debugging
document.addEventListener('touchstart', (e) => {
  console.log('Touch start:', {
    touches: e.touches.length,
    timestamp: Date.now(),
    coordinates: Array.from(e.touches).map(t => ({
      x: t.clientX,
      y: t.clientY
    }))
  });
});

// Viewport and responsive debugging
function logViewportInfo() {
  console.log('Viewport:', {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    orientation: window.orientation
  });
}

window.addEventListener('resize', logViewportInfo);
logViewportInfo();

// Safe area debugging (for notched devices)
function logSafeAreaInsets() {
  const computedStyle = getComputedStyle(document.documentElement);
  console.log('Safe area insets:', {
    top: computedStyle.getPropertyValue('env(safe-area-inset-top)'),
    right: computedStyle.getPropertyValue('env(safe-area-inset-right)'),
    bottom: computedStyle.getPropertyValue('env(safe-area-inset-bottom)'),
    left: computedStyle.getPropertyValue('env(safe-area-inset-left)')
  });
}
```

**Mobile Testing Checklist:**

- [ ] **Touch Interactions**: Test all gestures (pinch, pan, tap, long press)
- [ ] **Responsive Layout**: Verify layout adapts to different screen sizes
- [ ] **Performance**: Check performance on slower network conditions
- [ ] **Safe Area Support**: Test on devices with notches/cutouts
- [ ] **Keyboard Behavior**: Test virtual keyboard interactions
- [ ] **Orientation Changes**: Verify layout adapts to portrait/landscape

### 3. Network Request Debugging

**Network Tab Configuration:**

1. **Filter network requests** by type:
   - XHR/Fetch: API calls
   - JS: JavaScript bundles
   - CSS: Stylesheets
   - Img: Images and map tiles
2. **Set throttling** to test different network conditions
3. **Enable request blocking** to test offline scenarios

**Map-Specific Network Debugging:**

```javascript
// Monitor map tile requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const [url, options] = args;

  if (url.includes('tiles') || url.includes('maps')) {
    console.log('Map tile request:', url);
    const startTime = performance.now();

    return originalFetch.apply(this, args)
      .then(response => {
        const endTime = performance.now();
        console.log(`Tile loaded in ${endTime - startTime}ms:`, response.status);
        return response;
      })
      .catch(error => {
        console.error('Tile load failed:', url, error);
        throw error;
      });
  }

  return originalFetch.apply(this, args);
};

// API request monitoring
function monitorAPIRequests() {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('/api/')) {
        console.log('API Request:', {
          url: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          timestamp: entry.startTime
        });
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
}
monitorAPIRequests();
```

**Network Optimization Checklist:**

- [ ] **Request Count**: Minimize total number of requests
- [ ] **Bundle Size**: Check for large JavaScript/CSS files
- [ ] **Tile Loading**: Optimize map tile request patterns
- [ ] **Caching**: Verify proper cache headers
- [ ] **Compression**: Ensure gzip/brotli compression
- [ ] **HTTP/2**: Check for protocol optimizations

### 4. Memory Leak Detection

**Memory Tab Workflow:**

1. **Take heap snapshot** before performing actions
2. **Execute potentially problematic operations**:
   - Open/close many popups
   - Add/remove markers repeatedly
   - Navigate between map views
3. **Take heap snapshot** after operations
4. **Compare snapshots** to identify leaked objects

**Memory Monitoring Code:**

```javascript
// Memory usage tracker
class MemoryTracker {
  constructor() {
    this.snapshots = [];
    this.isTracking = false;
  }

  startTracking() {
    this.isTracking = true;
    this.snapshots = [];
    this.takeSnapshot('Initial');

    // Track memory every 5 seconds
    this.interval = setInterval(() => {
      this.takeSnapshot();
    }, 5000);
  }

  stopTracking() {
    this.isTracking = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  takeSnapshot(label = '') {
    if (!performance.memory) return;

    const memory = {
      timestamp: Date.now(),
      label,
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    };

    this.snapshots.push(memory);
    console.log('Memory snapshot:', memory);

    // Alert if memory usage is concerning
    if (memory.used > 100 * 1024 * 1024) { // 100MB
      console.warn('High memory usage detected:', memory);
    }
  }

  analyzeLeaks() {
    if (this.snapshots.length < 2) return;

    const first = this.snapshots[0];
    const last = this.snapshots[this.snapshots.length - 1];
    const growth = last.used - first.used;

    console.log(`Memory growth: ${growth / 1024 / 1024}MB`);

    if (growth > 50 * 1024 * 1024) { // 50MB growth
      console.warn('Potential memory leak detected!');
    }
  }
}

const memoryTracker = new MemoryTracker();

// Use during debugging
// memoryTracker.startTracking();
// ... perform operations
// memoryTracker.stopTracking();
// memoryTracker.analyzeLeaks();
```

**Memory Leak Detection Checklist:**

- [ ] **Event Listeners**: Remove event listeners when components unmount
- [ ] **Timers**: Clear all intervals/timeouts
- [ ] **Map Objects**: Properly cleanup MapLibre GL instances
- [ ] **Markers**: Remove markers from map when not needed
- [ ] **Closures**: Watch for memory retained in closures

### 5. Map-Specific Debugging

**MapLibre GL Debugging Tools:**

```javascript
// Map performance monitoring
function setupMapPerformanceMonitoring(map) {
  // Monitor render performance
  map.on('render', () => {
    const now = performance.now();
    if (map._render && map._render.timeSinceLastFrame) {
      const frameTime = map._render.timeSinceLastFrame;
      if (frameTime > 16.67) { // > 60fps threshold
        console.warn('Slow map render detected:', frameTime + 'ms');
      }
    }
  });

  // Monitor tile loading
  map.on('data', (e) => {
    if (e.sourceId && e.isSourceLoaded) {
      console.log('Map source loaded:', e.sourceId);
    }
  });

  // Monitor style loading
  map.on('style.load', () => {
    console.log('Map style loaded');
  });

  // Monitor errors
  map.on('error', (e) => {
    console.error('Map error:', e.error);
  });
}

// Debug map interactions
function debugMapInteractions(map) {
  map.on('click', (e) => {
    console.log('Map clicked:', {
      coordinates: e.lngLat,
      point: e.point,
      features: e.features
    });
  });

  map.on('move', () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    console.log('Map moved:', { center, zoom });
  });

  map.on('zoom', () => {
    console.log('Map zoomed:', map.getZoom());
  });
}

// Use these functions in your MapContainer component
// setupMapPerformanceMonitoring(map);
// debugMapInteractions(map);
```

**Canvas and WebGL Debugging:**

```javascript
// WebGL context debugging
function debugWebGLContext(map) {
  const canvas = map.getCanvas();
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (gl) {
    console.log('WebGL Info:', {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
    });
  }
}

// Monitor canvas performance
function monitorCanvasPerformance(map) {
  let frameCount = 0;
  let lastTime = performance.now();

  function measureCanvasFPS() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
      console.log('Canvas FPS:', fps);

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureCanvasFPS);
  }

  measureCanvasFPS();
}
```

## 🔧 Troubleshooting Common Issues

### Issue 1: Slow Map Performance

**Symptoms:**
- Low FPS during pan/zoom
- Laggy touch responses
- High CPU usage

**Debugging Steps:**

1. **Performance Tab Recording**:
   ```javascript
   // Record performance during map interactions
   console.time('map-pan-performance');
   // ... perform pan operation
   console.timeEnd('map-pan-performance');
   ```

2. **Check for Common Causes**:
   ```javascript
   // Too many markers?
   const markerCount = map.getStyle().layers.filter(layer =>
     layer.type === 'symbol' && layer.id.includes('marker')
   ).length;
   console.log('Marker count:', markerCount);

   // Complex styles?
   const styleComplexity = JSON.stringify(map.getStyle()).length;
   console.log('Style complexity:', styleComplexity, 'characters');
   ```

3. **Apply Performance Fixes**:
   ```javascript
   // Reduce tile requests
   map.setMaxTiles(15);

   // Disable expensive features
   map.setPaintProperty('background', 'background-color', '#1a1a1a');

   // Optimize rendering
   map.setRenderWorldCopies(false);
   ```

### Issue 2: Touch Interaction Problems

**Symptoms:**
- Touch events not responding
- Gestures not working properly
- Zoom/pan not functioning

**Debugging Steps:**

1. **Touch Event Monitoring**:
   ```javascript
   // Monitor all touch events
   const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

   touchEvents.forEach(eventType => {
     document.addEventListener(eventType, (e) => {
       console.log(`${eventType}:`, {
         touches: e.touches.length,
         timestamp: Date.now()
       });
     });
   });
   ```

2. **Map Gesture Configuration Check**:
   ```javascript
   // Check map gesture settings
   function checkMapGestures(map) {
     console.log('Map gesture settings:', {
       dragPan: map.dragPan.isEnabled(),
       dragRotate: map.dragRotate.isEnabled(),
       scrollZoom: map.scrollZoom.isEnabled(),
       touchZoomRotate: map.touchZoomRotate.isEnabled(),
       touchPitch: map.touchPitch.isEnabled()
     });
   }
   ```

3. **CSS Touch Action Debugging**:
   ```javascript
   // Check for conflicting touch-action CSS
   function checkTouchActionCSS() {
     const elements = document.querySelectorAll('*');
     elements.forEach(el => {
       const style = getComputedStyle(el);
       if (style.touchAction !== 'auto') {
         console.log('Touch action modified:', el, style.touchAction);
       }
     });
   }
   ```

### Issue 3: Memory Leaks

**Symptoms:**
- Memory usage increases over time
- Page becomes slow after extended use
- Browser crashes on mobile devices

**Debugging Steps:**

1. **Memory Monitoring**:
   ```javascript
   // Continuous memory monitoring
   function monitorMemory() {
     setInterval(() => {
       if (performance.memory) {
         const memory = performance.memory;
         const usedMB = memory.usedJSHeapSize / 1024 / 1024;

         console.log(`Memory usage: ${usedMB.toFixed(2)}MB`);

         if (usedMB > 150) {
           console.warn('High memory usage detected!');
         }
       }
     }, 5000);
   }
   ```

2. **Map Cleanup Verification**:
   ```javascript
   // Ensure proper map cleanup
   function cleanupMap(map) {
     // Remove all sources
     const sources = Object.keys(map.getStyle().sources);
     sources.forEach(sourceId => {
       if (map.getSource(sourceId)) {
         map.removeSource(sourceId);
       }
     });

     // Remove all layers
     const layers = map.getStyle().layers.map(layer => layer.id);
     layers.forEach(layerId => {
       if (map.getLayer(layerId)) {
         map.removeLayer(layerId);
       }
     });

     // Remove event listeners
     map.off();

     console.log('Map cleanup completed');
   }
   ```

### Issue 4: Network Request Failures

**Symptoms:**
- Map tiles not loading
- API requests failing
- Intermittent connectivity issues

**Debugging Steps:**

1. **Request Monitoring**:
   ```javascript
   // Monitor failed requests
   const originalFetch = window.fetch;
   window.fetch = function(...args) {
     return originalFetch.apply(this, args).catch(error => {
       console.error('Request failed:', args[0], error);

       // Check if it's a map tile or API request
       if (args[0].includes('tiles') || args[0].includes('/api/')) {
         console.warn('Critical request failed:', args[0]);
       }

       throw error;
     });
   };
   ```

2. **Connectivity Checking**:
   ```javascript
   // Monitor network status
   function monitorConnectivity() {
     const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

     if (connection) {
       console.log('Connection info:', {
         effectiveType: connection.effectiveType,
         downlink: connection.downlink,
         rtt: connection.rtt
       });

       connection.addEventListener('change', () => {
         console.log('Connection changed:', connection.effectiveType);
       });
     }

     window.addEventListener('online', () => console.log('Network connected'));
     window.addEventListener('offline', () => console.log('Network disconnected'));
   }
   ```

## 📱 Mobile-Specific Debugging

### iOS Safari Debugging

**Remote Debugging Setup:**

1. **Enable Web Inspector on iOS device**:
   - Settings → Safari → Advanced → Web Inspector
2. **Connect device to Mac** via USB
3. **Open Safari on Mac** and enable Develop menu
4. **Select your device** from Develop menu

**iOS-Specific Issues:**

```javascript
// iOS viewport debugging
function debugIOSViewport() {
  console.log('iOS viewport info:', {
     width: window.innerWidth,
     height: window.innerHeight,
     outerWidth: window.outerWidth,
     outerHeight: window.outerHeight,
     devicePixelRatio: window.devicePixelRatio
  });

  // Check for viewport scaling issues
  const viewportScale = window.innerWidth / screen.width;
  console.log('Viewport scale:', viewportScale);
}

// iOS touch debugging
function debugIOSTouch() {
  document.addEventListener('gesturestart', (e) => {
    console.log('Gesture start:', e.scale);
  });

  document.addEventListener('gesturechange', (e) => {
    console.log('Gesture change:', e.scale);
  });

  document.addEventListener('gestureend', (e) => {
    console.log('Gesture end:', e.scale);
  });
}
```

### Android Chrome Debugging

**Remote Debugging Setup:**

1. **Enable USB Debugging** on Android device
2. **Connect device to computer** via USB
3. **Open Chrome DevTools** and click "Remote devices"
4. **Select your device** and inspect the tab

**Android-Specific Issues:**

```javascript
// Android hardware debugging
function debugAndroidHardware() {
  console.log('Android hardware info:', {
     hardwareConcurrency: navigator.hardwareConcurrency,
     deviceMemory: navigator.deviceMemory,
     connection: navigator.connection
  });
}

// Android keyboard debugging
function debugAndroidKeyboard() {
  let initialHeight = window.innerHeight;

  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;
    const heightDiff = initialHeight - currentHeight;

    if (heightDiff > 100) {
      console.log('Virtual keyboard opened');
    } else if (heightDiff < -100) {
      console.log('Virtual keyboard closed');
    }
  });
}
```

## 🚀 Performance Optimization Guide

### Bundle Size Optimization

**1. Bundle Analysis:**
```javascript
// Analyze bundle sizes in Network tab
// Look for large JavaScript files and optimize:

// Example: Dynamic imports for map components
const MapContainer = lazy(() => import('./components/MapContainer'));
const MarkerLayer = lazy(() => import('./components/map/MarkerLayer'));
```

**2. Tree Shaking Verification:**
```javascript
// Check that unused code is being eliminated
import { Map } from 'react-map-gl'; // Good: specific import
// import * as MapboxGL from 'react-map-gl'; // Bad: entire library
```

### Runtime Performance

**1. React Optimization:**
```javascript
// Use React.memo for expensive components
const LocationMarker = React.memo(({ marker, onClick }) => {
  return (
    <Marker onClick={onClick}>
      {/* marker content */}
    </Marker>
  );
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateComplexMapData(locations);
}, [locations]);

// Use useCallback for stable function references
const handleMarkerClick = useCallback((marker) => {
  setSelectedMarker(marker);
}, [setSelectedMarker]);
```

**2. Map Performance:**
```javascript
// Optimize map rendering
map.on('moveend', () => {
  // Debounce expensive operations
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updateVisibleMarkers();
  }, 100);
});

// Use viewport bounding for marker culling
function getMarkersInViewport(markers, bounds) {
  return markers.filter(marker => {
    return bounds.contains(marker.coordinates);
  });
}
```

## 📊 Performance Metrics

### Key Performance Indicators

**1. Core Web Vitals:**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

**2. Map-Specific Metrics:**
- **Time to Interactive**: < 3s on 3G
- **Map Load Time**: < 2s
- **Touch Response Time**: < 100ms
- **Frame Rate**: 60fps (30fps minimum)

**3. Mobile Metrics:**
- **Memory Usage**: < 100MB
- **Bundle Size**: < 1MB compressed
- **Tile Load Time**: < 1s per tile

### Performance Monitoring Setup

```javascript
// Continuous performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 60,
      memoryUsage: 0,
      tileLoadTime: 0,
      touchResponseTime: 0
    };

    this.startMonitoring();
  }

  startMonitoring() {
    this.monitorFPS();
    this.monitorMemory();
    this.monitorNetwork();
    this.monitorInteractions();
  }

  monitorFPS() {
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        this.metrics.fps = Math.round(frames * 1000 / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;

        if (this.metrics.fps < 30) {
          console.warn('Low FPS detected:', this.metrics.fps);
        }
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }

  monitorMemory() {
    setInterval(() => {
      if (performance.memory) {
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize;

        if (this.metrics.memoryUsage > 100 * 1024 * 1024) {
          console.warn('High memory usage:', this.metrics.memoryUsage);
        }
      }
    }, 5000);
  }

  monitorNetwork() {
    // Monitor tile load times
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('tiles')) {
          this.metrics.tileLoadTime = Math.max(this.metrics.tileLoadTime, entry.duration);

          if (entry.duration > 1000) {
            console.warn('Slow tile load:', entry.duration + 'ms');
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  monitorInteractions() {
    let touchStartTime;

    document.addEventListener('touchstart', () => {
      touchStartTime = performance.now();
    });

    document.addEventListener('touchend', () => {
      if (touchStartTime) {
        const responseTime = performance.now() - touchStartTime;
        this.metrics.touchResponseTime = responseTime;

        if (responseTime > 100) {
          console.warn('Slow touch response:', responseTime + 'ms');
        }
      }
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();
```

## 🛠️ Quick Reference Commands

### Console Commands

```javascript
// Quick performance check
performance.mark('start');
// ... perform operations
performance.mark('end');
performance.measure('operation', 'start', 'end');
console.log(performance.getEntriesByName('operation'));

// Memory info
console.log('Memory:', performance.memory);

// Network info
console.log('Connection:', navigator.connection);

// Device info
console.log('Device:', {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  hardwareConcurrency: navigator.hardwareConcurrency,
  deviceMemory: navigator.deviceMemory,
  screen: {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth
  }
});
```

### DevTools Shortcuts

- **Ctrl+Shift+I**: Open DevTools
- **Ctrl+Shift+M**: Toggle device mode
- **Ctrl+Shift+C**: Element selection tool
- **Ctrl+Shift+J**: Jump to console
- **F8**: Pause script execution
- **F10**: Step over next function call
- **F11**: Step into next function call

### Performance Recording

```javascript
// Start performance recording
performance.mark('test-start');

// Test specific functionality
// Example: Pan map
map.panTo([-118.2437, 34.0522]);

performance.mark('test-end');
performance.measure('map-pan-test', 'test-start', 'test-end');
```

This comprehensive debugging guide provides the workflows and techniques needed to effectively debug and optimize the Drive SoCal POV application using Chrome DevTools. Regular use of these debugging practices will ensure optimal performance and user experience across all mobile devices.
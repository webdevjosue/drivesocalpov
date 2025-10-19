# OpenStreetMap Integration Guide

## Overview

Drive SoCal POV uses **completely free OpenStreetMap tiles** with no API tokens required. This provides worldwide map coverage at no cost while maintaining high performance for mobile devices.

## 🗺️ Tile Sources

### Primary Sources (100% Free)

1. **OpenStreetMap Standard**
   - URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
   - Max Zoom: 19
   - Attribution: `© OpenStreetMap contributors`

2. **CartoDB Light**
   - URL: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
   - Max Zoom: 19
   - Attribution: `© OpenStreetMap contributors © CartoDB`

3. **CartoDB Dark**
   - URL: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png`
   - Max Zoom: 19
   - Attribution: `© OpenStreetMap contributors © CartoDB`

4. **Stamen Toner**
   - URL: `https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png`
   - Max Zoom: 20
   - Attribution: `© OpenStreetMap contributors © Stamen Design`

5. **Stamen Terrain**
   - URL: `https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png`
   - Max Zoom: 18
   - Attribution: `© OpenStreetMap contributors © Stamen Design`

6. **OpenTopoMap**
   - URL: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`
   - Max Zoom: 17
   - Attribution: `© OpenStreetMap contributors © OpenTopoMap`

## 🚀 Quick Start

### No Configuration Required

OpenStreetMap tiles work out of the box with no setup:

```bash
npm run dev
```

The application will automatically use free OpenStreetMap tiles.

## 📱 Mobile Performance

### Optimized for Mobile Devices

- **Tile Caching**: Intelligent tile caching for offline viewing
- **Progressive Loading**: Tiles load progressively for better perceived performance
- **Memory Management**: Automatic cleanup of unused tiles
- **Touch Optimization**: Smooth pinch-to-zoom and pan gestures
- **Network Awareness**: Adapts tile quality based on connection speed

### Performance Settings

```typescript
// src/lib/map/config.ts
export const MOBILE_PERFORMANCE_CONFIG = {
  maxTileCacheSize: 50,        // Reduced cache for mobile
  enableCollisionDetection: true,
  enableTerrain: false,          // Disabled for performance
  enable3D: false,              // Disabled for performance
  fadeDuration: 300,            // Fast transitions
  antialias: false,           // Disabled for performance
  renderWorldCopies: false,   // Reduce memory usage
}
```

## 🎨 Map Styles

### Available Styles

1. **Day Mode** (`osm_standard`)
   - Standard OpenStreetMap appearance
   - Clear, readable labels
   - Good for general navigation

2. **Night Mode** (`cartodb_dark`)
   - Dark theme for reduced eye strain
   - High contrast for night driving
   - Battery-friendly on OLED displays

3. **Street View** (`stamen_toner`)
   - High contrast black and white
   - Excellent readability
   - Minimal visual clutter

4. **Terrain View** (`stamen_terrain`)
   - Topographic information
   - Elevation shading
   - Hiking and outdoor activities

5. **Hybrid View** (`cartodb_light`)
   - Clean, minimal design
   - Good overview visualization
   - Reduced visual noise

### Style Switching

```typescript
// Switch between styles
import { GTA_MAP_STYLES } from '@/lib/map/config'

// Night mode
map.setStyle(GTA_MAP_STYLES.night)

// Day mode
map.setStyle(GTA_MAP_STYLES.day)
```

## 🗺️ Map Configuration

### Bounds Enforcement

The map is restricted to the Southern California region for focused travel guide experience:

```typescript
export const EXPANDED_BOUNDS = {
  north: 34.6,    // Palmdale area
  south: 31.5,    // Past Ensenada, Baja California
  east: -113.5,   // Past Yuma, Arizona
  west: -120.5,   // Past Santa Barbara
}
```

**Coverage Areas:**
- ✅ **Included**: Los Angeles, San Diego, Orange County, Inland Empire
- ✅ **Extended**: Palmdale to Ensenada, Santa Barbara to Yuma
- ❌ **Excluded**: Northern California, Arizona proper, beyond specified bounds

### Zoom Levels

- **Min Zoom**: 8 (regional overview)
- **Max Zoom**: 18-20 (street level, varies by style)
- **Default Zoom**: 11 (city level)

## 🔧 Configuration Options

### Custom Tile Source

```typescript
// Add custom tile source
export const CUSTOM_TILE_SOURCE = {
  url: 'https://your-tile-server.com/{z}/{x}/{y}.png',
  attribution: '© Your Attribution',
  maxZoom: 18,
}

// Create custom style
const customStyle = {
  version: 8,
  name: 'Custom Style',
  sources: {
    'custom-tiles': {
      type: 'raster',
      tiles: [CUSTOM_TILE_SOURCE.url],
      tileSize: 256,
      attribution: CUSTOM_TILE_SOURCE.attribution,
      maxzoom: CUSTOM_TILE_SOURCE.maxZoom,
    }
  },
  layers: [
    {
      id: 'custom-tiles-layer',
      type: 'raster',
      source: 'custom-tiles',
      minzoom: 0,
      maxzoom: CUSTOM_TILE_SOURCE.maxZoom,
    }
  ]
}
```

## 🌍 Coverage

### Worldwide Coverage

OpenStreetMap provides worldwide coverage including:

- ✅ **North America**: Complete coverage
- ✅ **Europe**: Complete coverage
- ✅ **Asia**: Major coverage
- ✅ **South America**: Growing coverage
- ✅ **Africa**: Major urban areas
- ✅ **Australia**: Complete coverage
- ✅ **Antarctica**: Research station areas

### Data Freshness

- **Urban Areas**: Updated daily
- **Suburban Areas**: Updated weekly
- **Rural Areas**: Updated monthly
- **Remote Areas**: Updated quarterly

## 💰 Cost Information

### Completely Free

- **No API Tokens**: No registration required
- **No Rate Limits**: Fair use policy applies
- **No Billing**: No payment processing
- **No Contracts**: No service agreements

### Fair Use Policy

While tiles are free, please be considerate:

- Cache tiles locally when possible
- Don't abuse the service with excessive requests
- Implement proper error handling
- Respect attribution requirements

## 🔍 Troubleshooting

### Common Issues

1. **Tiles Not Loading**
   - Check internet connection
   - Verify tile server status
   - Check browser console for errors

2. **Slow Performance**
   - Reduce max zoom level
   - Enable performance mode
   - Clear tile cache

3. **Attribution Issues**
   - Ensure proper attribution is displayed
   - Check attribution text formatting
   - Verify attribution positioning

### Debug Mode

Enable debug logging:

```typescript
// In development mode
if (process.env.NODE_ENV === 'development') {
  console.log('OpenStreetMap tiles loaded successfully');
}
```

## 📚 Additional Resources

### OpenStreetMap Resources

- [OpenStreetMap Website](https://www.openstreetmap.org/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Tile Usage Policy](https://wiki.openstreetmap.org/wiki/Tile_usage_policy)

### MapLibre Resources

- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js-docs/)
- [Style Specification](https://maplibre.org/maplibre-style-spec/)
- [Performance Optimization](https://maplibre.org/maplibre-gl-js-docs/performance/)

### Mobile Development

- [Mobile Performance Best Practices](https://web.dev/performance/)
- [Touch Events Guide](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Responsive Design](https://web.dev/responsive/)

## 🤝 Contributing

### Adding New Tile Sources

1. Research tile source licensing
2. Add to `OPENSTREETMAP_TILES` configuration
3. Create corresponding MapLibre style
4. Test on mobile devices
5. Update documentation

### Performance Optimization

1. Monitor tile loading times
2. Optimize cache settings
3. Test on various network conditions
4. Validate mobile performance
5. Update configuration as needed

---

**Last Updated**: October 2025
**Version**: 1.0.0
**License**: MIT License - OpenStreetMap tiles are licensed under ODbL
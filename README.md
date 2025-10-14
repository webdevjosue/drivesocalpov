# Drive SoCal POV

A mobile-first interactive travel guide for Southern California, built with Next.js 15+ and OpenStreetMap.

## 🗺️ Map Technology

**100% Free OpenStreetMap Integration**
- No API tokens required
- Worldwide coverage
- Multiple free tile sources
- Mobile-optimized performance

### Tile Sources
- **OpenStreetMap Standard** - Classic map appearance
- **CartoDB Light/Dark** - Clean, modern styling
- **Stamen Toner** - High-contrast street maps
- **Stamen Terrain** - Topographic information
- **OpenTopoMap** - Outdoor recreation focus

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/drive-socal-pov.git
cd drive-socal-pov

# Install dependencies
npm install

# Start development server
npm run dev
```

### Launch the Application

Open [http://localhost:3006](http://localhost:3006) in your browser.

### 🎯 Current Status

**Phase 2: Core Map Implementation (95% Complete)**
- ✅ Interactive OpenStreetMap with free tiles
- ✅ Custom Southern California boundaries (Palmdale ↔ Ensenada, Yuma ↔ Santa Barbara)
- ✅ Mobile-optimized touch controls and performance
- ✅ Production-ready foundation with Next.js 15+ and React 19

**Next**: Phase 3 - Mobile UI/UX Components

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed documentation.

## 📱 Features

### Mobile Optimized
- **Touch Controls**: Pinch-to-zoom, smooth panning
- **Performance Mode**: Adaptive quality based on device capabilities
- **Offline Support**: Tile caching for intermittent connectivity
- **Responsive Design**: Optimized for all screen sizes

### Map Functionality
- **Multiple Styles**: Day/Night/Terrain/Street views
- **Bounds Enforcement**: Restricted to California development area
- **Zoom Controls**: 8-20x zoom levels
- **Real-time Updates**: Live tile loading and interaction

### Performance Features
- **Intelligent Caching**: Smart tile caching for faster loading
- **Network Awareness**: Adapts to connection quality
- **Memory Management**: Automatic cleanup and optimization
- **Hardware Acceleration**: GPU-accelerated map rendering

## 🗺️ Map Configuration

### Current Bounds
```
North: 34.6°  (Palmdale area)
South: 31.5°  (Past Ensenada, Baja California)
East: -113.5° (Past Yuma, Arizona)
West: -120.5° (Past Santa Barbara)
```

### Style Options
```typescript
// Available map styles
GTA_MAP_STYLES = {
  day: 'OpenStreetMap Standard',
  night: 'CartoDB Dark',
  satellite: 'Stamen Terrain',
  hybrid: 'CartoDB Light',
  streets: 'Stamen Toner'
}
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15+** with Turbopack
- **React 19** with concurrent features
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MapLibre GL** for interactive maps

### Map Integration
- **@vis.gl/react-maplibre v8** (latest)
- **OpenStreetMap** tiles (free)
- **Zustand** for state management
- **Mobile performance hooks**

### Development Tools
- **ESLint** + **Prettier** for code quality
- **Husky** for git hooks
- **Jest** for testing
- **Vercel** for deployment

## 📁 Project Structure

```
drive-socal-pov/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── map/              # Map components
│   │       ├── MapProvider.tsx    # Main map component
│   │       └── MapContainer.tsx  # Map wrapper
│   ├── lib/
│   │   ├── map/              # Map configuration
│   │   │   └── config.ts     # OpenStreetMap setup
│   │   └── types.ts          # TypeScript types
│   ├── hooks/                  # Custom React hooks
│   │   ├── useIsMobile.ts    # Mobile detection
│   │   └── useMobilePerformance.ts
│   ├── store/                 # State management
│   │   └── mapStore.ts       # Map state
│   └── styles/
│       └── map.css          # Map-specific styles
├── docs/                     # Documentation
└── public/                   # Static assets
```

## 🔧 Configuration

### Environment Setup

No environment variables required! OpenStreetMap tiles work out of the box.

### Custom Tile Sources

Add custom tile sources in `src/lib/map/config.ts`:

```typescript
export const CUSTOM_TILE_SOURCE = {
  url: 'https://your-tile-server.com/{z}/{x}/{y}.png',
  attribution: '© Your Attribution',
  maxZoom: 18,
}
```

### Performance Tuning

Adjust mobile performance settings:

```typescript
export const MOBILE_PERFORMANCE_CONFIG = {
  maxTileCacheSize: 50,
  enableCollisionDetection: true,
  fadeDuration: 300,
  antialias: false,
}
```

## 🧪 Testing

### Local Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

### Mobile Testing

Test on various devices:
- **iOS Safari** (iPhone/iPad)
- **Android Chrome**
- **Desktop browsers** (Chrome, Firefox, Safari)
- **Touch devices** (tablets, touch-enabled laptops)

## 📚 Documentation

- [OpenStreetMap Setup Guide](./docs/OPENSTREETMAP_SETUP.md)
- [Map Configuration Reference](./src/lib/map/config.ts)
- [Mobile Performance Guide](./src/hooks/useMobilePerformance.ts)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm run build
npx vercel

# Or use the Vercel CLI
vercel --prod
```

### Netlify

```bash
# Build the application
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=.next
```

### Static Export

```bash
# Export as static site
npm run build
npm run export
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Test on mobile devices
- Update documentation
- Keep map performance in mind

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### OpenStreetMap Licensing

OpenStreetMap tiles are licensed under the Open Data Commons Open Database License (ODbL). Proper attribution is included in the map display.

## 🆘 Support

- **Documentation**: Check the [OpenStreetMap Setup Guide](./docs/OPENSTREETMAP_SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/drive-socal-pov/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/drive-socal-pov/discussions)

---

**Built with ❤️ for the Southern California community**

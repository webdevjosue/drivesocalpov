# Phase 1: Project Setup & Foundation - Drive SoCal POV

## Phase Overview

Phase 1 establishes the technical foundation for the Drive SoCal POV mobile-first travel guide app. This phase focuses on setting up the complete development environment with Next.js 14+, TypeScript, Tailwind CSS, and essential configurations for a map-centric mobile application.

**Estimated Duration:** 2-3 days
**Priority:** High - Foundation for all subsequent phases

## Phase 1 Scope

### Core Deliverables
- Complete Next.js 14+ project setup with TypeScript
- Tailwind CSS configuration with mobile-first approach
- Supabase integration setup
- MapLibre GL basic configuration
- Development environment validation
- PWA preparation structure
- MCP tool integration readiness

### Technical Requirements
- Mobile-first responsive design foundation
- TypeScript strict mode configuration
- Environment variable management
- Git workflow and version control
- Build and deployment pipeline preparation

## Implementation Tasks

### 1. Project Initialization & Structure (Priority: Critical)

#### 1.1 Next.js 14+ Setup
**File:** Project root
```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Key Configurations:**
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript strict mode
- `tailwind.config.ts` - Tailwind CSS setup
- `.eslintrc.json` - ESLint configuration

#### 1.2 Folder Structure Setup
**Directory Structure:**
```
drivesocalpov/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── (auth)/            # Auth routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── map/               # Main map interface
│   │   ├── itineraries/       # Trip planning
│   │   ├── favorites/         # Saved locations
│   │   ├── top/               # Curated content
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── map/              # Map-related components
│   │   ├── layout/           # Layout components
│   │   └── forms/            # Form components
│   ├── lib/                  # Utilities and configurations
│   │   ├── supabase/         # Supabase client setup
│   │   ├── map/              # Map configuration
│   │   ├── utils/            # Helper functions
│   │   └── types/            # TypeScript types
│   ├── hooks/                # Custom React hooks
│   ├── store/                # State management
│   └── styles/               # Additional styles
├── public/                   # Static assets
│   ├── icons/               # PWA icons
│   ├── images/              # Image assets
│   └── manifest.json        # PWA manifest
├── docs/                    # Documentation
├── .env.local              # Environment variables
├── .env.example            # Environment template
├── package.json            # Dependencies
└── README.md               # Project documentation
```

### 2. TypeScript Configuration (Priority: High)

#### 2.1 Strict TypeScript Setup
**File:** `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 2.2 Type Definitions
**File:** `src/lib/types/index.ts`
```typescript
// Core application types
export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: LocationCategory;
  isPremium: boolean;
  address: string;
  website?: string;
  phone?: string;
  hours?: string;
  priceRange?: string;
  images: string[];
  tags: string[];
  rating?: number;
  reviewCount?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  description: string;
  locations: Location[];
  startDate?: Date;
  endDate?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum LocationCategory {
  ATTRACTION = 'attraction',
  RESTAURANT = 'restaurant',
  EVENT = 'event',
  PARK = 'park',
  BEACH = 'beach',
  ENTERTAINMENT = 'entertainment'
}
```

### 3. Tailwind CSS Mobile-First Setup (Priority: High)

#### 3.1 Tailwind Configuration
**File:** `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
        map: {
          container: '#1e293b',
          overlay: 'rgba(30, 41, 59, 0.9)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '375px', // iPhone SE
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
```

#### 3.2 Global Styles
**File:** `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }

  body {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
}

/* Map container specific styles */
.map-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

/* Safe area support for mobile devices */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

### 4. Package Dependencies & Configuration (Priority: Critical)

#### 4.1 Core Dependencies
**File:** `package.json`
```json
{
  "name": "drivesocalpov",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.4.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "maplibre-gl": "^4.1.0",
    "react-map-gl": "^7.1.0",
    "@heroicons/react": "^2.1.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.363.0"
  },
  "devDependencies": {
    "@types/maplibre-gl": "^1.14.0",
    "tsx": "^4.7.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

#### 4.2 Environment Configuration
**File:** `.env.example`
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Map Configuration
NEXT_PUBLIC_MAPLIBRE_TOKEN=your_maplibre_token_if_needed
NEXT_PUBLIC_MAP_STYLE_URL=https://api.maptiler.com/maps/streets/style.json

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Drive SoCal POV
NEXT_PUBLIC_APP_VERSION=0.1.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### 5. Supabase Integration Setup (Priority: High)

#### 5.1 Supabase Client Configuration
**File:** `src/lib/supabase/client.ts`
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'

export const supabase = createClientComponentClient<Database>()

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
```

#### 5.2 Database Types
**File:** `src/lib/supabase/database.types.ts`
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string
          name: string
          description: string
          latitude: number
          longitude: number
          category: LocationCategory
          is_premium: boolean
          address: string
          website: string | null
          phone: string | null
          hours: string | null
          price_range: string | null
          images: Json
          tags: string[]
          rating: number | null
          review_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['locations']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      itineraries: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          locations: Json
          start_date: string | null
          end_date: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['itineraries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['itineraries']['Insert']>
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          location_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      location_category: 'attraction' | 'restaurant' | 'event' | 'park' | 'beach' | 'entertainment'
    }
  }
}

export type LocationCategory = Database['public']['Enums']['location_category']
```

### 6. MapLibre GL Configuration (Priority: High)

#### 6.1 Map Configuration
**File:** `src/lib/map/config.ts`
```typescript
export const MAP_CONFIG = {
  // Southern California bounds
  bounds: {
    north: 34.8,   // Santa Barbara area
    south: 32.3,   // US-Mexico border
    east: -116.0,  // Palm Springs/Desert
    west: -118.0,  // Pacific coastline
  },

  // Initial view state (Los Angeles area)
  initialViewState: {
    latitude: 34.0522,
    longitude: -118.2437,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  },

  // Map style
  mapStyle: 'https://api.maptiler.com/maps/streets/style.json',

  // Map controls
  controls: {
    showZoom: true,
    showCompass: false,
    showFullscreen: false,
    showNavigation: true,
  },

  // Mobile settings
  mobile: {
    touchZoomRotate: true,
    touchPitch: false,
    dragPan: true,
    dragRotate: false,
    doubleClickZoom: false,
    scrollZoom: true,
  },

  // Performance
  performance: {
    enableCollisionDetection: true,
    enableTerrain: false,
    enable3D: false,
    maxTiles: 25,
    maxZoom: 18,
    minZoom: 8,
  }
}

export const MAP_STYLE_URLS = {
  streets: 'https://api.maptiler.com/maps/streets/style.json',
  satellite: 'https://api.maptiler.com/maps/satellite/style.json',
  hybrid: 'https://api.maptiler.com/maps/hybrid/style.json',
  bright: 'https://api.maptiler.com/maps/bright/style.json',
}
```

#### 6.2 Map Component Foundation
**File:** `src/components/map/MapProvider.tsx`
```typescript
'use client'

import { MapProvider as MapLibreProvider } from 'react-map-gl'
import { mapboxgl } from 'maplibre-gl'
import { MAP_CONFIG } from '@/lib/map/config'

// Suppress mapbox-gl CSS warning
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!maplibre-gl/dist/maplibre-gl-csp-worker').default

interface MapProviderProps {
  children: React.ReactNode
}

export function MapProvider({ children }: MapProviderProps) {
  return (
    <MapLibreProvider
      mapLib={import('maplibre-gl')}
      initialViewState={MAP_CONFIG.initialViewState}
      mapStyle={MAP_CONFIG.mapStyle}
      maxBounds={[
        [MAP_CONFIG.bounds.west, MAP_CONFIG.bounds.south],
        [MAP_CONFIG.bounds.east, MAP_CONFIG.bounds.north]
      ]}
      reuseMaps
    >
      {children}
    </MapLibreProvider>
  )
}
```

### 7. PWA Preparation (Priority: Medium)

#### 7.1 PWA Manifest
**File:** `public/manifest.json`
```json
{
  "name": "Drive SoCal POV",
  "short_name": "SoCal POV",
  "description": "Mobile-first travel guide for Southern California",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e293b",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### 7.2 Service Worker Setup (Phase 2 Preparation)
**File:** `src/app/sw.ts` (Placeholder for Phase 2)
```typescript
// Service worker will be implemented in Phase 2
// This file serves as preparation for offline functionality

export default function swRegister() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}
```

### 8. Development Environment Validation (Priority: Critical)

#### 8.1 Development Scripts
**File:** `package.json` (additional scripts)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "validate": "npm run type-check && npm run lint && npm run format:check",
    "supabase:generate-types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts",
    "prepare": "husky install"
  }
}
```

#### 8.2 ESLint Configuration
**File:** `.eslintrc.json`
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": ["node_modules/", ".next/", "out/"]
}
```

#### 8.3 Prettier Configuration
**File:** `.prettierrc`
```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## MCP Tool Integration Preparation

### Supabase MCP Commands Setup
1. **Migration Management**
   - Configure `mcp__supabase__apply_migration` for database schema
   - Prepare initial migration files for core tables
   - Set up `mcp__supabase__list_tables` for schema inspection

2. **Database Operations**
   - Configure `mcp__supabase__execute_sql` for data operations
   - Set up `mcp__supabase__generate_typescript_types` workflow
   - Prepare seed data scripts

### Vercel MCP Commands Setup
1. **Deployment Pipeline**
   - Configure `mcp__vercel__deploy_to_vercel` integration
   - Set up project management with `mcp__vercel__list_projects`
   - Prepare build optimization for mobile

## Success Criteria

### Technical Success Metrics
- [ ] Next.js development server runs without errors
- [ ] TypeScript compilation passes with strict mode
- [ ] Tailwind CSS styles load correctly on mobile devices
- [ ] Supabase client connects successfully
- [ ] MapLibre GL renders basic map interface
- [ ] Environment variables load correctly
- [ ] ESLint and Prettier configurations work
- [ ] Build process completes successfully

### Mobile Optimization Metrics
- [ ] Application renders correctly on mobile devices (375px+)
- [ ] Touch interactions work smoothly
- [ ] No horizontal scroll on mobile
- [ ] Fast initial load time (< 3 seconds)
- [ ] Responsive design adapts to different screen sizes

### Development Workflow Metrics
- [ ] Git workflow established with proper .gitignore
- [ ] Development environment validated
- [ ] MCP tools configured and tested
- [ ] Documentation complete and accessible

## Next Phase Dependencies

### Phase 2 Prerequisites
Phase 1 completion enables Phase 2: Core Features & Map Integration with:

1. **Authentication System**
   - Supabase Auth integration
   - User registration/login flows
   - Protected routes

2. **Map Implementation**
   - Interactive MapLibre GL integration
   - Location markers and popups
   - Mobile-optimized map controls

3. **Basic UI Components**
   - Navigation components
   - Location cards
   - Search and filter components

4. **Database Setup**
   - Supabase table creation
   - Type generation
   - Seed data population

### Risk Mitigation
- Complete environment validation before Phase 2
- Test all configurations on actual mobile devices
- Verify MCP tool functionality
- Establish backup and recovery procedures

## Documentation Requirements

### Required Documentation
- [x] Phase 1 Implementation Plan (this document)
- [ ] API Integration Guide
- [ ] Development Environment Setup Guide
- [ ] Mobile Testing Checklist
- [ ] MCP Tool Usage Documentation

### Code Documentation Standards
- JSDoc comments for all functions
- TypeScript interfaces for all data structures
- Component prop documentation
- Environment variable documentation

## Conclusion

Phase 1 establishes a solid foundation for the Drive SoCal POV mobile application. The focus on mobile-first design, TypeScript strict mode, and proper tooling ensures a scalable and maintainable codebase. The successful completion of this phase enables rapid development of core features in subsequent phases.

The MCP tool integration preparation ensures that database operations and deployment processes are streamlined and automated, reducing manual overhead and potential errors during development.

**Key Takeaways:**
- Mobile-first approach is fundamental to the project's success
- TypeScript strict mode prevents runtime errors
- Proper tooling setup accelerates development
- MCP integration enables automated workflows
- Comprehensive documentation ensures team alignment
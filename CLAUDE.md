# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Vision

Drive SoCal POV is a mobile-first travel guide for Southern California (San Diego, Los Angeles, Inland Empire) with a gamified freemium model. The experience is centered around a GTA V-inspired interactive map with discreet advertising support.

**Core Concept:** Map-centric mobile app focused on free events, attractions, and top foods to keep users engaged while showing premium value.

**Current Status: ~55% Complete** - Foundation built with excellent mobile UI/UX, but database is EMPTY and requires MCP tool integration for functional travel guide experience.

## Mobile UI/UX Architecture

**Layout Structure:**
- **Top**: Minimal site/logo branding
- **Center**: Full-screen interactive MapLibre GL map (primary focus)
- **Bottom**: Fixed ad banner (swipeable/pullable to hide)
- **Bottom Right**: Burger menu icon
- **Menu**: Slide-out from left revealing navigation items

**Key Menu Items:**
- My Itinerary (user-created trip plans)
- Favorites (saved locations)
- Top (attractions/foods/events - curated content)

**Interaction Patterns:**
- Swipe/pull gestures for ad banner
- Slide-out left menu navigation
- Map-first navigation with minimal UI overlay
- Mobile-optimized touch interactions

## Technical Stack

**Frontend:**
- Next.js 15+ with React 19 and TypeScript
- @vis.gl/react-maplibre v8 with MapLibre GL for interactive maps
- OpenStreetMap tiles (100% free, no API tokens)
- Tailwind CSS 4 for mobile-first responsive design
- shadcn/ui for accessible, customizable UI components

**Backend:**
- Supabase for authentication, database, and storage
- Vercel for hosting and deployment

**Key Dependencies:**
- `@supabase/supabase-js` - Database and auth (ready)
- `@vis.gl/react-maplibre` - React map components
- `maplibre-gl` - Interactive map rendering
- `zustand` - State management with React 19 concurrency
- `shadcn/ui` - Pre-built accessible UI components with Tailwind CSS integration

## MCP Tool Integration

**Supabase MCP Commands:**
- `mcp__supabase__apply_migration` - Database schema updates
- `mcp__supabase__execute_sql` - Database queries
- `mcp__supabase__list_tables` - Inspect database structure
- `mcp__supabase__generate_typescript_types` - Type generation

**Vercel MCP Commands:**
- `mcp__vercel__deploy_to_vercel` - Deploy application
- `mcp__vercel__list_projects` - Project management
- `mcp__vercel__get_project` - Project details

## Development Commands

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run dev:webpack # Start development with webpack fallback
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # TypeScript type checking (0 errors currently)

# Code Quality
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run Jest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run Playwright end-to-end tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run test:all     # Run all tests (unit + E2E)

# Deployment
npm run deploy       # Deploy to Vercel production
npm run deploy:preview # Deploy to Vercel preview
npm run logs:prod    # View production logs

# Database (requires Supabase CLI)
supabase start       # Start local Supabase
supabase db push     # Push migrations to database
supabase db reset    # Reset local database
supabase gen types typescript # Generate DB types
```

## Database Schema (MVP)

**Core Tables:**
- `locations` - Attractions, restaurants, events
- `users` - User profiles and preferences
- `itineraries` - User-created trip plans
- `favorites` - Saved locations
- `categories` - Location categorization (free/premium)

**Key Features:**
- Location-based search and filtering
- User-generated itineraries
- Favorites and bookmarks
- Category-based content organization

## Content Strategy

**Free Tier Focus:**
- Free events and attractions
- Public beaches and parks
- Budget-friendly food options
- Basic location information

**Premium Features:**
- Detailed itineraries and trip planning
- Hidden gems and local recommendations
- Advanced filtering (budget, interests, time)
- Offline map access
- Custom route optimization

## Development Best Practices

**Mobile-First Approach:**
- Design for touch interactions
- Optimize for mobile viewports
- Implement swipe/pull gestures
- Minimal UI overlay on map
- Use shadcn/ui components for consistent, accessible mobile interfaces
- Leverage shadcn/ui's responsive design patterns for touch-friendly interactions

**Map Implementation:**
- OpenStreetMap tiles (100% free, no API tokens required)
- Custom Southern California boundaries: Palmdale ↔ Ensenada, Yuma ↔ Santa Barbara
- Strict bounds enforcement with real-time checking
- Mobile-optimized touch controls and performance monitoring

**Performance Considerations:**
- Lazy load location data
- Optimize map tile loading
- Implement efficient state management
- Use React.memo for map components

**shadcn/ui Usage Guidelines:**
- Install components individually to keep bundle size minimal
- Customize components using Tailwind CSS classes for mobile optimization
- Use shadcn/ui's sheet component for slide-out navigation menu
- Leverage button and card components for touch-friendly mobile interactions
- Customize dialog and popover components for mobile viewport constraints
- Use badge and avatar components for user interface elements
- Apply shadcn/ui's animation patterns for smooth mobile transitions

## Code Architecture & Structure

### Mobile-First Layout Architecture
**Root Layout (`src/app/layout.tsx`)**: 260-line sophisticated mobile optimization with:
- iOS Safari viewport fixes and PWA configuration
- Service worker registration for offline capabilities
- Hardware acceleration and touch optimization
- Google AdSense integration (placeholder)

**Mobile Layout (`src/components/layout/MobileLayout.tsx`)**: 702-line advanced layout system:
- Full-screen map container with safe area support
- Slide-out navigation using shadcn/ui Sheet component
- Swipeable bottom ad banner with gesture handling
- Responsive burger menu with animation states

### Map System Architecture
**MapProvider (`src/components/map/MapProvider.tsx`)**: 524-line production-ready map integration:
- @vis.gl/react-maplibre v8 with OpenStreetMap tiles (100% free)
- Strict Southern California boundary enforcement
- Adaptive performance monitoring with FPS-based optimization
- Progressive tile loading and mobile gesture handling
- Hardware acceleration and memory management

**Map State (`src/store/mapStore.tsx`)**: 360-line Zustand store with:
- React 19 concurrency support
- Performance mode configuration
- Viewport tracking and mobile optimization
- Action hooks for complex map operations

**Map Configuration (`src/lib/map/config.ts`)**:
- OpenStreetMap tile sources (no API tokens required)
- Mobile performance presets
- Boundary enforcement (Palmdale ↔ Ensenada, Yuma ↔ Santa Barbara)

### Current Data System
**Mock Data (`src/components/map/MockLocationMarkers.tsx`)**: 18 hardcoded Southern California locations as temporary placeholder until database seeding.

**Empty Database**: Comprehensive 15-table Supabase schema exists but contains 0 records. MCP tools available for database operations.

### UI Component System
**shadcn/ui Integration**: Tailwind CSS 4 with mobile-first components:
- Sheet for slide-out navigation
- Button, Card, Badge for touch interactions
- ScrollArea for mobile-optimized content
- Dialog for mobile-friendly modals

## MCP Integration Patterns

### Supabase Database Operations
```javascript
// List database structure
await mcp__supabase__list_tables({ schemas: ["public"] })

// Apply schema migrations
await mcp__supabase__apply_migration({
  name: "seed_socal_locations",
  query: "INSERT INTO locations (name, latitude, longitude) VALUES (...)"
})

// Generate TypeScript types
await mcp__supabase__generate_typescript_types()
```

### Vercel Deployment Management
```javascript
// Deploy to preview environment
await mcp__vercel__deploy_to_vercel()

// List deployment history
await mcp__vercel__list_deployments({
  projectId: "prj_xxx",
  teamId: "team_xxx"
})
```

### Chrome DevTools Testing
```javascript
// Mobile viewport testing
await mcp__chrome-devtools__resize_page({ width: 375, height: 812 })

// Performance audit
await mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})
```

## Geographic Scope

**Primary Areas:**
- San Diego County
- Los Angeles County
- Inland Empire (Riverside/San Bernardino)

**Map Boundaries:**
- Northern limit: 34.6°N (Palmdale area)
- Eastern limit: -113.5°W (Past Yuma, Arizona)
- Southern limit: 31.5°N (Past Ensenada, Baja California)
- Western limit: -120.5°W (Past Santa Barbara)
- **Strict enforcement** prevents exploration outside Southern California region

## Gamification Elements

**User Engagement:**
- Location discovery achievements
- Check-in features for visited places
- Itinerary completion rewards
- Social sharing of favorite spots

**Content Curation:**
- "Top" lists for categories (foods, attractions, events)
- Seasonal recommendations
- Budget-friendly highlights
- Hidden local gems

## Phase Status

### ✅ Phase 1: Project Setup & Foundation (COMPLETED)

**Completed Tasks:**
- ✅ Initialize Next.js 14+ project with TypeScript and Tailwind CSS
- ✅ Configure Tailwind CSS with mobile-first design system
- ✅ Create core folder structure for mobile-first app
- ✅ Install and configure Supabase client
- ✅ Install MapLibre GL and react-map-gl dependencies
- ✅ Create initial TypeScript configuration
- ✅ Set up PWA configuration and manifest
- ✅ Create basic layout with safe area support
- ✅ Set up environment variables

**Key Achievements:**
- Mobile-first responsive design system with safe area support
- Complete TypeScript configuration with strict type checking
- Supabase integration ready for database operations
- MapLibre GL configured for interactive maps
- PWA configuration for mobile app experience
- Comprehensive project structure for scalable development

**Next Phase:** Phase 2 - Core Map Implementation

### ✅ Phase 2: Core Map Implementation (COMPLETED - 60%)

**Completed Tasks:**
- ✅ Interactive MapLibre GL integration with OpenStreetMap tiles
- ✅ Mobile touch gesture implementation with performance monitoring
- ✅ Custom Southern California boundaries (Palmdale ↔ Ensenada, Yuma ↔ Santa Barbara)
- ✅ Strict bounds enforcement with real-time checking
- ✅ 100% free map integration (no API tokens required)
- ✅ Mobile-optimized performance with adaptive quality
- ✅ Production-ready state management with Zustand
- ✅ **Complete TypeScript type safety** (0 compilation errors)

**Remaining Implementation (40%):**
- ❌ Real location data integration (currently using mock data)
- ❌ Functional location pop-ups and information displays
- ❌ Database connectivity for location data
- ❌ GTA V-inspired map styling (cosmetic enhancement)
- ❌ Interactive markers with proper click handlers

**Key Achievements:**
- **60 FPS** smooth interaction with hardware acceleration
- **Zero API costs** with OpenStreetMap integration
- **Strict boundaries** prevent users from leaving Southern California
- **Mobile-first** design with touch optimization
- **TypeScript compilation: 0 errors** (previously 65+ warnings fixed)
- **Technical foundation ready** for database integration

### 📋 Phase 3: Mobile UI/UX Components (70% COMPLETE)

**Completed Tasks:**
- ✅ Mobile layout system with responsive design
- ✅ Slide-out navigation menu (visual implementation)
- ✅ Swipeable bottom ad banner
- ✅ Touch gesture system
- ✅ Mobile UI components using shadcn/ui
- ✅ iOS Safari compatibility fixes

**Remaining Implementation (30%):**
- ❌ Navigation menu functionality (items are non-functional)
- ❌ Connected filter system (UI exists but not wired to data)
- ❌ Premium feature integration (shown as placeholders)

### 📋 Phase 4: Database & Content Integration (40% COMPLETE)

**Completed Tasks:**
- ✅ Supabase database schema (comprehensive 15-table structure)
- ✅ TypeScript type generation for database
- ✅ MCP tool availability (not yet implemented)
- ✅ Database client configuration

**Critical Missing Implementation (60%):**
- ❌ **EMPTY DATABASE** (0 locations, 0 categories, 0 users) - MCP tools ready
- ❌ MCP tool integration for database operations (tools available, not used)
- ❌ Southern California content seeding (research complete in docs/)
- ❌ API integration and data fetching (service layer ready)
- ❌ Authentication system implementation (Supabase auth configured)

### 📋 Phase 5: Freemium Features & Gamification (0% COMPLETE)
- ❌ Freemium model implementation
- ❌ Gamification system
- ❌ User engagement features
- ❌ Premium features
- ❌ User authentication system

### 📋 Phase 6: Testing & Deployment (20% COMPLETE)

**Completed Tasks:**
- ✅ Build configuration optimization
- ✅ TypeScript compilation (0 errors)
- ✅ Development environment setup

**Remaining Implementation (80%):**
- ❌ Mobile testing strategy
- ❌ Vercel deployment pipeline
- ❌ Performance monitoring implementation
- ❌ CI/CD pipeline setup
- ❌ Production deployment

---

## 🚨 CRITICAL NEXT STEPS

**Immediate Priority (Week 1-2):**
1. **Database Content Seeding** - Use MCP Supabase tools to populate EMPTY database with Southern California locations
2. **MCP Tool Integration** - Connect available MCP tools (Supabase, Vercel, Chrome DevTools) into development workflow
3. **Navigation Functionality** - Wire burger menu items to database-driven features
4. **Authentication Implementation** - Enable user accounts and premium features using Supabase auth

**Current Project Status: ~55% Complete**
- **Excellent Foundation**: World-class mobile UI/UX with 0 TypeScript errors
- **Major Gap**: Empty database prevents functional travel guide experience
- **Technical Debt**: Minimal - code quality is high with proper architecture
- **MCP Tools Available**: Full suite ready for database and deployment automation
- **Estimated Timeline**: 2-3 weeks to reach functional MVP with MCP integration

**Key Development Strategy**: Leverage available MCP tools to accelerate database seeding, deployment automation, and mobile testing workflows.

## Documentation Reference

**📚 Comprehensive Documentation Hub:**
- **[docs/README.md](docs/README.md)** - Main documentation navigation and overview
- **[docs/00-project-overview/](docs/00-project-overview/)** - Current status, vision, and capabilities
- **[docs/01-planning-roadmap/](docs/01-planning-roadmap/)** - Complete project phases and implementation plans
- **[docs/02-technical-documentation/](docs/02-technical-documentation/)** - Architecture, setup guides, and integrations
- **[docs/03-development-guides/](docs/03-development-guides/)** - Workflow, debugging, and best practices
- **[docs/04-research-content/](docs/04-research-content/)** - Location research, content planning, and data sources
- **[docs/05-tracking-progress/](docs/05-tracking-progress/)** - Milestones, verification reports, and achievement tracking
- **[docs/06-resources-tools/](docs/06-resources-tools/)** - External tools, references, and resource management
- **[docs/07-deployment-operations/](docs/07-deployment-operations/)** - Production deployment and monitoring

**🎯 Quick Access:**
- **Current Status**: [docs/00-project-overview/PROJECT_STATUS.md](docs/00-project-overview/PROJECT_STATUS.md)
- **Live Site**: drivesocalpov.vercel.app
- **Next Phase**: [docs/01-planning-roadmap/phase-3-plan.md](docs/01-planning-roadmap/phase-3-plan.md)
- **Technical Architecture**: [docs/02-technical-documentation/TECHNICAL_ARCHITECTURE.md](docs/02-technical-documentation/TECHNICAL_ARCHITECTURE.md)
- **Resource Library**: [docs/06-resources-tools/RESOURCE_LIBRARY.md](docs/06-resources-tools/RESOURCE_LIBRARY.md)
- **MCP Capabilities**: [docs/capabilities.md](docs/capabilities.md)

      IMPORTANT: this context may or may not be relevant to your tasks.
- co author josue zazueta webdev.josue@gmail.com

## Available Development Tools

### Claude Code Infrastructure
- **Slash Commands**: 17 custom commands in `.claude/commands/` (agile, deployment, testing workflows)
- **Hooks Configuration**: Pre/post tool hooks for code quality and testing automation
- **Skills Framework**: Ready for automation patterns (currently empty, needs implementation)
- **MCP Integration**: Full suite of 6 MCP servers available for database, deployment, and testing automation

### Key Files for Understanding Architecture
- `src/app/layout.tsx` - Mobile optimization and PWA configuration
- `src/components/layout/MobileLayout.tsx` - Advanced mobile layout system
- `src/components/map/MapProvider.tsx` - Production-ready map integration
- `src/store/mapStore.tsx` - React 19 optimized state management
- `docs/capabilities.md` - Complete MCP tool inventory and integration patterns

### Development Workflow Tips
1. **Always run `npm run type-check`** - 0 compilation errors, maintain this standard
2. **Use MCP tools for database operations** - Supabase tools available and ready
3. **Test mobile layouts** - Use Chrome DevTools MCP for mobile viewport testing
4. **Deploy via MCP** - Vercel tools available for automated deployment workflows
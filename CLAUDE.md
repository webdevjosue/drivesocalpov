# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Vision

Drive SoCal POV is a mobile-first travel guide for Southern California (San Diego, Los Angeles, Inland Empire) with a gamified freemium model. The experience is centered around a GTA V-inspired interactive map with discreet advertising support.

**Core Concept:** Map-centric mobile app focused on free events, attractions, and top foods to keep users engaged while showing premium value.

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
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npm run seed         # Seed database with sample data
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
- ❌ **EMPTY DATABASE** (0 locations, 0 categories, 0 users)
- ❌ MCP tool integration for database operations
- ❌ Southern California content seeding
- ❌ API integration and data fetching
- ❌ Authentication system implementation

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
1. **Database Content Seeding** - Currently EMPTY database needs Southern California locations
2. **MCP Tool Integration** - Connect available MCP Supabase tools for database operations
3. **Navigation Functionality** - Make burger menu items functional
4. **Authentication Implementation** - Enable user accounts and premium features

**Current Project Status: ~55% Complete**
- **Excellent Foundation**: World-class mobile UI/UX with TypeScript safety
- **Major Gap**: Empty database prevents functional travel guide experience
- **Technical Debt**: Minimal - code quality is high with proper types
- **Estimated Timeline**: 4-6 weeks to reach functional MVP

**Documentation Accuracy**: Updated to reflect 55% actual completion vs previous 95% claims

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

      IMPORTANT: this context may or may not be relevant to your tasks.
- co author josue zazueta webdev.josue@gmail.com
# Drive SoCal POV - Development Capabilities

**PROJECT:** Drive SoCal POV
**REPO:** drivesocalpov
**STACK:** Next.js 15 + React 19 + TypeScript + Supabase + Vercel
**STATUS:** 55% Complete - Foundation Built, Database Empty

## MCP Server Inventory

| Server | Transport | Tools Available | Auth | Rate Limits | Status |
|--------|-----------|----------------|------|-------------|---------|
| **Context7** | HTTP | `resolve-library-id`, `get-library-docs` | Built-in | Standard API calls | ✅ AVAILABLE |
| **Z.AI Web Search** | HTTP | `webSearchPrime` | Built-in | Standard search limits | ✅ AVAILABLE |
| **Z.AI Vision** | HTTP | `analyze_image`, `analyze_video` | Built-in | 5MB images, 8MB videos | ✅ AVAILABLE |
| **Chrome DevTools** | HTTP | 25+ automation tools | Local Chrome | Local instance limits | ✅ AVAILABLE |
| **Supabase** | HTTP | 20+ DB/infra tools | Project keys | Project-based limits | ✅ AVAILABLE |
| **Vercel** | HTTP | 15+ deploy tools | Team tokens | Account-based limits | ✅ AVAILABLE |

## Existing Commands & Hooks

### Current Slash Commands (.claude/commands/)
- `/agile-standup` - Daily standup updates
- `/sprint-planning` - Sprint planning facilitation
- `/sprint-review` - Sprint retrospective
- `/backlog-management` - Backlog grooming
- `/code-review` - Code review facilitation
- `/tech-decision` - Technical decision documentation
- `/agile-metrics` - Team velocity and metrics
- `/retrospective` - Sprint retrospectives

### Missing Commands (Gaps)
- `/bootstrap` - Repository initialization
- `/skill <name>` - Skill execution
- `/mcp` - MCP server listing
- `/db migrate` - Database migration
- `/deploy preview|prod` - Guarded deployment
- `/env sync preview|prod` - Environment synchronization

### Current Hooks Status
- ❌ **No hooks detected** - Critical gap for deployment gates
- Missing: pre-plan, pre-execute, pre-deploy, post-deploy hooks

## Sub-Agent Requirements

### Required Sub-Agents (Missing Implementation)
| Agent | Purpose | MCP Tools | Status |
|-------|---------|-----------|---------|
| **Planner** | Backlog grooming, story slicing, sprint planning | Context7, Web Search | ❌ MISSING |
| **Researcher** | Documentation research, version-pinned notes | Context7, Web Search, Vision | ❌ MISSING |
| **Toolsmith** | Skills/Plugins/Hooks development, MCP wiring | All MCP tools | ❌ MISSING |
| **Deployer** | Vercel/Supabase env management, deployments | Vercel, Supabase tools | ❌ MISSING |
| **QA** | Testing, lint/type checks, deployment gates | Chrome DevTools, all tools | ❌ MISSING |

## Skills Infrastructure (Missing)

### Required Skills Structure
```
skills/
├── app_scaffold/     # PWA scaffolding (Next.js + shadcn/ui)
├── db_migrations/    # Supabase CLI recipes, RLS templates
├── testing/         # Vitest/Playwright setup, a11y/perf checks
├── deploy/          # Vercel + Supabase deployment flows
├── observability/   # Logging, feature flags, smoke checks
└── recursive_review/ # Periodic repo/docs/backlog reviews
```

**Current Status:** ❌ **No skills directory exists**

## Critical Gaps Analysis

### 🔴 Critical Blockers
1. **No Sub-Agents** - All 5 required sub-agents missing
2. **No Skills Infrastructure** - Complete skills/ directory missing
3. **Missing Core Commands** - bootstrap, skill, deploy, db commands
4. **No Hooks** - Deployment gates and quality checks missing
5. **Empty Database** - 0 locations despite complete schema

### 🟡 High Priority
1. **Environment Sync** - No preview/prod separation strategy
2. **MCP Integration** - Servers available but not integrated into workflow
3. **Deployment Pipeline** - No automated preview/prod flows

### 🟢 Available Assets
1. **Complete MCP Suite** - All required MCP servers available
2. **Solid Foundation** - 55% complete with excellent code quality
3. **Agile Commands** - 8 agile methodology commands ready
4. **Documentation** - Comprehensive docs/ structure exists

## MCP Server Tool Examples

### Context7 Usage
```javascript
// Resolve library ID
await mcp__context7__resolve-library-id({ libraryName: "@vis.gl/react-maplibre" })

// Get documentation
await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/visgl/react-maplibre",
  topic: "hooks",
  tokens: 5000
})
```

### Supabase Usage
```javascript
// List tables
await mcp__supabase__list_tables({ schemas: ["public"] })

// Apply migration
await mcp__supabase__apply_migration({
  name: "add_locations_table",
  query: "CREATE TABLE locations (...)"
})
```

### Vercel Usage
```javascript
// Deploy to Vercel
await mcp__vercel__deploy_to_vercel()

// List projects
await mcp__vercel__list_projects({ teamId: "team_xxx" })
```

### Chrome DevTools Usage
```javascript
// Take screenshot
await mcp__chrome-devtools__take_screenshot({
  format: "png",
  quality: 90,
  fullPage: true,
  filePath: "./screenshots/test.png"
})

// Performance audit
await mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})
```

## Next Steps Priority Matrix

| Priority | Action | Impact | Effort | Timeline |
|----------|--------|--------|--------|----------|
| 🔴 P0 | Create Skills Infrastructure | High | Medium | 1 day |
| 🔴 P0 | Implement Missing Commands | High | Medium | 2 days |
| 🔴 P0 | Setup Deployment Hooks | High | Medium | 1 day |
| 🟡 P1 | Create Sub-Agents | High | High | 3 days |
| 🟡 P1 | Database Content Seeding | Critical | Medium | 2 days |
| 🟢 P2 | Environment Sync Setup | Medium | Low | 1 day |

## CURRENT PROJECT STATUS
- **Phase**: Phase 3 - Mobile UI/UX Components (55% Complete)
- **Live Site**: drivesocalpov.vercel.app ✅
- **Database**: EMPTY (0 locations, 0 users, 0 content) ❌
- **Authentication**: Not implemented ❌
- **Build System**: Next.js 15+ with Turbopack ✅

## DEVELOPMENT COMMANDS
```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Database (Supabase CLI needed)
supabase start       # Start local Supabase
supabase db push     # Push migrations
supabase db reset    # Reset database

# Deployment (Vercel CLI needed)
vercel link          # Link to Vercel project
vercel deploy        # Deploy to preview
vercel --prod        # Deploy to production
```

## ARCHITECTURE OVERVIEW

### Mobile-First Structure
- **Layout**: Top branding → Full-screen map → Bottom ad banner → Burger menu
- **Map**: MapLibre GL with OpenStreetMap (strict Southern California bounds)
- **UI**: shadcn/ui components with Tailwind CSS 4
- **State**: Zustand with React 19 concurrency support

### Key Components
- **MapProvider.tsx**: Main map component with performance optimization
- **MobileLayout.tsx**: 702-line advanced mobile layout system
- **MockLocationMarkers.tsx**: 18 hardcoded Southern California locations
- **Filter System**: Visual only (needs database connection)

### Database Schema (Ready but Empty)
- 15 comprehensive tables designed
- RLS policies ready
- TypeScript types generated
- MCP integration available

## NEXT STEPS REQUIRED
1. **Link Vercel Project**: `vercel link` for deployment automation
2. **Configure Supabase CLI**: Local development database
3. **Create Sub-agents**: Specialized workflow automation
4. **Build Skills Pack**: Repeatable automation patterns
5. **Database Seeding**: Add Southern California location data
6. **Authentication Implementation**: User accounts and profiles
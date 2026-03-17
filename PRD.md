# DriveSoCal POV — Product Requirements Document

> **Version:** 1.0
> **Date:** 2026-03-17
> **Owner:** Josue Zazueta LLC
> **Brand:** DriveSoCal POV
> **Domains:** drivesocalpov.com / drivesocalpov.app / drivesocalpov.shop

---

## Executive Summary

DriveSoCal POV is a two-platform ecosystem for Southern California car culture, exploration, and local discovery:

1. **drivesocalpov.com** — Digital directory (Reddit-style community + business listings)
2. **drivesocalpov.app** — Gamified social map for real-world exploration

Both platforms are IP-clean — no game trademarks, no copied assets. Inspired by the *concept* of open-world exploration, not any specific game.

---

## Platform 1: drivesocalpov.com — Digital Directory

### Concept

A Reddit-style community hub + structured business directory for SoCal drivers. Think:

- **Reddit** → Community posts, upvotes, threads, discussions
- **Yelp** → Business listings with ratings
- **Google Maps** → Location data + directions
- **Instagram** → POV car content and scenic drives

### Core Features

#### 1. Community Feed
- User-submitted posts (text + image/video)
- Upvote/downvote system
- Categories/tags: Food, Drives, Photo Spots, Meets, Builds, Culture
- Spanglish-friendly (EN/ES/Spanglish content welcome)
- Nested comments with replies
- Trending/hot algorithm (like Reddit's front page)

#### 2. Business Directory
- Structured listings for SoCal businesses relevant to car culture
- Categories:
  - 🌮 **Food** — Taco spots, burger joints, food trucks, coffee
  - 🔧 **Services** — Auto shops, detailers, tint, wraps
  - 🏪 **Shopping** — Parts stores, gear, accessories
  - ⛽ **Fuel** — Gas stations, EV chargers
  - 🏥 **Emergency** — Towing, tire shops, 24hr mechanics
- Each listing includes:
  - Name, address, phone, hours
  - User ratings (1-5 stars)
  - User reviews (text + photos)
  - Connected to map (.app)
  - Tags (e.g., "late night", "drive-thru", "truck-friendly")

#### 3. Content Channels
- Pre-seeded editorial content:
  - "Route of the Week" — Featured scenic drive
  - "Hidden Gem" — Off-the-beaten-path spot
  - "Meet Recap" — Car meet coverage
  - "Build Spotlight" — Featured car builds
- User-generated content rises through upvotes

#### 4. User Profiles
- Username, avatar, car info (make/model/year)
- Karma system (upvotes received on posts/comments)
- Badges earned from .app activity
- Saved routes, favorite spots, following

#### 5. Event System
- Car meets, cruises, shows, track days
- RSVP system
- Calendar view with filters (date, location, type)
- User-created events + promoted events

### Monetization (Phase 2+)

| Revenue Stream | How |
|---------------|-----|
| **Business listings** | Premium placement, featured status |
| **Sponsored posts** | Native advertising in feed |
| **Event promotion** | Boosted event visibility |
| **Affiliate links** | Parts, accessories, insurance |
| **Merch** | DriveSoCal POV branded gear |

### Tech Stack (Website)

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js (React) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File storage | Supabase Storage |
| Hosting | Vercel (FREE tier) |
| Search | Full-text via PostgreSQL |
| Map embed | MapLibre GL + OpenFreeMap |

---

## Platform 2: drivesocalpov.app — Gamified Social Map

### Concept

A real-world exploration game layered on top of a SoCal map. Users drive to locations, check in, earn XP, and unlock new areas. Social features let users share drives, compete on leaderboards, and discover what their friends found.

**Inspired by:** Open-world exploration games, geocaching, Pokémon GO, Strava
**NOT:** Any specific game, trademarked property, or copyrighted content

### Core Mechanics

#### 1. District System
SoCal divided into explorable districts. Each district has tiers of discovery:

| District | Real Area | Unlock Method |
|----------|-----------|--------------|
| Downtown Core | DTLA, Echo Park, Arts District | Start unlocked |
| Westside | Santa Monica, Venice, Culver City | Level 3 |
| Hollywood Hills | Hollywood, West Hollywood, Beverly Hills | Level 5 |
| South Bay | Torrance, Long Beach, Huntington Beach | Level 8 |
| San Gabriel Valley | Pasadena, San Marino, Arcadia | Level 10 |
| Inland Empire | Riverside, San Bernardino, Temecula | Level 12 |
| Coastal North | Malibu, Oxnard, Ventura | Level 15 |
| Mountain | San Bernardino Mtns, Angeles Forest | Level 18 |
| Desert | Joshua Tree, Palm Springs, Salton Sea | Level 20 |
| Orange County | Newport, Laguna, Anaheim | Level 22 |

#### 2. XP & Leveling System

| Action | XP |
|--------|-----|
| Check-in at POI | +10 XP |
| First visit (new POI) | +50 XP |
| Complete a route | +200 XP |
| Post a POV photo/video | +25 XP |
| Write a review (directory) | +30 XP |
| Refer a friend | +100 XP |
| Daily login | +5 XP |
| Weekly streak bonus | +50 XP |

| Level | Title | Unlock |
|-------|-------|--------|
| 1 | Tourist | Start — Downtown Core access |
| 3 | Cruiser | Westside district |
| 5 | Navigator | Hollywood Hills district |
| 8 | Road Tripper | South Bay district |
| 10 | Explorer | San Gabriel Valley |
| 12 | Adventurer | Inland Empire |
| 15 | Pioneer | Coastal North |
| 18 | Mountaineer | Mountain district |
| 20 | Desert Rat | Desert district |
| 22 | Legend | Full map unlocked |

#### 3. Point of Interest (POI) Types

| Category | Icon | Examples | XP |
|----------|------|----------|-----|
| 🌮 **Food** | Taco, burger, coffee, food truck | 10-50 |
| 📸 **Photo Spot** | Scenic overlook, bridge, skyline view | 25-75 |
| 🛣️ **Scenic Drive** | PCH, Mulholland, Angeles Crest | Route XP |
| 🔧 **Service** | Shop, detailer, tow | 10 |
| 🏖️ **Beach** | Venice, Huntington, Newport | 25 |
| 🎭 **Culture** | Street art, murals, venues | 30 |
| 🏔️ **Trail/Nature** | Hikes, viewpoints, waterfalls | 50 |
| 🚗 **Car Culture** | Meets, shows, shops | 30 |
| ⛽ **Fuel** | Gas stations, EV chargers | 5 |
| 🏥 **Emergency** | Towing, 24hr shops | 10 |

#### 4. Badge System

| Badge | How to Earn | Rarity |
|-------|-------------|--------|
| 🌅 Sunrise Cruiser | Check in before 6 AM | Common |
| 🌙 Night Owl | Check in after midnight | Common |
| 🌮 Taco Connoisseur | Visit 10 taco spots | Uncommon |
| 🏖️ Beach Bum | Visit all beaches in a district | Uncommon |
| 🛣️ Road Warrior | Complete 5 scenic routes | Uncommon |
| 📸 Golden Hour | Post photo during golden hour | Common |
| 🏔️ Summit | Visit 5 mountain POIs | Rare |
| 🌵 Desert Fox | Complete desert district | Rare |
| 🗺️ Cartographer | Discover 100 unique POIs | Epic |
| 🏆 Local Legend | Reach max level | Legendary |
| 🔥 Trendsetter | Post with 100+ upvotes | Rare |
| 🤝 Car Club | Attend 10 events | Uncommon |

#### 5. Route Challenges
Pre-built scenic routes with waypoints:

| Route | Distance | Difficulty | District |
|-------|----------|------------|----------|
| Pacific Coast Cruise | 30 mi | Easy | Coastal |
| Mulholland Run | 21 mi | Medium | Hollywood Hills |
| Angeles Crest Climb | 50 mi | Hard | Mountain |
| DTLA Art Loop | 12 mi | Easy | Downtown |
| South Bay Taco Trail | 25 mi | Easy | South Bay |
| Temecula Wine Run | 40 mi | Medium | Inland Empire |
| Joshua Tree Escape | 60 mi | Hard | Desert |
| OC Coastal Cruise | 35 mi | Easy | Orange County |
| PCH North End | 45 mi | Medium | Coastal North |
| Mountain Pass | 70 mi | Hard | Mountain |

**Route rewards:**
- Complete → Route badge + XP
- Fastest time (per car class) → Leaderboard position
- All waypoints photographed → Bonus XP

#### 6. Social Features
- **Friends list** — See friends' activity on map
- **Activity feed** — Check-ins, badges, photos from friends
- **Leaderboard** — Global + friends + district
- **Challenges** — "Visit 5 beaches this weekend" time-limited events
- **Share drives** — Export route as link or embed
- **Clubs** — Create/join car clubs with shared progress

#### 7. Directory Integration
Every POI on the .app links to its full listing on drivesocalpov.com:
- Tap POI on map → Quick card (name, rating, open/closed)
- "View Details" → Opens .com listing in webview
- Directory listing → "Open in Map" → Deep link to .app
- Seamless cross-platform experience

### Tech Stack (App)

| Component | Technology |
|-----------|-----------|
| Framework | React Native (Expo) |
| Maps | MapLibre GL Native + OpenFreeMap |
| Backend | Supabase (shared with .com) |
| Auth | Supabase Auth (shared) |
| Storage | Supabase Storage (shared) |
| Push notifications | Expo Notifications |
| Location | Expo Location (background + foreground) |
| Camera | Expo Camera |
| Hosting | EAS (Expo Application Services) |
| Analytics | Custom (Supabase + PostgreSQL) |

---

## Shared Data Model

## Platform 3: drivesocalpov.shop — Merch Store

### Concept

Branded merchandise for the DriveSoCal POV community. Revenue stream that reinforces brand identity.

### Products (Phase 1)

| Category | Items | Price Range |
|----------|-------|-------------|
| **Apparel** | Tees, hoodies, hats, beanies | $25-55 |
| **Stickers** | Die-cut vinyl, logo, badges, districts | $3-8 |
| **Accessories** | Phone cases, keychains, lanyards | $10-25 |
| **Car Gear** | Decals, license plate frames, air fresheners | $5-20 |
| **Limited Drops** | District-specific collections, event merch | $30-60 |

### District Collection (Branded Series)

Each district gets its own design line:

| District | Theme | Color Palette |
|----------|-------|--------------|
| Downtown Core | Urban, neon, skyline | Dark + neon accents |
| Westside | Beach sunset, chill vibes | Pastels + ocean blue |
| Hollywood Hills | Luxury, glamour, night | Gold + black |
| South Bay | Surf culture, laid back | Teal + sand |
| Inland Empire | Desert, open road | Orange + brown |
| Coastal North | Cliffs, PCH, dramatic | Deep blue + white |
| Mountain | Forest, elevation, adventure | Green + grey |
| Desert | Cacti, stars, vast | Terracotta + navy |
| Orange County | Clean, sunny, upscale | White + orange |

### Monetization
- **Print-on-demand** (no inventory risk) — Printful or Printify
- **Limited drops** (scarcity, hype)
- **Badge rewards** — Unlock exclusive merch at certain levels
- **Bundle deals** — "Route Pack" (sticker + tee + decal)

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Platform | Shopify Lite or custom (Next.js + Stripe) |
| Print provider | Printful / Printify |
| Payments | Stripe |
| Hosting | Vercel (if custom) |
| Inventory | Print-on-demand (zero inventory) |

---

## Domain Overview

| Domain | Purpose | Phase |
|--------|---------|-------|
| drivesocalpov.com | Digital directory + community | Phase 2 |
| drivesocalpov.app | Gamified social map | Phase 3 |
| drivesocalpov.shop | Merch store | Phase 6 (can soft-launch earlier) |

```
┌─────────────────────────────────────────┐
│              Supabase (Shared)           │
├─────────────────────────────────────────┤
│  users          → Profiles, karma, cars  │
│  pois           → Locations, coords, type│
│  checkins       → User visits, XP, GPS  │
│  businesses     → Directory listings     │
│  reviews        → Ratings + text         │
│  posts          → Community feed items   │
│  comments       → Threaded replies       │
│  routes         → Scenic drive data      │
│  badges         → Achievement records    │
│  events         → Meets, shows, cruises  │
│  clubs          → Car club groups        │
│  leaderboard    → Rankings + scores      │
│  challenges     → Time-limited events    │
└─────────────────────────────────────────┘
```

---

## User Flow

### New User Journey

```
1. Download app or visit .com
2. Sign up (email or social)
3. Add car info (optional but encouraged)
4. .app → See unlocked district, nearby POIs
5. .com → Browse feed, search directory
6. Drive to POI → Check in → Earn XP
7. Post photo → Appears in feed + social
8. Level up → Unlock new district
9. Complete route → Badge + leaderboard
10. Repeat → Explore all of SoCal
```

### Content Creator Flow (Mr. Z)

```
1. Post POV content from drives
2. Content appears in community feed
3. High-engagement posts → Featured
4. Route of the Week → Curated by team
5. Drive traffic to both platforms
6. Monetize via sponsored routes + affiliate
```

---

## Content Pillars (Across Both Platforms)

| Pillar | .com | .app |
|--------|------|------|
| 🌮 **Food** | Reviews, lists, guides | Taco trail badge, check-ins |
| 📸 **Photo Spots** | Galleries, best angles | Photo mission POIs |
| 🛣️ **Scenic Drives** | Route write-ups, tips | Gamified route challenges |
| 🏖️ **Beach Culture** | Beach guides, events | Beach POIs, badges |
| 🎭 **Culture** | Street art, venues, music | Cultural POIs, murals map |
| 🚗 **Car Culture** | Builds, meets, shows | Car culture POIs, events |
| 🔧 **Services** | Business directory | Service POIs, quick access |

---

## Phased Roadmap

### Phase 1 — MVP Landing (Current)
- [x] Domain secured (drivesocalpov.com)
- [x] Knowledge base built (GTA-inspired SoCal mapping)
- [x] Tech stack chosen (MapLibre + Supabase)
- [x] Git initialized
- [ ] Landing page live on Vercel
- [ ] Supabase tables created
- [ ] SEO basics (meta, OG tags)

### Phase 2 — Directory MVP (.com)
- [ ] User auth (sign up / login)
- [ ] Community feed (posts + upvotes)
- [ ] Business directory (CRUD + search)
- [ ] Basic ratings + reviews
- [ ] Mobile responsive design
- [ ] 50 seed businesses (SoCal car culture relevant)

### Phase 3 — Map MVP (.app)
- [ ] React Native app (Expo)
- [ ] Map with POIs (MapLibre GL)
- [ ] Check-in system (GPS verified)
- [ ] XP + leveling system
- [ ] First 3 districts unlocked
- [ ] 100 seed POIs (DTLA, Westside, Hollywood)
- [ ] Deep linking to .com directory

### Phase 4 — Gamification
- [ ] Full badge system (12+ badges)
- [ ] Route challenges (10 routes)
- [ ] Leaderboard (global + friends)
- [ ] Time-limited challenges
- [ ] Clubs / car groups
- [ ] Push notifications (nearby POIs, challenges)

### Phase 5 — Social + Growth
- [ ] Friends system
- [ ] Activity feed (social)
- [ ] Share drives / routes
- [ ] Event system
- [ ] Referral program
- [ ] User-generated POI submissions

### Phase 6 — Monetization
- [ ] Premium business listings
- [ ] Sponsored posts / promoted routes
- [ ] Affiliate program (parts, insurance)
- [ ] Merch store (drivesocalpov.shop)
- [ ] Event ticketing

---

## Intellectual Property — Safe Design

### What We Don't Do
- ❌ Mention "GTA", "Grand Theft Auto", "Rockstar Games", "Los Santos"
- ❌ Use any GTA maps, models, textures, or assets
- ❌ Copy game mechanics (wanted levels, missions, NPCs, combat)
- ❌ Reference copyrighted game characters or storylines
- ❌ Use any trademarked game terminology in product/marketing

### What We Do
- ✅ Build an original SoCal travel/exploration app
- ✅ Use real-world locations, businesses, and landmarks
- ✅ Create original gamification mechanics (XP, badges, routes)
- ✅ Draw inspiration from the *genre* (exploration games, geocaching)
- ✅ User-generated content is the core
- ✅ Spanglish/English/Spanish content welcome

### Internal Knowledge Only
- The GTA V mapping knowledge base is for **content inspiration only**
- It helps us know which real-world locations are culturally significant
- It never appears in the user-facing product
- The knowledge base file is for internal reference during content creation

---

## Competitive Analysis

| Feature | DriveSoCal POV | Yelp | Google Maps | Waze | Reddit |
|---------|---------------|------|-------------|------|--------|
| Community feed | ✅ | ❌ | ❌ | ❌ | ✅ |
| Business directory | ✅ | ✅ | ✅ | ❌ | ❌ |
| Gamified exploration | ✅ | ❌ | ❌ | Gamified nav | ❌ |
| Scenic routes | ✅ | ❌ | ✅ | ✅ | ❌ |
| Car culture focus | ✅ | ❌ | ❌ | ❌ | Subreddit |
| Social/leaderboard | ✅ | ❌ | ❌ | ✅ | ❌ |
| POV content | ✅ | ✅ | ✅ | ❌ | ❌ |
| Spanglish support | ✅ | ❌ | ❌ | ❌ | ❌ |
| SoCal exclusive | ✅ | Global | Global | Global | Global |

**Our niche:** The only platform that combines community + directory + gamified exploration + car culture, exclusive to Southern California, in Spanglish.

---

## Target Audience

### Primary
- **SoCal car enthusiasts** (18-40) who love scenic drives
- **Content creators** who post POV car/drive content
- **Foodies who explore by car** (taco tours, burger runs)

### Secondary
- **Tourists** visiting SoCal who want local recommendations
- **Car meet organizers** who need event tools
- **Local businesses** who want to reach the car community

### Demographics
- Location: Southern California (LA, OC, IE, SD)
- Age: 18-40
- Language: English, Spanish, Spanglish
- Income: $30k-$100k
- Interests: Cars, food, photography, exploration, social media

---

## Success Metrics

### Phase 2 (Directory Launch)
- 500 registered users (3 months)
- 100 business listings
- 50 user-generated posts
- 1,000 monthly active users (6 months)

### Phase 3 (App Launch)
- 1,000 app downloads (first month)
- 5,000 check-ins (3 months)
- 200 POIs mapped
- 50 daily active users

### Phase 4 (Gamification)
- 10,000 registered users
- 50,000 check-ins
- 1,000 daily active users
- 3 completed route challenges per user avg

### Phase 6 (Monetization)
- 10 premium business listings
- $500/month revenue
- 25,000 registered users
- Self-sustaining

---

*Last updated: 2026-03-17*
*Owner: Josue Zazueta LLC*

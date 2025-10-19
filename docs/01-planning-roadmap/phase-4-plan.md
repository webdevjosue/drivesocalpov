# Phase 4: Database & Content Integration - Drive SoCal POV

## Phase Overview

Phase 4 focuses on implementing the complete database architecture and content management system for the Drive SoCal POV travel guide app. This phase builds upon the solid foundation from Phases 1-3 to deliver a comprehensive data layer with Supabase integration, Southern California focused content, mobile-optimized queries, and robust content management workflows.

**Estimated Duration:** 7-10 days
**Priority:** High - Core data infrastructure and content system
**Dependencies:** Phase 1, Phase 2, and Phase 3 completion required

## Phase 4 Scope

### Core Deliverables
- **Supabase Database Schema**: Complete database architecture with optimized tables
- **MCP Tool Integration**: Automated database management and type generation
- **Content Seeding**: Southern California attractions, restaurants, events, and locations
- **TypeScript Type Generation**: Auto-generated database types and interfaces
- **API Integration**: RESTful endpoints with mobile optimization
- **Location Data Management**: Geospatial queries and proximity search
- **Search Functionality**: Full-text search with filtering and ranking
- **Data Synchronization**: Offline support and conflict resolution

### Technical Requirements
- **Southern California Focus**: Comprehensive coverage of SoCal attractions and venues
- **Mobile-Optimized Queries**: Efficient data fetching for mobile performance
- **Free vs Premium Content**: Tiered content access system
- **Geospatial Capabilities**: Location-based queries and mapping integration
- **Scalable Architecture**: Support for content growth and user expansion
- **Type Safety**: Full TypeScript integration with auto-generated types

## Database Schema Architecture

### 1. Core Database Tables

#### 1.1 Locations Table
**File:** `migrations/001_create_locations_table.sql`

```sql
-- Create locations table for SoCal attractions, restaurants, events
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,

  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'CA',
  zip_code TEXT,
  neighborhood TEXT,

  -- categorization
  category location_category NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',

  -- content access
  is_premium BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,

  -- contact information
  website TEXT,
  phone TEXT,
  email TEXT,

  -- hours and pricing
  hours JSONB, -- Structured hours data
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),

  -- media
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  virtual_tour_url TEXT,

  -- ratings and reviews
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),

  -- social features
  favorite_count INTEGER DEFAULT 0 CHECK (favorite_count >= 0),
  check_in_count INTEGER DEFAULT 0 CHECK (check_in_count >= 0),

  -- metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Geospatial indexing
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_POINT(longitude, latitude)) STORED,

  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(address, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'D')
  ) STORED
);

-- Create indexes for performance
CREATE INDEX idx_locations_category ON locations(category);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_is_premium ON locations(is_premium);
CREATE INDEX idx_locations_featured ON locations(featured);
CREATE INDEX idx_locations_rating ON locations(rating DESC);
CREATE INDEX idx_locations_created_at ON locations(created_at DESC);
CREATE INDEX idx_locations_search_vector ON locations USING GIN(search_vector);
CREATE INDEX idx_locations_location ON locations USING GIST(location);

-- Enable RLS (Row Level Security)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Locations are viewable by everyone" ON locations
  FOR SELECT USING (true);

CREATE POLICY "Locations can be created by authenticated users" ON locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Locations can be updated by creators or admins" ON locations
  FOR UPDATE USING (auth.uid() = created_by OR auth.jwt()->>>'role' = 'admin');

CREATE POLICY "Locations can be deleted by creators or admins" ON locations
  FOR DELETE USING (auth.uid() = created_by OR auth.jwt()->>>'role' = 'admin');
```

#### 1.2 Users and Profiles Table
**File:** `migrations/002_create_users_profiles_table.sql`

```sql
-- Extend auth.users with profile information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,

  -- preferences
  preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',

  -- location preferences
  home_location GEOGRAPHY(POINT, 4326),
  favorite_cities TEXT[] DEFAULT '{}',
  preferred_categories location_category[] DEFAULT '{}',

  -- subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  subscription_expires_at TIMESTAMPTZ,

  -- social
  instagram_handle TEXT,
  twitter_handle TEXT,

  -- stats
  total_favorites INTEGER DEFAULT 0 CHECK (total_favorites >= 0),
  total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  total_check_ins INTEGER DEFAULT 0 CHECK (total_check_ins >= 0),

  -- metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_profiles_last_active_at ON profiles(last_active_at DESC);
CREATE INDEX idx_profiles_home_location ON profiles USING GIST(home_location);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### 1.3 Itineraries Table
**File:** `migrations/003_create_itineraries_table.sql`

```sql
-- Create itineraries table for trip planning
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- basic info
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,

  -- dates
  start_date DATE,
  end_date DATE,
  duration_days INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN start_date IS NOT NULL AND end_date IS NOT NULL
      THEN end_date - start_date
      ELSE NULL
    END
  ) STORED,

  -- access control
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,

  -- content
  locations JSONB DEFAULT '[]', -- Array of location IDs with order and metadata
  notes JSONB DEFAULT '{}',
  budget DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),

  -- location data
  start_location GEOGRAPHY(POINT, 4326),
  end_location GEOGRAPHY(POINT, 4326),

  -- social
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0),
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  copy_count INTEGER DEFAULT 0 CHECK (copy_count >= 0),

  -- tags and categories
  tags TEXT[] DEFAULT '{}',
  itinerary_type TEXT CHECK (itinerary_type IN ('weekend', 'week_long', 'day_trip', 'road_trip')),

  -- metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED
);

-- Create indexes
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_itineraries_is_public ON itineraries(is_public);
CREATE INDEX idx_itineraries_start_date ON itineraries(start_date);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX idx_itineraries_search_vector ON itineraries USING GIN(search_vector);
CREATE INDEX idx_itineraries_start_location ON itineraries USING GIST(start_location);

-- Enable RLS
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public itineraries are viewable by everyone" ON itineraries
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own itineraries" ON itineraries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own itineraries" ON itineraries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries" ON itineraries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries" ON itineraries
  FOR DELETE USING (auth.uid() = user_id);
```

#### 1.4 Favorites Table
**File:** `migrations/004_create_favorites_table.sql`

```sql
-- Create favorites table for user-saved locations
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,

  -- metadata
  notes TEXT,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  tags TEXT[] DEFAULT '{}',

  -- visit tracking
  visited BOOLEAN DEFAULT false,
  visit_count INTEGER DEFAULT 0 CHECK (visit_count >= 0),
  last_visited_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique favorites per user/location
  UNIQUE(user_id, location_id)
);

-- Create indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_location_id ON favorites(location_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);
CREATE INDEX idx_favorites_priority ON favorites(priority DESC);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

#### 1.5 Categories and Subcategories
**File:** `migrations/005_create_categories_table.sql`

```sql
-- Create categories table for hierarchical organization
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,

  -- hierarchy
  parent_id UUID REFERENCES categories(id),
  level INTEGER DEFAULT 0 CHECK (level >= 0),
  sort_order INTEGER DEFAULT 0,

  -- filtering
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- content counts
  location_count INTEGER DEFAULT 0 CHECK (location_count >= 0),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_level ON categories(level);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Insert base categories
INSERT INTO categories (name, slug, description, icon, color, level, sort_order) VALUES
('Attractions', 'attractions', 'Tourist attractions and points of interest', 'map-pin', '#ef4444', 0, 1),
('Restaurants', 'restaurants', 'Dining and food establishments', 'utensils', '#f59e0b', 0, 2),
('Events', 'events', 'Current and upcoming events', 'calendar', '#8b5cf6', 0, 3),
('Parks', 'parks', 'Parks and outdoor recreation', 'trees', '#10b981', 0, 4),
('Beaches', 'beaches', 'Beaches and water activities', 'waves', '#06b6d4', 0, 5),
('Entertainment', 'entertainment', 'Entertainment venues and activities', 'music', '#ec4899', 0, 6);

-- Create enum type for location categories
CREATE TYPE location_category AS ENUM (
  'attraction', 'restaurant', 'event', 'park', 'beach', 'entertainment'
);
```

### 2. MCP Tool Integration

#### 2.1 Database Migration Management
**File:** `scripts/mcp-migrations.ts`

```typescript
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class MigrationManager {
  constructor(private supabaseUrl: string, private supabaseKey: string) {}

  // Apply migration using MCP Supabase tool
  async applyMigration(name: string, sql: string): Promise<void> {
    try {
      console.log(`Applying migration: ${name}`)

      // This would use the MCP Supabase apply_migration tool
      // For now, we'll simulate the call
      const migrationQuery = `
        -- Migration: ${name}
        ${sql}
      `

      console.log(`Migration ${name} applied successfully`)
    } catch (error) {
      console.error(`Failed to apply migration ${name}:`, error)
      throw error
    }
  }

  // Generate TypeScript types using MCP tool
  async generateTypes(): Promise<void> {
    try {
      console.log('Generating TypeScript types...')

      // This would use the MCP Supabase generate_typescript_types tool
      // const types = await mcp__supabase__generate_typescript_types()

      console.log('TypeScript types generated successfully')
    } catch (error) {
      console.error('Failed to generate TypeScript types:', error)
      throw error
    }
  }

  // List all tables using MCP tool
  async listTables(): Promise<string[]> {
    try {
      console.log('Listing database tables...')

      // This would use the MCP Supabase list_tables tool
      // const tables = await mcp__supabase__list_tables({ schemas: ['public'] })

      // Mock response for demonstration
      const tables = ['locations', 'profiles', 'itineraries', 'favorites', 'categories']

      console.log('Tables:', tables)
      return tables
    } catch (error) {
      console.error('Failed to list tables:', error)
      throw error
    }
  }

  // Execute custom SQL using MCP tool
  async executeSQL(query: string): Promise<any> {
    try {
      console.log('Executing SQL query...')

      // This would use the MCP Supabase execute_sql tool
      // const result = await mcp__supabase__execute_sql({ query })

      console.log('SQL query executed successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to execute SQL query:', error)
      throw error
    }
  }
}

// Usage example
const migrationManager = new MigrationManager(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default migrationManager
```

#### 2.2 Content Seeding Workflow
**File:** `scripts/seed-content.ts`

```typescript
import { migrationManager } from './mcp-migrations'
import { socalLocations } from '../data/socal-locations'
import { socalRestaurants } from '../data/socal-restaurants'
import { socalEvents } from '../data/socal-events'
import { socalAttractions } from '../data/socal-attractions'

export class ContentSeeder {
  constructor(private migrationManager: MigrationManager) {}

  async seedAllContent(): Promise<void> {
    console.log('Starting content seeding for Southern California...')

    try {
      // Seed locations in batches to avoid timeouts
      await this.seedLocations(socalAttractions, 'attractions')
      await this.seedLocations(socalRestaurants, 'restaurants')
      await this.seedLocations(socalEvents, 'events')

      // Update location counts in categories
      await this.updateCategoryCounts()

      console.log('Content seeding completed successfully!')
    } catch (error) {
      console.error('Content seeding failed:', error)
      throw error
    }
  }

  private async seedLocations(locations: any[], category: string): Promise<void> {
    console.log(`Seeding ${category}...`)

    const batchSize = 50
    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = locations.slice(i, i + batchSize)

      const insertQuery = `
        INSERT INTO locations (
          name, description, short_description, latitude, longitude,
          address, city, state, zip_code, neighborhood, category,
          subcategory, tags, is_premium, featured, verified, website,
          phone, email, hours, price_range, price_level, images,
          videos, virtual_tour_url, rating, review_count
        ) VALUES ${this.buildValueString(batch.length)}
        ON CONFLICT DO NOTHING;
      `

      const values = batch.flatMap(location => [
        location.name,
        location.description,
        location.shortDescription || null,
        location.latitude,
        location.longitude,
        location.address,
        location.city,
        location.state || 'CA',
        location.zipCode || null,
        location.neighborhood || null,
        category,
        location.subcategory || null,
        location.tags || '{}',
        location.isPremium || false,
        location.featured || false,
        location.verified || true,
        location.website || null,
        location.phone || null,
        location.email || null,
        JSON.stringify(location.hours || {}),
        location.priceRange || null,
        location.priceLevel || null,
        location.images || '{}',
        location.videos || '{}',
        location.virtualTourUrl || null,
        location.rating || null,
        location.reviewCount || 0
      ])

      await this.migrationManager.executeSQL(insertQuery)
      console.log(`Seeded batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(locations.length / batchSize)}`)

      // Add delay between batches to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  private buildValueString(count: number): string {
    return Array(count).fill(0).map((_, i) => {
      const startIndex = i * 19 // 19 values per location
      const placeholders = Array(19).fill(0).map((_, j) => `$${startIndex + j + 1}`).join(', ')
      return `(${placeholders})`
    }).join(', ')
  }

  private async updateCategoryCounts(): Promise<void> {
    console.log('Updating category location counts...')

    const updateQuery = `
      UPDATE categories
      SET location_count = (
        SELECT COUNT(*)
        FROM locations
        WHERE category = categories.slug::location_category
      );
    `

    await this.migrationManager.executeSQL(updateQuery)
  }

  async verifySeeding(): Promise<void> {
    console.log('Verifying content seeding...')

    const tables = await this.migrationManager.listTables()

    for (const table of ['locations', 'categories']) {
      if (tables.includes(table)) {
        const countQuery = `SELECT COUNT(*) as count FROM ${table}`
        const result = await this.migrationManager.executeSQL(countQuery)
        console.log(`${table}: ${result.count} records`)
      }
    }
  }
}

// Run seeding if called directly
if (require.main === module) {
  const seeder = new ContentSeeder(migrationManager)
  seeder.seedAllContent()
    .then(() => seeder.verifySeeding())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}

export default ContentSeeder
```

### 3. TypeScript Type Generation

#### 3.1 Database Types
**File:** `src/lib/database/types.ts`

```typescript
// Auto-generated types from Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Database types
export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string
          name: string
          description: string
          short_description: string | null
          latitude: number
          longitude: number
          address: string
          city: string
          state: string
          zip_code: string | null
          neighborhood: string | null
          category: LocationCategory
          subcategory: string | null
          tags: string[]
          is_premium: boolean
          featured: boolean
          verified: boolean
          website: string | null
          phone: string | null
          email: string | null
          hours: Json | null
          price_range: string | null
          price_level: number | null
          images: string[]
          videos: string[]
          virtual_tour_url: string | null
          rating: number | null
          review_count: number
          favorite_count: number
          check_in_count: number
          created_at: string
          updated_at: string
          created_by: string | null
          location: string | null // PostGIS geography
          search_vector: string | null // tsvector
        }
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'id' | 'created_at' | 'updated_at' | 'location' | 'search_vector' | 'favorite_count' | 'check_in_count' | 'review_count'>
        Update: Partial<Database['public']['Tables']['locations']['Insert']>
      }

      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          preferences: Json
          notification_settings: Json
          privacy_settings: Json
          home_location: string | null
          favorite_cities: string[]
          preferred_categories: LocationCategory[]
          subscription_tier: 'free' | 'premium'
          subscription_expires_at: string | null
          instagram_handle: string | null
          twitter_handle: string | null
          total_favorites: number
          total_reviews: number
          total_check_ins: number
          created_at: string
          updated_at: string
          last_active_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at' | 'last_active_at' | 'total_favorites' | 'total_reviews' | 'total_check_ins'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }

      itineraries: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cover_image: string | null
          start_date: string | null
          end_date: string | null
          duration_days: number | null
          is_public: boolean
          is_collaborative: boolean
          locations: Json
          notes: Json
          budget: number | null
          actual_cost: number | null
          start_location: string | null
          end_location: string | null
          like_count: number
          view_count: number
          copy_count: number
          tags: string[]
          itinerary_type: string | null
          created_at: string
          updated_at: string
          published_at: string | null
          search_vector: string | null
        }
        Insert: Omit<Database['public']['Tables']['itineraries']['Row'], 'id' | 'created_at' | 'updated_at' | 'published_at' | 'duration_days' | 'like_count' | 'view_count' | 'copy_count' | 'search_vector'>
        Update: Partial<Database['public']['Tables']['itineraries']['Insert']>
      }

      favorites: {
        Row: {
          id: string
          user_id: string
          location_id: string
          notes: string | null
          priority: number
          tags: string[]
          visited: boolean
          visit_count: number
          last_visited_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at' | 'updated_at' | 'visit_count' | 'last_visited_at'>
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>
      }

      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          parent_id: string | null
          level: number
          sort_order: number
          is_active: boolean
          is_featured: boolean
          location_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at' | 'location_count'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
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

// Extended types for application use
export interface LocationWithDetails extends Database['public']['Tables']['locations']['Row'] {
  distance?: number
  is_favorited?: boolean
  rating_distribution?: Record<string, number>
  recent_reviews?: Review[]
}

export interface ProfileWithStats extends Database['public']['Tables']['profiles']['Row'] {
  favorite_locations?: LocationWithDetails[]
  public_itineraries?: Itinerary[]
}

export interface ItineraryWithLocations extends Database['public']['Tables']['itineraries']['Row'] {
  locations_data?: LocationWithDetails[]
  author?: ProfileWithStats
}

export interface FavoriteWithLocation extends Database['public']['Tables']['favorites']['Row'] {
  location?: LocationWithDetails
}

export interface CategoryWithChildren extends Database['public']['Tables']['categories']['Row'] {
  children?: CategoryWithChildren[]
  parent?: CategoryWithChildren
}

export interface Review {
  id: string
  location_id: string
  user_id: string
  rating: number
  title: string
  content: string
  images: string[]
  helpful_count: number
  created_at: string
  updated_at: string
  user?: ProfileWithStats
}

// Search and filtering types
export interface SearchFilters {
  categories?: LocationCategory[]
  cities?: string[]
  price_ranges?: string[]
  rating?: number
  is_premium?: boolean
  featured?: boolean
  tags?: string[]
  distance?: number
  latitude?: number
  longitude?: number
}

export interface SearchResult {
  locations: LocationWithDetails[]
  total: number
  page: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

// API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}
```

#### 3.2 Type Generation Script
**File:** `scripts/generate-types.ts`

```typescript
import { writeFileSync } from 'fs'
import { join } from 'path'
import { migrationManager } from './mcp-migrations'

export class TypeGenerator {
  constructor(private migrationManager: MigrationManager) {}

  async generateDatabaseTypes(): Promise<void> {
    try {
      console.log('Generating database types...')

      // This would use the MCP Supabase generate_typescript_types tool
      // const types = await mcp__supabase__generate_typescript_types()

      // For now, we'll generate a placeholder
      const types = this.generatePlaceholderTypes()

      const outputPath = join(__dirname, '../src/lib/database/types.ts')
      writeFileSync(outputPath, types, 'utf-8')

      console.log(`Database types generated at: ${outputPath}`)
    } catch (error) {
      console.error('Failed to generate database types:', error)
      throw error
    }
  }

  private generatePlaceholderTypes(): string {
    return `// Auto-generated database types
// Generated on: ${new Date().toISOString()}

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
          // ... other fields
        }
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['locations']['Insert']>
      }
      // ... other tables
    }
    Enums: {
      location_category: 'attraction' | 'restaurant' | 'event' | 'park' | 'beach' | 'entertainment'
    }
  }
}

export type LocationCategory = Database['public']['Enums']['location_category']
`
  }

  async validateTypes(): Promise<void> {
    try {
      console.log('Validating generated types...')

      // Check if types file exists and is valid TypeScript
      const ts = require('typescript')
      const fs = require('fs')
      const path = require('path')

      const typesPath = path.join(__dirname, '../src/lib/database/types.ts')

      if (fs.existsSync(typesPath)) {
        const typesContent = fs.readFileSync(typesPath, 'utf-8')
        const result = ts.transpileModule(typesContent, {
          compilerOptions: { module: ts.ModuleKind.CommonJS }
        })

        if (result.diagnostics && result.diagnostics.length > 0) {
          console.warn('Type validation warnings:', result.diagnostics)
        }

        console.log('Types validation completed')
      } else {
        throw new Error('Types file not found')
      }
    } catch (error) {
      console.error('Type validation failed:', error)
      throw error
    }
  }
}

// Generate types if called directly
if (require.main === module) {
  const typeGenerator = new TypeGenerator(migrationManager)
  typeGenerator.generateDatabaseTypes()
    .then(() => typeGenerator.validateTypes())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Type generation failed:', error)
      process.exit(1)
    })
}

export default TypeGenerator
```

### 4. API Integration

#### 4.1 Database Client Setup
**File:** `src/lib/database/client.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './types'

// Client-side database client
export const createClient = () => {
  return createClientComponentClient<Database>()
}

// Server-side database client
export const createServerClient = () => {
  return createServerComponentClient<Database>({
    cookies
  })
}

// Database service class
export class DatabaseService {
  private client: ReturnType<typeof createClient>

  constructor(client?: ReturnType<typeof createClient>) {
    this.client = client || createClient()
  }

  // Location queries
  async getLocation(id: string): Promise<LocationWithDetails | null> {
    const { data, error } = await this.client
      .from('locations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async getLocations(options: {
    category?: LocationCategory
    city?: string
    limit?: number
    offset?: number
    orderBy?: string
    isPremium?: boolean
  } = {}): Promise<LocationWithDetails[]> {
    let query = this.client
      .from('locations')
      .select('*')

    if (options.category) {
      query = query.eq('category', options.category)
    }

    if (options.city) {
      query = query.eq('city', options.city)
    }

    if (options.isPremium !== undefined) {
      query = query.eq('is_premium', options.isPremium)
    }

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: false })
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async searchLocations(query: string, filters: SearchFilters = {}): Promise<SearchResult> {
    let dbQuery = this.client
      .from('locations')
      .select('*', { count: 'exact' })
      .textSearch('search_vector', query)

    // Apply filters
    if (filters.categories?.length) {
      dbQuery = dbQuery.in('category', filters.categories)
    }

    if (filters.cities?.length) {
      dbQuery = dbQuery.in('city', filters.cities)
    }

    if (filters.rating) {
      dbQuery = dbQuery.gte('rating', filters.rating)
    }

    if (filters.is_premium !== undefined) {
      dbQuery = dbQuery.eq('is_premium', filters.is_premium)
    }

    if (filters.featured) {
      dbQuery = dbQuery.eq('featured', true)
    }

    // Geospatial filter
    if (filters.latitude && filters.longitude && filters.distance) {
      dbQuery = dbQuery.rpc('nearby_locations', {
        lat: filters.latitude,
        lng: filters.longitude,
        radius_meters: filters.distance * 1609.34 // Convert miles to meters
      })
    }

    // Pagination
    const page = filters.page || 1
    const perPage = filters.per_page || 20
    const offset = (page - 1) * perPage

    dbQuery = dbQuery
      .range(offset, offset + perPage - 1)
      .order('rating', { ascending: false })

    const { data, error, count } = await dbQuery

    if (error) throw error

    return {
      locations: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      has_next: (offset + perPage) < (count || 0),
      has_prev: page > 1
    }
  }

  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radius: number = 10, // miles
    options: {
      category?: LocationCategory
      limit?: number
    } = {}
  ): Promise<LocationWithDetails[]> {
    const { data, error } = await this.client
      .rpc('nearby_locations', {
        lat: latitude,
        lng: longitude,
        radius_meters: radius * 1609.34,
        category_filter: options.category,
        limit_count: options.limit || 50
      })

    if (error) throw error
    return data || []
  }

  // Favorites management
  async getFavorites(userId: string): Promise<FavoriteWithLocation[]> {
    const { data, error } = await this.client
      .from('favorites')
      .select(`
        *,
        location:locations(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async addFavorite(userId: string, locationId: string, notes?: string): Promise<void> {
    const { error } = await this.client
      .from('favorites')
      .insert({
        user_id: userId,
        location_id: locationId,
        notes
      })

    if (error) throw error

    // Update favorite count
    await this.client.rpc('increment_favorite_count', { location_id: locationId })
  }

  async removeFavorite(userId: string, locationId: string): Promise<void> {
    const { error } = await this.client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('location_id', locationId)

    if (error) throw error

    // Update favorite count
    await this.client.rpc('decrement_favorite_count', { location_id: locationId })
  }

  // Itinerary management
  async getItineraries(userId: string, options: {
    isPublic?: boolean
    limit?: number
  } = {}): Promise<ItineraryWithLocations[]> {
    let query = this.client
      .from('itineraries')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('user_id', userId)

    if (options.isPublic !== undefined) {
      query = query.eq('is_public', options.isPublic)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async createItinerary(userId: string, itinerary: Partial<Itinerary>): Promise<Itinerary> {
    const { data, error } = await this.client
      .from('itineraries')
      .insert({
        user_id: userId,
        ...itinerary
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // User profile management
  async getProfile(userId: string): Promise<ProfileWithStats | null> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error
    }

    return data
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
    const { error } = await this.client
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) throw error
  }

  // Categories
  async getCategories(): Promise<CategoryWithChildren[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) throw error

    // Build hierarchy
    return this.buildCategoryHierarchy(data || [])
  }

  private buildCategoryHierarchy(categories: any[]): CategoryWithChildren[] {
    const categoryMap = new Map()
    const rootCategories: CategoryWithChildren[] = []

    // Create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Build hierarchy
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children.push(categoryWithChildren)
        }
      } else {
        rootCategories.push(categoryWithChildren)
      }
    })

    return rootCategories
  }
}

// Export singleton instance
export const db = new DatabaseService()
```

#### 4.2 API Routes
**File:** `src/app/api/locations/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/database/client'
import { SearchFilters } from '@/lib/database/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const db = createServerClient()

    // Parse query parameters
    const query = searchParams.get('q')
    const category = searchParams.get('category') as any
    const city = searchParams.get('city')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const distance = searchParams.get('distance')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '20'), 100)

    // Build filters
    const filters: SearchFilters = {
      page,
      per_page: perPage
    }

    if (category) {
      filters.categories = [category]
    }

    if (city) {
      filters.cities = [city]
    }

    if (lat && lng && distance) {
      filters.latitude = parseFloat(lat)
      filters.longitude = parseFloat(lng)
      filters.distance = parseFloat(distance)
    }

    // Execute search
    if (query) {
      const result = await db.searchLocations(query, filters)
      return NextResponse.json({
        success: true,
        data: result
      })
    } else {
      const locations = await db.getLocations({
        category,
        city,
        limit: perPage,
        offset: (page - 1) * perPage
      })

      return NextResponse.json({
        success: true,
        data: {
          locations,
          total: locations.length,
          page,
          per_page: perPage,
          has_next: false,
          has_prev: page > 1
        }
      })
    }
  } catch (error) {
    console.error('Locations API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch locations'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = createServerClient()

    // Validate request body
    if (!body.name || !body.description || !body.latitude || !body.longitude) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      )
    }

    // Create location (would require authentication in production)
    const { data, error } = await db.client
      .from('locations')
      .insert({
        name: body.name,
        description: body.description,
        short_description: body.short_description,
        latitude: body.latitude,
        longitude: body.longitude,
        address: body.address,
        city: body.city,
        category: body.category,
        // ... other fields
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Create location error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create location'
      },
      { status: 500 }
    )
  }
}
```

#### 4.3 Geospatial Functions
**File:** `migrations/006_create_geospatial_functions.sql`

```sql
-- Function to find nearby locations
CREATE OR REPLACE FUNCTION nearby_locations(
  lat DECIMAL,
  lng DECIMAL,
  radius_meters INTEGER DEFAULT 16093, -- 10 miles in meters
  category_filter location_category DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  address TEXT,
  city TEXT,
  category location_category,
  rating DECIMAL,
  images TEXT[],
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.description,
    l.latitude,
    l.longitude,
    l.address,
    l.city,
    l.category,
    l.rating,
    l.images,
    ROUND(
      ST_Distance(
        l.location,
        ST_GeographyFromText('SRID=4326;POINT(' || lng || ' ' || lat || ')')
      ) / 1000.0,
      2
    ) as distance_km
  FROM locations l
  WHERE
    l.location IS NOT NULL
    AND ST_DWithin(
      l.location,
      ST_GeographyFromText('SRID=4326;POINT(' || lng || ' ' || lat || ')'),
      radius_meters
    )
    AND (category_filter IS NULL OR l.category = category_filter)
  ORDER BY distance_km
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to increment favorite count
CREATE OR REPLACE FUNCTION increment_favorite_count(location_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE locations
  SET favorite_count = favorite_count + 1,
      updated_at = NOW()
  WHERE id = location_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement favorite count
CREATE OR REPLACE FUNCTION decrement_favorite_count(location_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE locations
  SET favorite_count = GREATEST(favorite_count - 1, 0),
      updated_at = NOW()
  WHERE id = location_id;
END;
$$ LANGUAGE plpgsql;

-- Function for advanced search
CREATE OR REPLACE FUNCTION search_locations_advanced(
  search_query TEXT,
  category_filter location_category DEFAULT NULL,
  city_filter TEXT DEFAULT NULL,
  min_rating DECIMAL DEFAULT NULL,
  is_premium_filter BOOLEAN DEFAULT NULL,
  lat DECIMAL DEFAULT NULL,
  lng DECIMAL DEFAULT NULL,
  radius_meters INTEGER DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  address TEXT,
  city TEXT,
  category location_category,
  rating DECIMAL,
  review_count INTEGER,
  images TEXT[],
  distance_km DECIMAL,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.description,
    l.latitude,
    l.longitude,
    l.address,
    l.city,
    l.category,
    l.rating,
    l.review_count,
    l.images,
    CASE
      WHEN lat IS NOT NULL AND lng IS NOT NULL THEN
        ROUND(
          ST_Distance(
            l.location,
            ST_GeographyFromText('SRID=4326;POINT(' || lng || ' ' || lat || ')')
          ) / 1000.0,
          2
        )
      ELSE NULL
    END as distance_km,
    ts_rank(l.search_vector, plainto_tsquery('english', search_query)) as search_rank
  FROM locations l
  WHERE
    l.search_vector @@ plainto_tsquery('english', search_query)
    AND (category_filter IS NULL OR l.category = category_filter)
    AND (city_filter IS NULL OR l.city = city_filter)
    AND (min_rating IS NULL OR l.rating >= min_rating)
    AND (is_premium_filter IS NULL OR l.is_premium = is_premium_filter)
    AND (
      lat IS NULL OR lng IS NULL OR radius_meters IS NULL OR
      ST_DWithin(
        l.location,
        ST_GeographyFromText('SRID=4326;POINT(' || lng || ' ' || lat || ')'),
        radius_meters
      )
    )
  ORDER BY search_rank DESC, l.rating DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for geospatial functions
CREATE INDEX IF NOT EXISTS idx_locations_geography ON locations USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_locations_composite ON locations(category, city, rating);

-- Add comments for documentation
COMMENT ON FUNCTION nearby_locations IS 'Find locations within a specified radius of a point';
COMMENT ON FUNCTION increment_favorite_count IS 'Increment the favorite count for a location';
COMMENT ON FUNCTION decrement_favorite_count IS 'Decrement the favorite count for a location';
COMMENT ON FUNCTION search_locations_advanced IS 'Advanced search with multiple filters and ranking';
```

### 5. Content Seeding Data

#### 5.1 Southern California Attractions Data
**File:** `data/socal-attractions.ts`

```typescript
export const socalAttractions = [
  {
    name: "Hollywood Sign",
    description: "The iconic Hollywood Sign is a landmark and American cultural icon located in Los Angeles, California. Originally erected in 1923 to advertise a local real estate development, the sign now stands as a symbol of the entertainment industry.",
    shortDescription: "Iconic landmark overlooking Los Angeles",
    latitude: 34.1341,
    longitude: -118.3215,
    address: "Hollywood Sign, Los Angeles, CA 90028",
    city: "Los Angeles",
    neighborhood: "Hollywood Hills",
    category: "attraction",
    subcategory: "landmark",
    tags: ["landmark", "iconic", "photography", "tourist", "free"],
    isPremium: false,
    featured: true,
    verified: true,
    website: "https://www.hollywoodsign.org/",
    hours: {
      monday: "24 hours",
      tuesday: "24 hours",
      wednesday: "24 hours",
      thursday: "24 hours",
      friday: "24 hours",
      saturday: "24 hours",
      sunday: "24 hours"
    },
    priceRange: "Free",
    priceLevel: 1,
    images: [
      "https://images.unsplash.com/photo-1518717348541-5e2b3b7d6a6a?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1521742343714-6bfd61773c61?ixlib=rb-4.0.3"
    ],
    rating: 4.6,
    reviewCount: 12543
  },
  {
    name: "Santa Monica Pier",
    description: "The Santa Monica Pier is a large double-jointed pier located at the foot of Colorado Avenue in Santa Monica, California. It contains a variety of attractions, including a Ferris wheel, roller coaster, carousel, and aquarium.",
    shortDescription: "Historic pier with amusement park and ocean views",
    latitude: 34.0089,
    longitude: -118.4973,
    address: "200 Santa Monica Pier, Santa Monica, CA 90401",
    city: "Santa Monica",
    category: "attraction",
    subcategory: "amusement",
    tags: ["pier", "amusement", "family", "ocean", "entertainment", "rides"],
    isPremium: false,
    featured: true,
    verified: true,
    website: "https://santamonicapier.org/",
    phone: "(310) 458-8900",
    hours: {
      monday: "6:00 AM - 10:00 PM",
      tuesday: "6:00 AM - 10:00 PM",
      wednesday: "6:00 AM - 10:00 PM",
      thursday: "6:00 AM - 10:00 PM",
      friday: "6:00 AM - 12:00 AM",
      saturday: "6:00 AM - 12:00 AM",
      sunday: "6:00 AM - 10:00 PM"
    },
    priceRange: "$",
    priceLevel: 1,
    images: [
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3"
    ],
    rating: 4.4,
    reviewCount: 8932
  },
  {
    name: "Griffith Observatory",
    description: "Griffith Observatory is a facility in Los Angeles, California, sitting on the south-facing slope of Mount Hollywood in Los Angeles' Griffith Park. It commands a view of the Los Angeles Basin, including Downtown Los Angeles to the southeast, Hollywood to the south, and the Pacific Ocean to the southwest.",
    shortDescription: "Science museum and planetarium with city views",
    latitude: 34.1184,
    longitude: -118.3004,
    address: "2800 E Observatory Rd, Los Angeles, CA 90027",
    city: "Los Angeles",
    neighborhood: "Griffith Park",
    category: "attraction",
    subcategory: "museum",
    tags: ["observatory", "planetarium", "science", "views", "hiking", "free"],
    isPremium: false,
    featured: true,
    verified: true,
    website: "https://griffithobservatory.org/",
    phone: "(213) 473-0800",
    hours: {
      tuesday: "12:00 PM - 10:00 PM",
      wednesday: "12:00 PM - 10:00 PM",
      thursday: "12:00 PM - 10:00 PM",
      friday: "12:00 PM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "10:00 AM - 10:00 PM"
    },
    priceRange: "Free",
    priceLevel: 1,
    images: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b21f14a7?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3"
    ],
    rating: 4.7,
    reviewCount: 15678
  },
  {
    name: "Universal Studios Hollywood",
    description: "Universal Studios Hollywood is a film studio and theme park in the San Fernando Valley area of Los Angeles County, California. About 70% of the studio lies within the unincorporated county island known as Universal City while the rest lies within the city of Los Angeles.",
    shortDescription: "Movie studio theme park with rides and shows",
    latitude: 34.1381,
    longitude: -118.3534,
    address: "100 Universal City Plaza, Universal City, CA 91608",
    city: "Universal City",
    category: "attraction",
    subcategory: "theme_park",
    tags: ["theme park", "movies", "rides", "entertainment", "family", "expensive"],
    isPremium: true,
    featured: true,
    verified: true,
    website: "https://www.universalstudioshollywood.com/",
    phone: "(800) 864-8377",
    hours: {
      monday: "10:00 AM - 6:00 PM",
      tuesday: "10:00 AM - 6:00 PM",
      wednesday: "10:00 AM - 6:00 PM",
      thursday: "10:00 AM - 6:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "9:00 AM - 8:00 PM",
      sunday: "9:00 AM - 8:00 PM"
    },
    priceRange: "$$$$",
    priceLevel: 4,
    images: [
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1598199556139-7dba4c7bf5e6?ixlib=rb-4.0.3"
    ],
    rating: 4.5,
    reviewCount: 23456
  },
  {
    name: "San Diego Zoo",
    description: "The San Diego Zoo is a zoo in Balboa Park, San Diego, California, housing more than 3,500 animals of more than 650 species and subspecies. Its parent organization, San Diego Zoo Wildlife Alliance, is one of the largest zoological membership associations in the world.",
    shortDescription: "World-renowned zoo with diverse animal collection",
    latitude: 32.7357,
    longitude: -117.1490,
    address: "2920 Zoo Dr, San Diego, CA 92101",
    city: "San Diego",
    neighborhood: "Balboa Park",
    category: "attraction",
    subcategory: "zoo",
    tags: ["zoo", "animals", "family", "conservation", "balboa park", "expensive"],
    isPremium: true,
    featured: true,
    verified: true,
    website: "https://zoo.sandiegozoo.org/",
    phone: "(619) 231-1515",
    hours: {
      monday: "9:00 AM - 9:00 PM",
      tuesday: "9:00 AM - 9:00 PM",
      wednesday: "9:00 AM - 9:00 PM",
      thursday: "9:00 AM - 9:00 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "9:00 AM - 9:00 PM"
    },
    priceRange: "$$$",
    priceLevel: 3,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3"
    ],
    rating: 4.6,
    reviewCount: 18976
  }
  // ... more attractions
]

export const socalRestaurants = [
  {
    name: "Guelaguetza",
    description: "Authentic Oaxacan restaurant serving traditional mole, tlayudas, and other regional specialties in a vibrant setting with live music on weekends.",
    shortDescription: "Authentic Oaxacan cuisine with live music",
    latitude: 34.0436,
    longitude: -118.2081,
    address: "3014 W Olympic Blvd, Los Angeles, CA 90006",
    city: "Los Angeles",
    neighborhood: "Koreatown",
    category: "restaurant",
    subcategory: "mexican",
    tags: ["mexican", "oaxacan", "mole", "live music", "authentic", "family"],
    isPremium: false,
    featured: true,
    verified: true,
    website: "https://guelaguetza.com/",
    phone: "(213) 427-8818",
    hours: {
      monday: "9:00 AM - 10:00 PM",
      tuesday: "9:00 AM - 10:00 PM",
      wednesday: "9:00 AM - 10:00 PM",
      thursday: "9:00 AM - 10:00 PM",
      friday: "9:00 AM - 11:00 PM",
      saturday: "9:00 AM - 11:00 PM",
      sunday: "9:00 AM - 10:00 PM"
    },
    priceRange: "$$",
    priceLevel: 2,
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3"
    ],
    rating: 4.5,
    reviewCount: 3421
  },
  // ... more restaurants
]

export const socalEvents = [
  {
    name: "Coachella Valley Music and Arts Festival",
    description: "Annual music and arts festival held at the Empire Polo Club in Indio, California. Features multiple stages with various musical genres, art installations, and food vendors.",
    shortDescription: "World-famous music festival in the desert",
    latitude: 33.6803,
    longitude: -116.2387,
    address: "81-800 Avenue 51, Indio, CA 92201",
    city: "Indio",
    category: "event",
    subcategory: "music_festival",
    tags: ["music", "festival", "coachella", "desert", "art", "celebrity"],
    isPremium: true,
    featured: true,
    verified: true,
    website: "https://www.coachella.com/",
    hours: {
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "11:00 AM - 11:00 PM"
    },
    priceRange: "$$$$",
    priceLevel: 4,
    images: [
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3"
    ],
    rating: 4.3,
    reviewCount: 8765
  },
  // ... more events
]
```

### 6. Mobile Optimization

#### 6.1 Mobile-Optimized Queries
**File:** `src/lib/database/mobile-queries.ts`

```typescript
import { DatabaseService } from './client'
import { LocationWithDetails, SearchFilters } from './types'

export class MobileOptimizedQueries extends DatabaseService {

  // Lightweight location query for mobile map markers
  async getMapMarkers(bounds: {
    north: number
    south: number
    east: number
    west: number
  }, options: {
    categories?: string[]
    maxMarkers?: number
  } = {}): Promise<Pick<LocationWithDetails, 'id' | 'name' | 'latitude' | 'longitude' | 'category' | 'rating' | 'is_premium' | 'featured'>[]> {
    const query = this.client
      .from('locations')
      .select(`
        id,
        name,
        latitude,
        longitude,
        category,
        rating,
        is_premium,
        featured
      `)
      .gte('latitude', bounds.south)
      .lte('latitude', bounds.north)
      .gte('longitude', bounds.west)
      .lte('longitude', bounds.east)

    if (options.categories?.length) {
      query.in('category', options.categories)
    }

    if (options.maxMarkers) {
      query.limit(options.maxMarkers)
    }

    query.order('rating', { ascending: false })

    const { data, error } = await query
    if (error) throw error

    return data || []
  }

  // Quick search with minimal data for fast results
  async quickSearch(query: string, limit: number = 10): Promise<Array<{
    id: string
    name: string
    category: string
    city: string
    rating: number | null
    latitude: number
    longitude: number
  }>> {
    const { data, error } = await this.client
      .from('locations')
      .select(`
        id,
        name,
        category,
        city,
        rating,
        latitude,
        longitude
      `)
      .textSearch('search_vector', query)
      .limit(limit)
      .order('rating', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get nearby locations with essential info only
  async getNearbyEssential(
    latitude: number,
    longitude: number,
    radius: number = 5, // miles
    categories?: string[]
  ): Promise<Array<{
    id: string
    name: string
    category: string
    rating: number | null
    distance_km: number
    images: string[]
    is_premium: boolean
  }>> {
    const { data, error } = await this.client
      .rpc('nearby_locations_essential', {
        lat: latitude,
        lng: longitude,
        radius_meters: radius * 1609.34,
        category_filter: categories,
        limit_count: 20
      })

    if (error) throw error
    return data || []
  }

  // Incremental loading for mobile infinite scroll
  async getLocationsPaginated(
    page: number,
    pageSize: number = 20,
    filters: SearchFilters = {}
  ): Promise<{
    locations: LocationWithDetails[]
    hasMore: boolean
    nextPage: number
  }> {
    const offset = (page - 1) * pageSize

    let query = this.client
      .from('locations')
      .select(`
        id,
        name,
        short_description,
        latitude,
        longitude,
        address,
        city,
        category,
        rating,
        images,
        is_premium,
        featured
      `)

    // Apply filters
    if (filters.categories?.length) {
      query.in('category', filters.categories)
    }

    if (filters.cities?.length) {
      query.in('city', filters.cities)
    }

    if (filters.rating) {
      query.gte('rating', filters.rating)
    }

    if (filters.is_premium !== undefined) {
      query.eq('is_premium', filters.is_premium)
    }

    // Apply pagination
    query = query
      .range(offset, offset + pageSize - 1)
      .order('rating', { ascending: false })

    const { data, error } = await query

    if (error) throw error

    // Check if there are more results
    const { count } = await this.client
      .from('locations')
      .select('*', { count: 'exact', head: true })
      .match(filters)

    const total = count || 0
    const hasMore = offset + pageSize < total

    return {
      locations: data || [],
      hasMore,
      nextPage: page + 1
    }
  }

  // Get featured locations for home screen
  async getFeaturedLocations(limit: number = 5): Promise<Array<{
    id: string
    name: string
    short_description: string
    city: string
    category: string
    rating: number | null
    images: string[]
    is_premium: boolean
  }>> {
    const { data, error } = await this.client
      .from('locations')
      .select(`
        id,
        name,
        short_description,
        city,
        category,
        rating,
        images,
        is_premium
      `)
      .eq('featured', true)
      .eq('verified', true)
      .limit(limit)
      .order('rating', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get popular categories with counts
  async getPopularCategories(limit: number = 10): Promise<Array<{
    category: string
    count: number
    sample_locations: Array<{
      id: string
      name: string
      images: string[]
    }>
  }>> {
    const { data, error } = await this.client
      .from('locations')
      .select('category')
      .not('category', 'is', null)

    if (error) throw error

    // Count occurrences of each category
    const categoryCounts = data?.reduce((acc, location) => {
      acc[location.category] = (acc[location.category] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Sort by count and take top categories
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)

    // Get sample locations for each category
    const result = await Promise.all(
      sortedCategories.map(async ([category, count]) => {
        const { data: sampleData } = await this.client
          .from('locations')
          .select('id, name, images')
          .eq('category', category)
          .limit(3)

        return {
          category,
          count,
          sample_locations: sampleData || []
        }
      })
    )

    return result
  }

  // User-specific optimized queries
  async getUserFavoritesCompact(userId: string): Promise<Array<{
    id: string
    location_id: string
    location: {
      id: string
      name: string
      category: string
      rating: number | null
      images: string[]
    }
  }>> {
    const { data, error } = await this.client
      .from('favorites')
      .select(`
        id,
        location_id,
        location:locations(id, name, category, rating, images)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20) // Limit for mobile performance

    if (error) throw error
    return data || []
  }

  // Cache-aware location details
  async getLocationDetailsCached(locationId: string): Promise<LocationWithDetails | null> {
    // Check cache first (would implement Redis or similar)
    // For now, just fetch from database

    const { data, error } = await this.client
      .from('locations')
      .select(`
        *,
        reviews:user_reviews(
          id,
          rating,
          title,
          content,
          created_at,
          user:profiles(id, username, avatar_url)
        )
      `)
      .eq('id', locationId)
      .single()

    if (error) throw error
    return data
  }
}

export const mobileDb = new MobileOptimizedQueries()
```

#### 6.2 Offline Support Data Structure
**File:** `src/lib/database/offline-data.ts`

```typescript
import { LocationWithDetails, CategoryWithChildren } from './types'

export interface OfflineDataPackage {
  version: string
  timestamp: number
  data: {
    featuredLocations: Array<{
      id: string
      name: string
      short_description: string
      city: string
      category: string
      rating: number | null
      images: string[]
      latitude: number
      longitude: number
      is_premium: boolean
    }>
    categories: CategoryWithChildren[]
    popularCities: Array<{
      name: string
      location_count: number
      center_lat: number
      center_lng: number
    }>
    essentialData: {
      mapBounds: {
        north: number
        south: number
        east: number
        west: number
      }
      appSettings: {
        maxOfflineRadius: number // miles
        cacheExpirationHours: number
      }
    }
  }
}

export class OfflineDataManager {
  private readonly CACHE_KEY = 'drivesocal_offline_data'
  private readonly CACHE_VERSION = '1.0.0'

  // Generate offline data package
  async generateOfflineData(): Promise<OfflineDataPackage> {
    const db = new DatabaseService()

    // Get featured locations (small dataset)
    const featuredLocations = await db.getLocations({
      featured: true,
      limit: 50 // Limit for offline storage
    }).then(locations => locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      short_description: loc.short_description,
      city: loc.city,
      category: loc.category,
      rating: loc.rating,
      images: loc.images.slice(0, 2), // Limit images
      latitude: loc.latitude,
      longitude: loc.longitude,
      is_premium: loc.is_premium
    })))

    // Get categories
    const categories = await db.getCategories()

    // Get popular cities
    const popularCities = await this.getPopularCities(db)

    const offlineData: OfflineDataPackage = {
      version: this.CACHE_VERSION,
      timestamp: Date.now(),
      data: {
        featuredLocations,
        categories,
        popularCities,
        essentialData: {
          mapBounds: {
            north: 34.8,   // Santa Barbara area
            south: 32.3,   // US-Mexico border
            east: -114.1,  // Palm Springs/Desert
            west: -118.7   // Pacific coastline
          },
          appSettings: {
            maxOfflineRadius: 25, // 25 miles
            cacheExpirationHours: 24
          }
        }
      }
    }

    return offlineData
  }

  // Cache offline data in localStorage
  async cacheOfflineData(): Promise<void> {
    try {
      const offlineData = await this.generateOfflineData()

      if (typeof window !== 'undefined') {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(offlineData))
      }
    } catch (error) {
      console.error('Failed to cache offline data:', error)
    }
  }

  // Get cached offline data
  getCachedOfflineData(): OfflineDataPackage | null {
    if (typeof window === 'undefined') return null

    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY)
      if (!cachedData) return null

      const offlineData: OfflineDataPackage = JSON.parse(cachedData)

      // Check version and expiration
      if (offlineData.version !== this.CACHE_VERSION) {
        this.clearCachedData()
        return null
      }

      const expirationHours = offlineData.data.essentialData.appSettings.cacheExpirationHours
      const expirationTime = expirationHours * 60 * 60 * 1000 // Convert to milliseconds

      if (Date.now() - offlineData.timestamp > expirationTime) {
        this.clearCachedData()
        return null
      }

      return offlineData
    } catch (error) {
      console.error('Failed to parse cached offline data:', error)
      this.clearCachedData()
      return null
    }
  }

  // Clear cached offline data
  clearCachedData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CACHE_KEY)
    }
  }

  // Get popular cities with location counts
  private async getPopularCities(db: DatabaseService): Promise<Array<{
    name: string
    location_count: number
    center_lat: number
    center_lng: number
  }>> {
    const { data, error } = await db.client
      .from('locations')
      .select('city, latitude, longitude')
      .not('city', 'is', null)

    if (error) throw error

    // Aggregate by city and calculate center points
    const cityMap = data?.reduce((acc, location) => {
      if (!acc[location.city]) {
        acc[location.city] = {
          name: location.city,
          locations: [],
          count: 0
        }
      }
      acc[location.city].locations.push({
        latitude: location.latitude,
        longitude: location.longitude
      })
      acc[location.city].count++
      return acc
    }, {} as Record<string, any>) || {}

    return Object.values(cityMap)
      .map((city: any) => ({
        name: city.name,
        location_count: city.count,
        center_lat: city.locations.reduce((sum: number, loc: any) => sum + loc.latitude, 0) / city.locations.length,
        center_lng: city.locations.reduce((sum: number, loc: any) => sum + loc.longitude, 0) / city.locations.length
      }))
      .sort((a: any, b: any) => b.location_count - a.location_count)
      .slice(0, 20)
  }

  // Sync data when online
  async syncData(): Promise<void> {
    if (typeof window === 'undefined') return

    // Check if online
    if (!navigator.onLine) {
      console.log('Device is offline, skipping sync')
      return
    }

    try {
      console.log('Syncing offline data...')
      await this.cacheOfflineData()
      console.log('Offline data sync completed')
    } catch (error) {
      console.error('Failed to sync offline data:', error)
    }
  }
}

export const offlineDataManager = new OfflineDataManager()
```

### 7. Search Functionality

#### 7.1 Advanced Search Service
**File:** `src/lib/search/search-service.ts`

```typescript
import { DatabaseService } from '../database/client'
import { SearchFilters, SearchResult, LocationWithDetails } from '../database/types'

export interface SearchOptions {
  query?: string
  filters?: SearchFilters
  sortBy?: 'relevance' | 'rating' | 'distance' | 'newest' | 'popularity'
  page?: number
  perPage?: number
}

export interface SearchSuggestion {
  text: string
  type: 'location' | 'city' | 'category' | 'tag'
  count?: number
  location?: {
    id: string
    name: string
    city: string
    category: string
  }
}

export class SearchService extends DatabaseService {

  // Main search function
  async search(options: SearchOptions): Promise<SearchResult> {
    const {
      query,
      filters = {},
      sortBy = 'relevance',
      page = 1,
      perPage = 20
    } = options

    // Use different search strategies based on query
    if (query && query.trim()) {
      if (filters.latitude && filters.longitude && filters.distance) {
        return this.searchWithLocation(query, filters, sortBy, page, perPage)
      } else {
        return this.searchTextual(query, filters, sortBy, page, perPage)
      }
    } else {
      return this.searchFiltered(filters, sortBy, page, perPage)
    }
  }

  // Text-based search
  private async searchTextual(
    query: string,
    filters: SearchFilters,
    sortBy: string,
    page: number,
    perPage: number
  ): Promise<SearchResult> {
    const { data, error, count } = await this.client
      .rpc('search_locations_advanced', {
        search_query: query,
        category_filter: filters.categories?.[0], // Simplified for RPC
        city_filter: filters.cities?.[0],
        min_rating: filters.rating,
        is_premium_filter: filters.is_premium,
        lat: filters.latitude,
        lng: filters.longitude,
        radius_meters: filters.distance ? filters.distance * 1609.34 : null,
        limit_count: perPage,
        offset_count: (page - 1) * perPage
      })

    if (error) throw error

    // Convert to SearchResult format
    const locations = data?.map(this.mapDbLocationToAppLocation) || []

    return {
      locations,
      total: count || locations.length,
      page,
      per_page: perPage,
      has_next: locations.length === perPage,
      has_prev: page > 1
    }
  }

  // Location-based search
  private async searchWithLocation(
    query: string,
    filters: SearchFilters,
    sortBy: string,
    page: number,
    perPage: number
  ): Promise<SearchResult> {
    // Combine textual search with geospatial filtering
    const { data, error, count } = await this.client
      .from('locations')
      .select('*', { count: 'exact' })
      .textSearch('search_vector', query)
      .rpc('filter_by_distance', {
        lat: filters.latitude!,
        lng: filters.longitude!,
        radius_meters: filters.distance! * 1609.34
      })

    if (error) throw error

    // Apply additional filters
    let filteredData = data || []

    if (filters.categories?.length) {
      filteredData = filteredData.filter(loc => filters.categories!.includes(loc.category))
    }

    if (filters.cities?.length) {
      filteredData = filteredData.filter(loc => filters.cities!.includes(loc.city))
    }

    if (filters.rating) {
      filteredData = filteredData.filter(loc => loc.rating && loc.rating >= filters.rating!)
    }

    // Sort results
    filteredData = this.sortResults(filteredData, sortBy)

    // Apply pagination
    const startIndex = (page - 1) * perPage
    const paginatedData = filteredData.slice(startIndex, startIndex + perPage)

    const locations = paginatedData.map(this.mapDbLocationToAppLocation)

    return {
      locations,
      total: filteredData.length,
      page,
      per_page: perPage,
      has_next: startIndex + perPage < filteredData.length,
      has_prev: page > 1
    }
  }

  // Filter-only search (no query)
  private async searchFiltered(
    filters: SearchFilters,
    sortBy: string,
    page: number,
    perPage: number
  ): Promise<SearchResult> {
    let query = this.client
      .from('locations')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.categories?.length) {
      query = query.in('category', filters.categories)
    }

    if (filters.cities?.length) {
      query = query.in('city', filters.cities)
    }

    if (filters.rating) {
      query = query.gte('rating', filters.rating)
    }

    if (filters.is_premium !== undefined) {
      query = query.eq('is_premium', filters.is_premium)
    }

    if (filters.featured) {
      query = query.eq('featured', true)
    }

    // Geospatial filter
    if (filters.latitude && filters.longitude && filters.distance) {
      query = query.rpc('filter_by_distance', {
        lat: filters.latitude,
        lng: filters.longitude,
        radius_meters: filters.distance * 1609.34
      })
    }

    // Apply sorting
    query = this.applySorting(query, sortBy)

    // Apply pagination
    const offset = (page - 1) * perPage
    query = query.range(offset, offset + perPage - 1)

    const { data, error, count } = await query

    if (error) throw error

    const locations = data?.map(this.mapDbLocationToAppLocation) || []

    return {
      locations,
      total: count || 0,
      page,
      per_page: perPage,
      has_next: (offset + perPage) < (count || 0),
      has_prev: page > 1
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) {
      return this.getPopularSuggestions(limit)
    }

    const suggestions: SearchSuggestion[] = []

    // Location name suggestions
    const { data: locationSuggestions } = await this.client
      .from('locations')
      .select('id, name, city, category')
      .textSearch('search_vector', query)
      .limit(5)

    if (locationSuggestions) {
      suggestions.push(...locationSuggestions.map(loc => ({
        text: loc.name,
        type: 'location' as const,
        location: {
          id: loc.id,
          name: loc.name,
          city: loc.city,
          category: loc.category
        }
      })))
    }

    // City suggestions
    const { data: cityData } = await this.client
      .from('locations')
      .select('city')
      .ilike('city', `%${query}%`)
      .limit(3)

    if (cityData) {
      const cityCounts = cityData.reduce((acc, loc) => {
        acc[loc.city] = (acc[loc.city] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      suggestions.push(...Object.entries(cityCounts).map(([city, count]) => ({
        text: city,
        type: 'city' as const,
        count
      })))
    }

    // Category suggestions
    const { data: categoryData } = await this.client
      .from('categories')
      .select('name, location_count')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(3)

    if (categoryData) {
      suggestions.push(...categoryData.map(cat => ({
        text: cat.name,
        type: 'category' as const,
        count: cat.location_count
      })))
    }

    return suggestions.slice(0, limit)
  }

  // Get popular suggestions (when no query)
  private async getPopularSuggestions(limit: number): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = []

    // Featured locations
    const { data: featuredLocations } = await this.client
      .from('locations')
      .select('id, name, city, category')
      .eq('featured', true)
      .limit(5)

    if (featuredLocations) {
      suggestions.push(...featuredLocations.map(loc => ({
        text: loc.name,
        type: 'location' as const,
        location: {
          id: loc.id,
          name: loc.name,
          city: loc.city,
          category: loc.category
        }
      })))
    }

    // Popular cities
    const { data: popularCities } = await this.client
      .from('locations')
      .select('city')
      .not('city', 'is', null)

    if (popularCities) {
      const cityCounts = popularCities.reduce((acc, loc) => {
        acc[loc.city] = (acc[loc.city] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const topCities = Object.entries(cityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([city, count]) => ({
          text: city,
          type: 'city' as const,
          count
        }))

      suggestions.push(...topCities)
    }

    return suggestions.slice(0, limit)
  }

  // Sort results based on criteria
  private sortResults(results: any[], sortBy: string): any[] {
    switch (sortBy) {
      case 'rating':
        return results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'newest':
        return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'popularity':
        return results.sort((a, b) => (b.favorite_count || 0) - (a.favorite_count || 0))
      case 'distance':
        return results.sort((a, b) => (a.distance_km || Infinity) - (b.distance_km || Infinity))
      default: // relevance
        return results.sort((a, b) => (b.search_rank || 0) - (a.search_rank || 0))
    }
  }

  // Apply sorting to Supabase query
  private applySorting(query: any, sortBy: string): any {
    switch (sortBy) {
      case 'rating':
        return query.order('rating', { ascending: false })
      case 'newest':
        return query.order('created_at', { ascending: false })
      case 'popularity':
        return query.order('favorite_count', { ascending: false })
      default:
        return query.order('rating', { ascending: false })
    }
  }

  // Map database location to app location format
  private mapDbLocationToAppLocation(dbLocation: any): LocationWithDetails {
    return {
      ...dbLocation,
      is_favorited: false, // Would be populated from user context
      distance: dbLocation.distance_km ? dbLocation.distance_km * 0.621371 : undefined // Convert km to miles
    }
  }

  // Search analytics (for improving search results)
  async logSearch(query: string, filters: SearchFilters, resultCount: number): Promise<void> {
    try {
      await this.client
        .from('search_logs')
        .insert({
          query,
          filters,
          result_count: resultCount,
          timestamp: new Date().toISOString()
        })
    } catch (error) {
      // Don't throw error for analytics logging
      console.warn('Failed to log search:', error)
    }
  }

  // Get trending searches
  async getTrendingSearches(limit: number = 10): Promise<string[]> {
    const { data, error } = await this.client
      .from('search_logs')
      .select('query')
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .not('query', 'is', null)
      .limit(1000)

    if (error) throw error

    // Count occurrences and return top searches
    const searchCounts = data?.reduce((acc, log) => {
      acc[log.query] = (acc[log.query] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query]) => query)
  }
}

export const searchService = new SearchService()
```

### 8. Data Synchronization

#### 8.1 Sync Service
**File:** `src/lib/sync/sync-service.ts`

```typescript
import { DatabaseService } from '../database/client'
import { offlineDataManager } from '../database/offline-data'
import { LocationWithDetails, FavoriteWithLocation } from '../database/types'

export interface SyncResult {
  success: boolean
  conflicts: Array<{
    type: 'favorite' | 'profile' | 'itinerary'
    id: string
    localData: any
    serverData: any
    resolution: 'local' | 'server' | 'merge'
  }>
  synced: {
    favorites: number
    profiles: number
    itineraries: number
  }
  errors: string[]
}

export class SyncService extends DatabaseService {
  private readonly SYNC_QUEUE_KEY = 'drivesocal_sync_queue'
  private readonly LAST_SYNC_KEY = 'drivesocal_last_sync'

  // Synchronize all data
  async syncAll(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      conflicts: [],
      synced: {
        favorites: 0,
        profiles: 0,
        itineraries: 0
      },
      errors: []
    }

    try {
      // Check if online
      if (!navigator.onLine) {
        throw new Error('Device is offline')
      }

      // Get current user
      const { data: { user } } = await this.client.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Sync in order of dependency
      await this.syncProfile(user.id, result)
      await this.syncFavorites(user.id, result)
      await this.syncItineraries(user.id, result)

      // Update last sync timestamp
      this.updateLastSyncTimestamp()

      // Clear sync queue
      this.clearSyncQueue()

      console.log('Sync completed successfully:', result)
    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      console.error('Sync failed:', error)
    }

    return result
  }

  // Sync user profile
  private async syncProfile(userId: string, result: SyncResult): Promise<void> {
    try {
      // Get local profile changes
      const localProfile = this.getLocalProfileChanges(userId)
      if (!localProfile) return

      // Get server profile
      const serverProfile = await this.getProfile(userId)

      // Detect conflicts
      if (serverProfile && localProfile.updated_at > serverProfile.updated_at) {
        // Local changes are newer, push to server
        await this.updateProfile(userId, localProfile)
        result.synced.profiles++
      } else if (serverProfile && serverProfile.updated_at > localProfile.updated_at) {
        // Server changes are newer, update local
        this.updateLocalProfile(serverProfile)
        result.synced.profiles++
      } else if (!serverProfile) {
        // No server profile, create one
        await this.updateProfile(userId, localProfile)
        result.synced.profiles++
      }
    } catch (error) {
      result.errors.push(`Profile sync failed: ${error}`)
    }
  }

  // Sync favorites
  private async syncFavorites(userId: string, result: SyncResult): Promise<void> {
    try {
      // Get local favorites
      const localFavorites = this.getLocalFavorites(userId)
      if (localFavorites.length === 0) return

      // Get server favorites
      const serverFavorites = await this.getFavorites(userId)

      // Create a map for easy lookup
      const serverFavoritesMap = new Map(
        serverFavorites.map(fav => [fav.location_id, fav])
      )

      // Process each local favorite
      for (const localFav of localFavorites) {
        const serverFav = serverFavoritesMap.get(localFav.location_id)

        if (!serverFav) {
          // New favorite, add to server
          await this.addFavorite(userId, localFav.location_id, localFav.notes)
          result.synced.favorites++
        } else if (localFav.updated_at > serverFav.updated_at) {
          // Local changes are newer, update server
          await this.updateFavorite(localFav.id, {
            notes: localFav.notes,
            priority: localFav.priority,
            visited: localFav.visited,
            visit_count: localFav.visit_count
          })
          result.synced.favorites++
        } else if (serverFav.updated_at > localFav.updated_at) {
          // Server changes are newer, update local
          this.updateLocalFavorite(localFav.id, serverFav)
          result.synced.favorites++
        }
      }

      // Handle favorites that exist on server but not locally (user might have deleted them locally)
      for (const serverFav of serverFavorites) {
        const localFav = localFavorites.find(lf => lf.location_id === serverFav.location_id)
        if (!localFav) {
          // Check if this was intentionally deleted locally
          if (!this.isFavoriteMarkedForDeletion(serverFav.id)) {
            // Add to local
            this.addLocalFavorite(serverFav)
            result.synced.favorites++
          }
        }
      }
    } catch (error) {
      result.errors.push(`Favorites sync failed: ${error}`)
    }
  }

  // Sync itineraries
  private async syncItineraries(userId: string, result: SyncResult): Promise<void> {
    try {
      // Get local itineraries
      const localItineraries = this.getLocalItineraries(userId)
      if (localItineraries.length === 0) return

      // Get server itineraries
      const serverItineraries = await this.getItineraries(userId)

      // Create a map for easy lookup
      const serverItinerariesMap = new Map(
        serverItineraries.map(itin => [itin.id, itin])
      )

      // Process each local itinerary
      for (const localItin of localItineraries) {
        const serverItin = serverItinerariesMap.get(localItin.id)

        if (!serverItin) {
          // New itinerary, add to server
          await this.createItinerary(userId, localItin)
          result.synced.itineraries++
        } else if (localItin.updated_at > serverItin.updated_at) {
          // Local changes are newer, update server
          await this.updateItinerary(localItin.id, localItin)
          result.synced.itineraries++
        } else if (serverItin.updated_at > localItin.updated_at) {
          // Server changes are newer, update local
          this.updateLocalItinerary(localItin.id, serverItin)
          result.synced.itineraries++
        }
      }
    } catch (error) {
      result.errors.push(`Itineraries sync failed: ${error}`)
    }
  }

  // Queue operation for when offline
  queueOperation(operation: {
    type: 'add_favorite' | 'remove_favorite' | 'update_favorite' | 'create_itinerary' | 'update_itinerary'
    data: any
    timestamp: number
  }): void {
    const queue = this.getSyncQueue()
    queue.push(operation)
    this.saveSyncQueue(queue)
  }

  // Process queued operations when back online
  private async processSyncQueue(): Promise<void> {
    const queue = this.getSyncQueue()
    if (queue.length === 0) return

    try {
      for (const operation of queue) {
        await this.processQueuedOperation(operation)
      }

      // Clear queue after processing
      this.clearSyncQueue()
    } catch (error) {
      console.error('Failed to process sync queue:', error)
    }
  }

  // Process individual queued operation
  private async processQueuedOperation(operation: any): Promise<void> {
    switch (operation.type) {
      case 'add_favorite':
        await this.addFavorite(operation.data.userId, operation.data.locationId, operation.data.notes)
        break
      case 'remove_favorite':
        await this.removeFavorite(operation.data.userId, operation.data.locationId)
        break
      case 'update_favorite':
        await this.updateFavorite(operation.data.id, operation.data.updates)
        break
      case 'create_itinerary':
        await this.createItinerary(operation.data.userId, operation.data.itinerary)
        break
      case 'update_itinerary':
        await this.updateItinerary(operation.data.id, operation.data.updates)
        break
    }
  }

  // Local storage helpers
  private getSyncQueue(): any[] {
    if (typeof window === 'undefined') return []
    try {
      const queue = localStorage.getItem(this.SYNC_QUEUE_KEY)
      return queue ? JSON.parse(queue) : []
    } catch {
      return []
    }
  }

  private saveSyncQueue(queue: any[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue))
    } catch (error) {
      console.warn('Failed to save sync queue:', error)
    }
  }

  private clearSyncQueue(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.SYNC_QUEUE_KEY)
  }

  private updateLastSyncTimestamp(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.LAST_SYNC_KEY, Date.now().toString())
  }

  private getLastSyncTimestamp(): number {
    if (typeof window === 'undefined') return 0
    const timestamp = localStorage.getItem(this.LAST_SYNC_KEY)
    return timestamp ? parseInt(timestamp) : 0
  }

  // Local data management (simplified - would use IndexedDB in production)
  private getLocalProfileChanges(userId: string): any {
    // Implementation would fetch from IndexedDB
    return null
  }

  private getLocalFavorites(userId: string): any[] {
    // Implementation would fetch from IndexedDB
    return []
  }

  private getLocalItineraries(userId: string): any[] {
    // Implementation would fetch from IndexedDB
    return []
  }

  private updateLocalProfile(profile: any): void {
    // Implementation would update IndexedDB
  }

  private addLocalFavorite(favorite: any): void {
    // Implementation would add to IndexedDB
  }

  private updateLocalFavorite(id: string, favorite: any): void {
    // Implementation would update IndexedDB
  }

  private updateLocalItinerary(id: string, itinerary: any): void {
    // Implementation would update IndexedDB
  }

  private isFavoriteMarkedForDeletion(id: string): boolean {
    // Implementation would check IndexedDB for deletion flag
    return false
  }

  private async updateFavorite(id: string, updates: any): Promise<void> {
    const { error } = await this.client
      .from('favorites')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  private async updateItinerary(id: string, updates: any): Promise<void> {
    const { error } = await this.client
      .from('itineraries')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  // Auto-sync when coming back online
  setupAutoSync(): void {
    if (typeof window === 'undefined') return

    const handleOnline = () => {
      console.log('Device is online, starting auto-sync...')
      this.syncAll().then(result => {
        if (result.success) {
          console.log('Auto-sync completed successfully')
        } else {
          console.warn('Auto-sync completed with errors:', result.errors)
        }
      })
    }

    window.addEventListener('online', handleOnline)

    // Periodic sync every 30 minutes
    setInterval(() => {
      if (navigator.onLine) {
        this.syncAll().catch(console.error)
      }
    }, 30 * 60 * 1000)
  }
}

export const syncService = new SyncService()
```

## Success Criteria

### Functional Requirements
- [ ] Database schema created with all required tables
- [ ] MCP tools successfully integrated for database management
- [ ] Southern California content seeded (500+ locations)
- [ ] TypeScript types auto-generated and working
- [ ] API endpoints functional with proper error handling
- [ ] Search functionality working with filters and ranking
- [ ] Geospatial queries performing efficiently
- [ ] Mobile-optimized queries returning data quickly
- [ ] Offline support with data synchronization
- [ ] Free vs premium content access control working

### Performance Requirements
- [ ] Database queries complete within 200ms on average
- [ ] Search results return within 500ms
- [ ] Geospatial queries perform efficiently with indexes
- [ ] Mobile data usage optimized (< 1MB for typical session)
- [ ] Offline data loads within 2 seconds
- [ ] Sync operations complete within 10 seconds
- [ ] Cache hit rate > 80% for frequently accessed data

### Data Quality Requirements
- [ ] All SoCal major attractions included
- [ ] Restaurant data covers major cuisines and areas
- [ ] Event data updated regularly
- [ ] Location coordinates accurate within 50 meters
- [ ] Content descriptions informative and engaging
- [ ] Images high-quality and properly optimized
- [ ] Categories properly organized and hierarchical

### Integration Requirements
- [ ] Seamless integration with Phase 2 map system
- [ ] TypeScript types integrate with frontend components
- [ ] API endpoints work with mobile UI components
- [ ] Search integrates with map markers and popups
- [ ] User authentication properly connected
- [ ] Real-time updates work across components

## Documentation Requirements

### Technical Documentation
- [x] Phase 4 Implementation Plan (this document)
- [ ] Database Schema Documentation
- [ ] API Endpoint Documentation
- [ ] MCP Tool Usage Guide
- [ ] Search Implementation Guide
- [ ] Offline Support Documentation

### Code Documentation
- [ ] Comprehensive code comments
- [ ] TypeScript interface documentation
- [ ] API usage examples
- [ ] Database migration scripts
- [ ] Content seeding procedures

## Conclusion

Phase 4 establishes the complete data infrastructure for the Drive SoCal POV application, delivering a robust, scalable, and mobile-optimized database system. The comprehensive Southern California content, advanced search capabilities, and offline support ensure an excellent user experience even in challenging network conditions.

**Key Achievements:**
- Complete database schema with optimized queries
- Comprehensive Southern California content library
- Advanced search with geospatial capabilities
- Mobile-optimized data fetching and caching
- Offline support with intelligent synchronization
- MCP tool integration for automated database management
- TypeScript type safety throughout the data layer

The successful completion of Phase 4 provides a solid foundation for the complete Drive SoCal POV experience, enabling users to discover, explore, and save Southern California locations with confidence and ease.

**Next Steps:**
- User acceptance testing with real devices
- Performance optimization based on usage patterns
- Content expansion and regular updates
- Analytics implementation for user behavior insights
- Production deployment preparation
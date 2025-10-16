/**
 * TypeScript Type Definitions for Drive SoCal POV
 * Generated from Supabase database schema
 */

import { Database } from '@/types/supabase'

// Re-export Database type for Supabase client
export type { Database } from '@/types/supabase'

// =====================================================
// BASIC TYPE DEFINITIONS
// =====================================================

export type Geography = {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export type OperatingHours = {
  monday?: { open: string; close: string; closed?: boolean }
  tuesday?: { open: string; close: string; closed?: boolean }
  wednesday?: { open: string; close: string; closed?: boolean }
  thursday?: { open: string; close: string; closed?: boolean }
  friday?: { open: string; close: string; closed?: boolean }
  saturday?: { open: string; close: string; closed?: boolean }
  sunday?: { open: string; close: string; closed?: boolean }
}

export type UserPreferences = {
  notifications?: {
    new_locations?: boolean
    recommendations?: boolean
    newsletter?: boolean
  }
  map?: {
    default_zoom?: number
    map_style?: 'street' | 'satellite' | 'terrain'
    show_traffic?: boolean
  }
  privacy?: {
    profile_public?: boolean
    check_ins_public?: boolean
    itineraries_public?: boolean
  }
}

// =====================================================
// DATABASE TYPES
// =====================================================

export type Category = Database['public']['Tables']['categories']['Row']
export type Subcategory = Database['public']['Tables']['subcategories']['Row']
export type Neighborhood = Database['public']['Tables']['neighborhoods']['Row']
export type Location = Database['public']['Tables']['locations']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
export type Itinerary = Database['public']['Tables']['itineraries']['Row']
export type ItineraryLocation = Database['public']['Tables']['itinerary_locations']['Row']
export type CheckIn = Database['public']['Tables']['check_ins']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Collection = Database['public']['Tables']['collections']['Row']
export type CollectionLocation = Database['public']['Tables']['collection_locations']['Row']
export type LocationAnalytics = Database['public']['Tables']['location_analytics']['Row']

// =====================================================
// INSERT/UPDATE TYPES
// =====================================================

export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type SubcategoryInsert = Database['public']['Tables']['subcategories']['Insert']
export type NeighborhoodInsert = Database['public']['Tables']['neighborhoods']['Insert']
export type LocationInsert = Database['public']['Tables']['locations']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert']
export type ItineraryInsert = Database['public']['Tables']['itineraries']['Insert']
export type ItineraryLocationInsert = Database['public']['Tables']['itinerary_locations']['Insert']
export type CheckInInsert = Database['public']['Tables']['check_ins']['Insert']
export type AchievementInsert = Database['public']['Tables']['achievements']['Insert']
export type UserAchievementInsert = Database['public']['Tables']['user_achievements']['Insert']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type CollectionInsert = Database['public']['Tables']['collections']['Insert']
export type CollectionLocationInsert = Database['public']['Tables']['collection_locations']['Insert']

export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type SubcategoryUpdate = Database['public']['Tables']['subcategories']['Update']
export type NeighborhoodUpdate = Database['public']['Tables']['neighborhoods']['Update']
export type LocationUpdate = Database['public']['Tables']['locations']['Update']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']
export type ItineraryUpdate = Database['public']['Tables']['itineraries']['Update']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

// =====================================================
// EXTENDED TYPES WITH RELATIONS
// =====================================================

export interface LocationWithRelations extends Omit<Location, 'bookmark_count'> {
  category?: Category
  subcategory?: Subcategory
  neighborhood?: Neighborhood
  reviews?: Review[]
  bookmark_count?: number
  is_bookmarked_by_user?: boolean
}

export interface ItineraryWithLocations extends Itinerary {
  locations?: (ItineraryLocation & { location: LocationWithRelations })[]
  location_count?: number
}

export interface CollectionWithLocations extends Collection {
  locations?: (CollectionLocation & { location: LocationWithRelations })[]
  location_count?: number
}

export interface UserProfileWithStats extends UserProfile {
  check_ins_count?: number
  reviews_count?: number
  bookmarks_count?: number
  itineraries_count?: number
  achievements_earned?: UserAchievement[]
}

export interface NeighborhoodWithLocations extends Neighborhood {
  location_count?: number
  featured_locations?: LocationWithRelations[]
}

// =====================================================
// MAP AND GEOGRAPHY TYPES
// =====================================================

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapViewport {
  latitude: number
  longitude: number
  zoom: number
  bearing?: number
  pitch?: number
}

export interface ClusterPoint {
  id: string
  longitude: number
  latitude: number
  cluster: boolean
  point_count?: number
  point_count_abbreviated?: string
  properties?: Record<string, unknown>
}

export interface MapMarker {
  id: string
  type: 'location' | 'cluster' | 'user' | 'itinerary'
  coordinates: [number, number]
  data: LocationWithRelations | ClusterPoint
}

// =====================================================
// SEARCH AND FILTERING TYPES
// =====================================================

export interface SearchFilters {
  query?: string
  categories?: string[]
  subcategories?: string[]
  neighborhoods?: string[]
  cities?: string[]
  regions?: ('San Diego' | 'Los Angeles' | 'Inland Empire')[]
  price_level?: number[]
  is_free?: boolean
  is_premium?: boolean
  rating?: number
  tags?: string[]
  amenities?: string[]
  bounds?: MapBounds
  has_reviews?: boolean
  featured_only?: boolean
}

export interface SortOptions {
  field: 'name' | 'rating' | 'created_at' | 'updated_at' | 'visit_count' | 'bookmark_count'
  direction: 'asc' | 'desc'
}

export interface SearchParams {
  filters?: SearchFilters
  sort?: SortOptions
  limit?: number
  offset?: number
}

export interface SearchResult {
  locations: LocationWithRelations[]
  total: number
  has_more: boolean
}

// =====================================================
// MOBILE APP SPECIFIC TYPES
// =====================================================

export interface QuickAction {
  id: string
  title: string
  icon: string
  action: 'bookmark' | 'check_in' | 'share' | 'directions' | 'call' | 'website'
  location_id: string
}

export interface MapInteraction {
  type: 'tap' | 'long_press' | 'pinch_zoom' | 'pan'
  coordinates: [number, number]
  timestamp: number
}

export interface OfflineSyncData {
  locations: Location[]
  user_bookmarks: string[]
  user_itineraries: ItineraryWithLocations[]
  last_sync: string
  pending_actions: OfflineAction[]
}

export interface OfflineAction {
  type: 'bookmark' | 'check_in' | 'review' | 'itinerary_update'
  data: Record<string, unknown>
  timestamp: number
  location_id?: string
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = unknown> {
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

export interface LocationListResponse extends PaginatedResponse<LocationWithRelations> {
  categories?: Category[]
  neighborhoods?: Neighborhood[]
  featured_locations?: LocationWithRelations[]
}

// =====================================================
// GAMIFICATION TYPES
// =====================================================

export interface AchievementProgress {
  achievement: Achievement
  current_progress: number
  required_progress: number
  is_completed: boolean
  earned_at?: string
}

export interface UserStats {
  total_points: number
  locations_visited: number
  reviews_written: number
  bookmarks_created: number
  itineraries_created: number
  achievements_earned: number
  current_level: number
  points_to_next_level: number
}

export interface StreakInfo {
  current_streak: number
  longest_streak: number
  last_check_in_date?: string
}

// =====================================================
// CONTENT MANAGEMENT TYPES
// =====================================================

export interface ContentEditor {
  mode: 'create' | 'edit'
  content_type: 'location' | 'collection' | 'itinerary'
  initial_data?: Record<string, unknown>
  is_dirty: boolean
  validation_errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface MediaUpload {
  file: File
  url?: string
  is_uploading: boolean
  progress?: number
  error?: string
}

// =====================================================
// ANALYTICS AND METRICS TYPES
// =====================================================

export interface LocationMetrics {
  location_id: string
  views: number
  clicks: number
  bookmark_additions: number
  check_ins: number
  date_range: {
    start: string
    end: string
  }
}

export interface UserAnalytics {
  user_id: string
  session_duration: number
  locations_viewed: number
  interactions: number
  conversions: number
  device_type: 'mobile' | 'tablet' | 'desktop'
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'number' | 'date' | 'time'
  required?: boolean
  placeholder?: string
  options?: SelectOption[]
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'tel' | 'min' | 'max' | 'pattern' | 'custom'
  value?: unknown
  message: string
}

// =====================================================
// CONTEXT AND STATE TYPES
// =====================================================

export interface AppState {
  user: {
    profile: UserProfile | null
    is_authenticated: boolean
    is_loading: boolean
  }
  map: {
    viewport: MapViewport
    selected_location: LocationWithRelations | null
    filtered_locations: LocationWithRelations[]
    is_loading: boolean
    error: string | null
  }
  ui: {
    sidebar_open: boolean
    mobile_menu_open: boolean
    search_open: boolean
    theme: 'light' | 'dark' | 'auto'
    offline_mode: boolean
  }
  data: {
    categories: Category[]
    neighborhoods: Neighborhood[]
    collections: CollectionWithLocations[]
    user_bookmarks: string[]
    user_itineraries: ItineraryWithLocations[]
    last_sync: string | null
  }
}

// =====================================================
// CONSTANTS AND ENUMS
// =====================================================

export const REGIONS = ['San Diego', 'Los Angeles', 'Inland Empire'] as const
export type Region = typeof REGIONS[number]

export const PRICE_LEVELS = {
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$'
} as const

export const BADGE_TYPES = {
  LOCATIONS_VISITED: 'locations_visited',
  CATEGORY_MASTER: 'category_master',
  NEIGHBORHOOD_EXPLORER: 'neighborhood_explorer',
  REVIEWER: 'reviewer',
  PLANNER: 'planner'
} as const

export const MAP_STYLES = {
  STREET: 'street',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain'
} as const

export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
} as const

// =====================================================
// TYPE GUARDS AND VALIDATORS
// =====================================================

export function isValidRegion(region: string): region is Region {
  return REGIONS.includes(region as Region)
}

export function isValidPriceLevel(level: number): level is 1 | 2 | 3 | 4 {
  return level >= 1 && level <= 4 && Number.isInteger(level)
}

export function isValidGeography(obj: any): obj is Geography {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.type === 'Point' &&
    Array.isArray(obj.coordinates) &&
    obj.coordinates.length === 2 &&
    obj.coordinates.every((coord: any) => typeof coord === 'number')
  )
}

export function isLocationWithRelations(obj: any): obj is LocationWithRelations {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.coordinates === 'object'
  )
}
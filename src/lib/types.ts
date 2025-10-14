/**
 * Core types for Drive SoCal POV application
 * Basic location and category types used across the application
 */

// Base location type
export interface Location {
  id: string
  name: string
  description?: string
  category: LocationCategory
  coordinates: [number, number] // [longitude, latitude]
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  priceLevel?: number // 1-4 scale
  photos?: string[]
  hours?: {
    [key: string]: string
  }
  tags?: string[]
  isActive: boolean
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

// Location categories
export type LocationCategory =
  | 'restaurant'
  | 'attraction'
  | 'hotel'
  | 'shopping'
  | 'entertainment'
  | 'nightlife'
  | 'outdoor'
  | 'culture'
  | 'sports'
  | 'transport'
  | 'other'

// Location status
export type LocationStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'closed'

// Search filters
export interface LocationFilter {
  category?: LocationCategory
  priceLevel?: number[]
  rating?: number
  distance?: number
  openNow?: boolean
  tags?: string[]
}

// Sort options
export type SortOption =
  | 'name'
  | 'rating'
  | 'distance'
  | 'price'
  | 'popularity'
  | 'newest'

// API response types
export interface LocationResponse {
  locations: Location[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// User preferences
export interface UserPreferences {
  favoriteCategories: LocationCategory[]
  priceRange: [number, number]
  preferredDistance: number
  savedLocations: string[]
  searchHistory: string[]
}


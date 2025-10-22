/**
 * Location Store - Zustand store for location data management
 * Integrates with navigation and map state for coordinated updates
 * Mobile-optimized with performance monitoring and caching
 */

import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { LocationWithCategories } from '@/lib/services/location-service'
import type { Region, Category } from '@/hooks/useNavigation'

// Location store state interface
interface LocationState {
  // Data state
  locations: LocationWithCategories[]
  selectedLocation: LocationWithCategories | null
  filteredLocations: LocationWithCategories[]

  // Filter state
  activeFilters: {
    region?: Region | 'All Regions'
    category?: Category | 'all'
    is_free?: boolean
    is_premium?: boolean
    search?: string
    price_level?: number[]
    rating?: number
  }

  // UI state
  loading: boolean
  error: string | null
  refreshing: boolean

  // Cache state
  lastFetch: number | null
  cacheExpiry: number

  // Actions
  setLocations: (locations: LocationWithCategories[]) => void
  setSelectedLocation: (location: LocationWithCategories | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setRefreshing: (refreshing: boolean) => void

  // Filter actions
  updateFilters: (filters: Partial<LocationState['activeFilters']>) => void
  setActiveFilters: (filters: Partial<LocationState['activeFilters']>) => void
  clearFilters: () => void
  applyFilters: () => void

  // Cache actions
  updateCache: () => void
  isCacheValid: () => boolean

  // Search actions
  searchLocations: (query: string) => void
  clearSearch: () => void

  // Selection actions
  selectLocationById: (id: string) => void
  clearSelection: () => void

  // Favorites actions (placeholder for future implementation)
  toggleFavorite: (locationId: string) => void
  isFavorite: (locationId: string) => boolean

  // Analytics actions
  recordLocationView: (locationId: string) => void
  getPopularLocations: (limit?: number) => LocationWithCategories[]
}

// Cache expiry configuration
const CACHE_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

export const useLocationStore = create<LocationState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      locations: [],
      selectedLocation: null,
      filteredLocations: [],
      activeFilters: {},
      loading: false,
      error: null,
      refreshing: false,
      lastFetch: null,
      cacheExpiry: CACHE_EXPIRY_MS,

      // Basic actions
      setLocations: (locations) => {
        set({ locations })
        get().applyFilters()
        get().updateCache()
      },

      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setRefreshing: (refreshing) => set({ refreshing }),

      // Filter actions
      updateFilters: (filters) => {
        const currentFilters = get().activeFilters
        const newFilters = { ...currentFilters, ...filters }
        set({ activeFilters: newFilters })
        get().applyFilters()
      },

      setActiveFilters: (filters) => {
        set({ activeFilters: filters })
        get().applyFilters()
      },

      clearFilters: () => {
        set({
          activeFilters: {},
          filteredLocations: get().locations
        })
      },

      applyFilters: () => {
        const { locations, activeFilters } = get()
        let filtered = [...locations]

        // Region filter
        if (activeFilters.region && activeFilters.region !== 'All Regions') {
          filtered = filtered.filter(loc => loc.region === activeFilters.region)
        }

        // Category filter
        if (activeFilters.category && activeFilters.category !== 'all') {
          filtered = filtered.filter(loc =>
            loc.category?.slug === activeFilters.category ||
            loc.subcategory?.slug === activeFilters.category
          )
        }

        // Free filter
        if (activeFilters.is_free !== undefined) {
          filtered = filtered.filter(loc => loc.is_free === activeFilters.is_free)
        }

        // Premium filter
        if (activeFilters.is_premium !== undefined) {
          filtered = filtered.filter(loc => loc.is_premium === activeFilters.is_premium)
        }

        // Search filter
        if (activeFilters.search) {
          const searchLower = activeFilters.search.toLowerCase()
          filtered = filtered.filter(loc =>
            loc.name.toLowerCase().includes(searchLower) ||
            loc.summary?.toLowerCase().includes(searchLower) ||
            loc.description?.toLowerCase().includes(searchLower) ||
            loc.city.toLowerCase().includes(searchLower)
          )
        }

        // Price level filter
        if (activeFilters.price_level && activeFilters.price_level.length > 0) {
          filtered = filtered.filter(loc =>
            loc.price_level && activeFilters.price_level!.includes(loc.price_level)
          )
        }

        // Rating filter
        if (activeFilters.rating !== undefined) {
          filtered = filtered.filter(loc =>
            loc.rating && loc.rating >= activeFilters.rating!
          )
        }

        set({ filteredLocations: filtered })
      },

      // Cache actions
      updateCache: () => {
        set({ lastFetch: Date.now() })
      },

      isCacheValid: () => {
        const { lastFetch, cacheExpiry } = get()
        if (!lastFetch) return false
        return Date.now() - lastFetch < cacheExpiry
      },

      // Search actions
      searchLocations: (query) => {
        const trimmedQuery = query.trim()
        if (trimmedQuery) {
          get().updateFilters({ search: trimmedQuery })
        } else {
          // Remove search filter if query is empty
          const { search, ...otherFilters } = get().activeFilters
          get().setActiveFilters(otherFilters)
        }
      },

      clearSearch: () => {
        const { activeFilters } = get()
        const { search, ...otherFilters } = activeFilters
        set({ activeFilters: otherFilters })
        get().applyFilters()
      },

      // Selection actions
      selectLocationById: (id) => {
        const { locations } = get()
        const location = locations.find(loc => loc.id === id)
        if (location) {
          get().setSelectedLocation(location)
          get().recordLocationView(id)
        }
      },

      clearSelection: () => {
        set({ selectedLocation: null })
      },

      // Favorites actions (placeholder)
      toggleFavorite: (_locationId) => {
        // TODO: Implement favorites functionality
        console.log('Toggle favorite for location')
      },

      isFavorite: (_locationId) => {
        // TODO: Implement favorites functionality
        return false
      },

      // Analytics actions
      recordLocationView: (locationId) => {
        // Store view analytics in localStorage for mobile performance
        try {
          const views = JSON.parse(localStorage.getItem('location_views') || '{}')
          views[locationId] = (views[locationId] || 0) + 1
          localStorage.setItem('location_views', JSON.stringify(views))
        } catch (error) {
          console.warn('Failed to record location view:', error)
        }
      },

      getPopularLocations: (limit = 10) => {
        const { locations } = get()

        try {
          const views = JSON.parse(localStorage.getItem('location_views') || '{}')

          return locations
            .map(location => ({
              ...location,
              viewCount: views[location.id] || 0
            }))
            .sort((a, b) => {
              // Sort by rating first, then by view count
              if ((b.rating || 0) !== (a.rating || 0)) {
                return (b.rating || 0) - (a.rating || 0)
              }
              return b.viewCount - a.viewCount
            })
            .slice(0, limit)
        } catch (error) {
          console.warn('Failed to get popular locations:', error)
          return locations
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit)
        }
      }
    })),
    {
      name: 'location-store',
    }
  )
)

// Selectors for optimized re-renders
export const useLocationData = () => useLocationStore((state) => ({
  locations: state.locations,
  filteredLocations: state.filteredLocations,
  count: state.filteredLocations.length,
  loading: state.loading,
  error: state.error,
  refreshing: state.refreshing
}))

export const useSelectedLocation = () => useLocationStore((state) => ({
  selectedLocation: state.selectedLocation,
  setSelectedLocation: state.setSelectedLocation,
  clearSelection: state.clearSelection
}))

export const useLocationFilters = () => useLocationStore((state) => ({
  activeFilters: state.activeFilters,
  updateFilters: state.updateFilters,
  clearFilters: state.clearFilters,
  applyFilters: state.applyFilters
}))

export const useLocationSearch = () => useLocationStore((state) => ({
  searchQuery: state.activeFilters.search || '',
  searchLocations: state.searchLocations,
  clearSearch: state.clearSearch
}))

export const useLocationFavorites = () => useLocationStore((state) => ({
  toggleFavorite: state.toggleFavorite,
  isFavorite: state.isFavorite
}))

export const usePopularLocations = (limit?: number) => useLocationStore((state) =>
  state.getPopularLocations(limit)
)

// Actions for complex operations
export const useLocationActions = () => useLocationStore((state) => ({
  // Refresh data
  refreshLocations: async () => {
    const store = useLocationStore.getState()
    store.setRefreshing(true)
    try {
      // TODO: Implement actual data refresh
      // await fetchLocations()
      store.setRefreshing(false)
    } catch (error) {
      store.setError('Failed to refresh locations')
      store.setRefreshing(false)
    }
  },

  // Navigate to location
  navigateToLocation: (locationId: string) => {
    const { locations } = state
    const location = locations.find(loc => loc.id === locationId)

    if (location) {
      // Select the location
      state.setSelectedLocation(location)
      state.recordLocationView(locationId)

      // Fly to location on map
      const map = (window as any).__debugMap
      if (map && location.coordinates) {
        // Extract coordinates from database format
        let coordinates: [number, number] | null = null

        if (location.coordinates) {
          if (typeof location.coordinates === 'object' && location.coordinates.coordinates) {
            coordinates = [
              parseFloat(location.coordinates.coordinates[0]),
              parseFloat(location.coordinates.coordinates[1])
            ]
          } else {
            const coordMatch = String(location.coordinates).match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/)
            if (coordMatch && coordMatch[1] && coordMatch[2]) {
              coordinates = [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]
            }
          }
        }

        if (coordinates) {
          map.flyTo({
            center: coordinates,
            zoom: 15,
            bearing: 0,
            pitch: 0,
            duration: 800,
            essential: true
          })
        }
      }
    }
  },

  // Filter by multiple criteria
  filterByMultipleCriteria: (criteria: {
    region?: Region | 'All Regions'
    categories?: Category[]
    priceLevels?: number[]
    isFree?: boolean
    isPremium?: boolean
    minRating?: number
    search?: string
  }) => {
    const filters: any = {}

    if (criteria.region) filters.region = criteria.region
    if (criteria.categories && criteria.categories.length > 0) {
      filters.category = criteria.categories[0] // TODO: Support multiple categories
    }
    if (criteria.priceLevels && criteria.priceLevels.length > 0) {
      filters.price_level = criteria.priceLevels
    }
    if (criteria.isFree !== undefined) filters.is_free = criteria.isFree
    if (criteria.isPremium !== undefined) filters.is_premium = criteria.isPremium
    if (criteria.minRating) filters.rating = criteria.minRating
    if (criteria.search) filters.search = criteria.search

    state.updateFilters(filters)
  },

  // Get locations by bounds
  getLocationsInBounds: (bounds: {
    north: number
    south: number
    east: number
    west: number
  }) => {
    const { filteredLocations } = state
    return filteredLocations.filter(location => {
      if (!location.coordinates) return false

      let coordinates: [number, number] | null = null

      if (typeof location.coordinates === 'object' && location.coordinates.coordinates) {
        coordinates = [
          parseFloat(location.coordinates.coordinates[0]),
          parseFloat(location.coordinates.coordinates[1])
        ]
      } else {
        const coordMatch = String(location.coordinates).match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/)
        if (coordMatch && coordMatch[1] && coordMatch[2]) {
          coordinates = [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]
        }
      }

      if (!coordinates) return false

      const [lng, lat] = coordinates
      return (
        lat >= bounds.south &&
        lat <= bounds.north &&
        lng >= bounds.west &&
        lng <= bounds.east
      )
    })
  }
}))

export default useLocationStore
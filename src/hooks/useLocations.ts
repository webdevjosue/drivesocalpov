/**
 * useLocations Hook - React Hook for Location Data Management
 * Integrates with Supabase database for real-time location data
 * Mobile-optimized with caching and error handling
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchLocations, LocationFilters } from '@/lib/services/location-service'
import type { LocationWithCategories } from '@/lib/services/location-service'

// Enhanced hook interface with mobile optimizations
interface UseLocationsOptions {
  initialFilters?: LocationFilters
  enableCache?: boolean
  cacheExpiry?: number // in milliseconds
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

interface UseLocationsReturn {
  locations: LocationWithCategories[]
  markers: ReturnType<typeof import('@/lib/services/location-service').transformLocationToMarker>[]
  loading: boolean
  error: string | null
  count: number
  hasMore: boolean
  refetch: () => Promise<void>
  loadMore: () => Promise<void>
  updateFilters: (filters: Partial<LocationFilters>) => void
  clearFilters: () => void
  refresh: () => Promise<void>
}

// Simple cache implementation for mobile performance
const locationCache = new Map<string, { data: any; timestamp: number; expiry: number }>()

export function useLocations(options: UseLocationsOptions = {}): UseLocationsReturn {
  const {
    initialFilters = {},
    enableCache = true,
    cacheExpiry = 5 * 60 * 1000, // 5 minutes default
    autoRefresh = false,
    refreshInterval = 30 * 1000, // 30 seconds default
  } = options

  // State management
  const [locations, setLocations] = useState<LocationWithCategories[]>([])
  const [markers, setMarkers] = useState<ReturnType<typeof import('@/lib/services/location-service').transformLocationToMarker>[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LocationFilters>(initialFilters)
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Generate cache key based on filters
  const cacheKey = useMemo(() => {
    return JSON.stringify(filters)
  }, [filters])

  // Check cache validity
  const isCacheValid = useCallback((key: string) => {
    if (!enableCache) return false

    const cached = locationCache.get(key)
    if (!cached) return false

    const now = Date.now()
    return now - cached.timestamp < cached.expiry
  }, [enableCache])

  // Fetch locations with caching
  const fetchLocationsData = useCallback(async (reset = false) => {
    setLoading(true)
    setError(null)

    try {
      // Check cache first
      if (!reset && isCacheValid(cacheKey)) {
        const cached = locationCache.get(cacheKey)!
        setLocations(cached.data.locations || [])
        setMarkers(cached.data.markers || [])
        setCount(cached.data.count || 0)
        setHasMore(cached.data.hasMore || false)
        setLoading(false)
        return
      }

      const currentFilters = reset ? { ...filters, offset: 0 } : filters
      const result = await fetchLocations(currentFilters)

      if (result.error) {
        setError(result.error)
        return
      }

      const newLocations = result.data || []
      const newMarkers = newLocations
        .map(location => {
          const { transformLocationToMarker } = require('@/lib/services/location-service')
          return transformLocationToMarker(location)
        })
        .filter(Boolean)

      // Update state
      if (reset) {
        setLocations(newLocations)
        setMarkers(newMarkers)
      } else {
        setLocations(prev => reset ? newLocations : [...prev, ...newLocations])
        setMarkers(prev => reset ? newMarkers : [...prev, ...newMarkers])
      }

      setCount(result.count || 0)
      setHasMore((newLocations.length || 0) >= (filters.limit || 20))

      // Cache the results
      if (enableCache) {
        locationCache.set(cacheKey, {
          data: {
            locations: reset ? newLocations : [...locations, ...newLocations],
            markers: reset ? newMarkers : [...markers, ...newMarkers],
            count: result.count || 0,
            hasMore: (newLocations.length || 0) >= (filters.limit || 20)
          },
          timestamp: Date.now(),
          expiry: cacheExpiry
        })

        // Clean up old cache entries
        const now = Date.now()
        locationCache.forEach((value, key) => {
          if (now - value.timestamp > value.expiry) {
            locationCache.delete(key)
          }
        })
      }

    } catch (err) {
      setError('Failed to fetch locations')
      console.error('Location fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, cacheKey, isCacheValid, enableCache, cacheExpiry, locations, markers])

  // Refetch all data
  const refetch = useCallback(async () => {
    await fetchLocationsData(true)
  }, [fetchLocationsData])

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    const newFilters = {
      ...filters,
      offset: locations.length
    }
    setFilters(newFilters)
    await fetchLocationsData(false)
  }, [loading, hasMore, locations.length, filters, fetchLocationsData])

  // Update filters and refetch
  const updateFilters = useCallback((newFilters: Partial<LocationFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, offset: 0 }
    setFilters(updatedFilters)
  }, [filters])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ ...initialFilters, offset: 0 })
  }, [initialFilters])

  // Refresh current data
  const refresh = useCallback(async () => {
    // Clear cache for current key
    locationCache.delete(cacheKey)
    await refetch()
  }, [cacheKey, refetch])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refresh])

  // Initial data fetch
  useEffect(() => {
    fetchLocationsData(true)
  }, [fetchLocationsData])

  return {
    locations,
    markers,
    loading,
    error,
    count,
    hasMore,
    refetch,
    loadMore,
    updateFilters,
    clearFilters,
    refresh,
  }
}

// Specialized hook for San Diego locations
export function useSanDiegoLocations(limit: number = 50) {
  return useLocations({
    initialFilters: { region: 'San Diego', limit },
    enableCache: true,
    cacheExpiry: 10 * 60 * 1000, // 10 minutes for regional data
  })
}

// Specialized hook for filtered locations by category
export function useFilteredLocations(category: string, region?: string) {
  const filters: LocationFilters = { category_id: category }
  if (region) filters.region = region

  return useLocations({
    initialFilters: filters,
    enableCache: true,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes for category data
  })
}

// Hook for free locations only
export function useFreeLocations(region?: string) {
  const filters: LocationFilters = { is_free: true }
  if (region) filters.region = region

  return useLocations({
    initialFilters: filters,
    enableCache: true,
    cacheExpiry: 15 * 60 * 1000, // 15 minutes for free events (less frequent changes)
  })
}

// Hook for premium locations
export function usePremiumLocations(region?: string) {
  const filters: LocationFilters = { is_premium: true }
  if (region) filters.region = region

  return useLocations({
    initialFilters: filters,
    enableCache: true,
    cacheExpiry: 10 * 60 * 1000, // 10 minutes for premium content
  })
}

export default useLocations
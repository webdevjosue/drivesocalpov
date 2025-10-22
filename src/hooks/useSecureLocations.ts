import { useState, useEffect, useCallback } from 'react'
import { secureLocationService, type SecureLocation, type Category } from '@/lib/services/secure-location-service'

interface UseSecureLocationsOptions {
  region?: string
  category?: string
  isFree?: boolean
  limit?: number
  autoLoad?: boolean
}

interface UseSecureLocationsReturn {
  locations: SecureLocation[]
  categories: Category[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  search: (query: string) => void
  searchResults: SecureLocation[]
  searchLoading: boolean
  searchError: string | null
}

export function useSecureLocations(options: UseSecureLocationsOptions = {}): UseSecureLocationsReturn {
  const [locations, setLocations] = useState<SecureLocation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  // Search state
  const [searchResults, setSearchResults] = useState<SecureLocation[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const { region, category, isFree, limit = 20, autoLoad = true } = options

  const loadLocations = useCallback(async (reset = false) => {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const currentOffset = reset ? 0 : offset
      const { data, error: serviceError } = await secureLocationService.getLocations({
        region,
        category,
        is_free: isFree,
        limit: limit + 5, // Load extra to determine if more are available
      })

      if (serviceError) {
        setError(serviceError)
      } else {
        const newLocations = data || []
        const hasMoreData = newLocations.length > limit

        if (reset) {
          setLocations(newLocations.slice(0, limit))
          setOffset(limit)
        } else {
          setLocations(prev => [...prev, ...newLocations.slice(0, limit)])
          setOffset(prev => prev + limit)
        }

        setHasMore(hasMoreData)
      }
    } catch (err) {
      setError('Failed to load locations. Please try again.')
      console.error('Load locations error:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, offset, region, category, isFree, limit])

  const loadCategories = useCallback(async () => {
    try {
      const { data, error: serviceError } = await secureLocationService.getCategories()
      if (serviceError) {
        console.error('Categories error:', serviceError)
      } else {
        setCategories(data || [])
      }
    } catch (err) {
      console.error('Load categories error:', err)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadLocations(false)
    }
  }, [loading, hasMore, loadLocations])

  const refresh = useCallback(() => {
    setOffset(0)
    setHasMore(true)
    loadLocations(true)
  }, [loadLocations])

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    setSearchLoading(true)
    setSearchError(null)

    try {
      const { data, error: serviceError } = await secureLocationService.searchLocations(query, {
        region,
        limit: 10
      })

      if (serviceError) {
        setSearchError(serviceError)
      } else {
        setSearchResults(data || [])
      }
    } catch (err) {
      setSearchError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setSearchLoading(false)
    }
  }, [region])

  // Initial load
  useEffect(() => {
    if (autoLoad) {
      loadLocations(true)
      loadCategories()
    }
  }, [autoLoad, loadLocations, loadCategories])

  return {
    locations,
    categories,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    search,
    searchResults,
    searchLoading,
    searchError
  }
}
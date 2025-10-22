/**
 * useLocations Hook Tests - Mobile Testing Suite
 * Testing location data management with database integration
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useLocations, useSanDiegoLocations, useFreeLocations } from '../useLocations'
import * as locationService from '@/lib/services/location-service'

// Mock the location service
jest.mock('@/lib/services/location-service')

const mockFetchLocations = locationService.fetchLocations as jest.MockedFunction<typeof locationService.fetchLocations>

describe('useLocations Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear location cache between tests
    const locationCache = new Map()
    jest.spyOn(Map.prototype, 'set').mockImplementation(() => locationCache)
  })

  describe('Basic functionality', () => {
    test('should initialize with empty state', () => {
      const { result } = renderHook(() => useLocations())

      expect(result.current.locations).toEqual([])
      expect(result.current.markers).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.count).toBe(0)
      expect(result.current.hasMore).toBe(false)
    })

    test('should fetch locations on mount', async () => {
      const mockLocations = [
        {
          id: '1',
          name: 'Test Location',
          latitude: 32.71,
          longitude: -117.15,
          region: 'San Diego',
          category: { name: 'attractions' },
          is_free: true,
          rating: 4.5
        }
      ]

      mockFetchLocations.mockResolvedValue({
        data: mockLocations,
        count: 1,
        error: null
      })

      const { result } = renderHook(() => useLocations())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockFetchLocations).toHaveBeenCalledWith({})
      expect(result.current.locations).toEqual(mockLocations)
      expect(result.current.count).toBe(1)
    })

    test('should handle fetch errors gracefully', async () => {
      mockFetchLocations.mockResolvedValue({
        data: null,
        count: 0,
        error: 'Database connection failed'
      })

      const { result } = renderHook(() => useLocations())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Database connection failed')
      expect(result.current.locations).toEqual([])
    })
  })

  describe('Mobile performance optimizations', () => {
    test('should use cache for repeated requests', async () => {
      const mockLocations = [{ id: '1', name: 'Cached Location' }]

      mockFetchLocations.mockResolvedValue({
        data: mockLocations,
        count: 1,
        error: null
      })

      const { result, rerender } = renderHook(() => useLocations({
        enableCache: true,
        cacheExpiry: 1000
      }))

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const callCount = mockFetchLocations.mock.calls.length

      // Re-render with same filters - should use cache
      rerender()

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Should not have made additional API call
      expect(mockFetchLocations).toHaveBeenCalledTimes(callCount)
    })

    test('should limit markers on mobile devices', async () => {
      // Mock mobile device
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const mockLocations = Array.from({ length: 60 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Location ${i + 1}`,
        latitude: 32.71 + (i * 0.01),
        longitude: -117.15 + (i * 0.01),
        region: 'San Diego',
        category: { name: 'attractions' },
        is_free: true
      }))

      mockFetchLocations.mockResolvedValue({
        data: mockLocations,
        count: 60,
        error: null
      })

      const { result } = renderHook(() => useLocations())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Should limit to 50 markers on mobile
      expect(result.current.markers.length).toBeLessThanOrEqual(50)
    })
  })

  describe('Filter functionality', () => {
    test('should update filters and refetch data', async () => {
      mockFetchLocations
        .mockResolvedValueOnce({ data: [], count: 0, error: null })
        .mockResolvedValueOnce({
          data: [{ id: '1', name: 'Free Event', is_free: true }],
          count: 1,
          error: null
        })

      const { result } = renderHook(() => useLocations())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Update filters to show only free locations
      result.current.updateFilters({ is_free: true })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockFetchLocations).toHaveBeenLastCalledWith({ is_free: true, offset: 0 })
    })

    test('should clear filters properly', async () => {
      mockFetchLocations
        .mockResolvedValueOnce({
          data: [{ id: '1', name: 'Filtered Location' }],
          count: 1,
          error: null
        })
        .mockResolvedValueOnce({
          data: [{ id: '2', name: 'All Locations' }],
          count: 1,
          error: null
        })

      const { result } = renderHook(() => useLocations({
        initialFilters: { is_free: true }
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Clear filters
      result.current.clearFilters()

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockFetchLocations).toHaveBeenLastCalledWith({ is_free: true, offset: 0 })
    })
  })

  describe('Pagination', () => {
    test('should handle load more functionality', async () => {
      const initialLocations = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Location ${i + 1}`,
        latitude: 32.71,
        longitude: -117.15,
        region: 'San Diego',
        category: { name: 'attractions' }
      }))

      const moreLocations = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 21}`,
        name: `Location ${i + 21}`,
        latitude: 32.71,
        longitude: -117.15,
        region: 'San Diego',
        category: { name: 'attractions' }
      }))

      mockFetchLocations
        .mockResolvedValueOnce({
          data: initialLocations,
          count: 40,
          error: null
        })
        .mockResolvedValueOnce({
          data: moreLocations,
          count: 40,
          error: null
        })

      const { result } = renderHook(() => useLocations({
        initialFilters: { limit: 20 }
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.locations.length).toBe(20)
        expect(result.current.hasMore).toBe(true)
      })

      // Load more
      result.current.loadMore()

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.locations.length).toBe(40)
      expect(mockFetchLocations).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 20 })
      )
    })
  })
})

describe('Specialized location hooks', () => {
  test('useSanDiegoLocations should fetch San Diego locations', async () => {
    mockFetchLocations.mockResolvedValue({
      data: [{ id: '1', name: 'San Diego Location', region: 'San Diego' }],
      count: 1,
      error: null
    })

    const { result } = renderHook(() => useSanDiegoLocations(25))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetchLocations).toHaveBeenCalledWith({
      region: 'San Diego',
      limit: 25
    })
  })

  test('useFreeLocations should fetch only free locations', async () => {
    mockFetchLocations.mockResolvedValue({
      data: [{ id: '1', name: 'Free Event', is_free: true }],
      count: 1,
      error: null
    })

    const { result } = renderHook(() => useFreeLocations('Los Angeles'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetchLocations).toHaveBeenCalledWith({
      is_free: true,
      region: 'Los Angeles'
    })
  })
})
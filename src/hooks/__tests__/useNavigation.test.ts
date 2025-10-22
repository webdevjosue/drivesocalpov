/**
 * useNavigation Hook Tests - Mobile Navigation Testing Suite
 * Testing navigation state management with mobile gestures and map integration
 */

import { renderHook, act } from '@testing-library/react'
import { useNavigation } from '../useNavigation'

// Mock window.__debugMap for map integration
const mockMap = {
  flyTo: jest.fn(),
  getCenter: jest.fn(() => ({ lat: 32.71, lng: -117.15 })),
  jumpTo: jest.fn()
}

Object.defineProperty(window, '__debugMap', {
  value: mockMap,
  writable: true
})

describe('useNavigation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMap.flyTo.mockClear()
  })

  describe('Menu state management', () => {
    test('should initialize with closed menu', () => {
      const { result } = renderHook(() => useNavigation())

      expect(result.current.navState.isOpen).toBe(false)
      expect(result.current.navState.selectedRegion).toBe('Los Angeles')
      expect(result.current.navState.selectedCategory).toBe('food')
      expect(result.current.navState.selectedPriceFilter).toBe('All Prices')
    })

    test('should toggle menu state', () => {
      const { result } = renderHook(() => useNavigation())

      act(() => {
        result.current.toggleMenu()
      })

      expect(result.current.navState.isOpen).toBe(true)

      act(() => {
        result.current.toggleMenu()
      })

      expect(result.current.navState.isOpen).toBe(false)
    })

    test('should open and close menu explicitly', () => {
      const { result } = renderHook(() => useNavigation())

      act(() => {
        result.current.openMenu()
      })

      expect(result.current.navState.isOpen).toBe(true)

      act(() => {
        result.current.closeMenu()
      })

      expect(result.current.navState.isOpen).toBe(false)
    })
  })

  describe('Map navigation', () => {
    test('should fly to San Diego region', () => {
      const { result } = renderHook(() => useNavigation())

      act(() => {
        result.current.flyToRegion('San Diego')
      })

      expect(mockMap.flyTo).toHaveBeenCalledWith({
        center: [-117.15, 32.71],
        zoom: 11,
        bearing: 0,
        pitch: 0,
        duration: 1000,
        essential: true
      })

      expect(result.current.navState.selectedRegion).toBe('San Diego')
    })

    test('should fly to Los Angeles region', () => {
      const { result } = renderHook(() => useNavigation())

      act(() => {
        result.current.flyToRegion('Los Angeles')
      })

      expect(mockMap.flyTo).toHaveBeenCalledWith({
        center: [-118.24, 34.05],
        zoom: 11,
        bearing: 0,
        pitch: 0,
        duration: 1000,
        essential: true
      })

      expect(result.current.navState.selectedRegion).toBe('Los Angeles')
    })

    test('should fly to Inland Empire region', () => {
      const { result } = renderHook(() => useNavigation())

      act(() => {
        result.current.flyToRegion('Inland Empire')
      })

      expect(mockMap.flyTo).toHaveBeenCalledWith({
        center: [-117.3, 34.1],
        zoom: 11,
        bearing: 0,
        pitch: 0,
        duration: 1000,
        essential: true
      })

      expect(result.current.navState.selectedRegion).toBe('Inland Empire')
    })
  })

  describe('Filter functionality', () => {
    test('should filter by category', () => {
      const { result } = renderHook(() => useNavigation())

      act(() => {
        result.current.filterByCategory('beaches')
      })

      expect(result.current.navState.selectedCategory).toBe('beaches')
      expect(result.current.navState.isOpen).toBe(false) // Menu should close
    })

    test('should filter by price', () => {
      const { result } = renderHook(() => useNavigation())

      act(() => {
        result.current.filterByPrice('Free Only')
      })

      expect(result.current.navState.selectedPriceFilter).toBe('Free Only')
      expect(result.current.navState.isOpen).toBe(false) // Menu should close
    })
  })

  describe('Navigation items', () => {
    test('should provide all navigation items', () => {
      const { result } = renderHook(() => useNavigation())

      expect(result.current.navigationItems).toHaveLength(8)

      // Check essential navigation items
      const itemLabels = result.current.navigationItems.map(item => item.label)
      expect(itemLabels).toContain('Home')
      expect(itemLabels).toContain('Explore')
      expect(itemLabels).toContain('Favorites')
      expect(itemLabels).toContain('My Itinerary')
      expect(itemLabels).toContain('Top Rated')
      expect(itemLabels).toContain('Free Events')
      expect(itemLabels).toContain('Profile')
      expect(itemLabels).toContain('Settings')
    })

    test('should have correct item properties', () => {
      const { result } = renderHook(() => useNavigation())

      const homeItem = result.current.navigationItems.find(item => item.id === 'home')
      expect(homeItem).toBeDefined()
      expect(homeItem?.label).toBe('Home')
      expect(homeItem?.icon).toBe('🏠')
      expect(homeItem?.requiresAuth).toBeUndefined()
      expect(typeof homeItem?.action).toBe('function')
    })

    test('should identify premium features', () => {
      const { result } = renderHook(() => useNavigation())

      const premiumFeatures = result.current.premiumFeatures
      expect(premiumFeatures.length).toBeGreaterThan(0)

      premiumFeatures.forEach(feature => {
        expect(feature.isPremium).toBe(true)
        expect(feature.badge).toBe('PRO')
      })
    })
  })

  describe('Mobile gesture support', () => {
    test('should handle swipe left to close menu', () => {
      const { result } = renderHook(() => useNavigation())

      // Open menu first
      act(() => {
        result.current.openMenu()
      })

      expect(result.current.navState.isOpen).toBe(true)

      // Swipe left
      act(() => {
        result.current.handleSwipeLeft()
      })

      expect(result.current.navState.isOpen).toBe(false)
    })

    test('should handle swipe right to open menu', () => {
      const { result } = renderHook(() => useNavigation())

      expect(result.current.navState.isOpen).toBe(false)

      // Swipe right
      act(() => {
        result.current.handleSwipeRight()
      })

      expect(result.current.navState.isOpen).toBe(true)
    })
  })

  describe('Region and category constants', () => {
    test('should provide correct region definitions', () => {
      const { result } = renderHook(() => useNavigation())

      expect(result.current.REGIONS['San Diego']).toEqual({
        name: 'San Diego',
        coordinates: [-117.15, 32.71],
        zoom: 11,
        bounds: { north: 33.2, south: 32.5, east: -116.8, west: -117.4 }
      })

      expect(result.current.REGIONS['Los Angeles']).toEqual({
        name: 'Los Angeles',
        coordinates: [-118.24, 34.05],
        zoom: 11,
        bounds: { north: 34.8, south: 33.7, east: -117.8, west: -118.8 }
      })

      expect(result.current.REGIONS['Inland Empire']).toEqual({
        name: 'Inland Empire',
        coordinates: [-117.3, 34.1],
        zoom: 11,
        bounds: { north: 34.5, south: 33.8, east: -116.8, west: -117.8 }
      })
    })

    test('should provide correct category definitions', () => {
      const { result } = renderHook(() => useNavigation())

      expect(result.current.CATEGORIES.food).toEqual({
        name: 'Food & Dining',
        icon: '🍴',
        color: '#FF6B6B'
      })

      expect(result.current.CATEGORIES.beaches).toEqual({
        name: 'Beaches',
        icon: '🏖️',
        color: '#45B7D1'
      })

      expect(result.current.CATEGORIES.attractions).toEqual({
        name: 'Attractions',
        icon: '🎢',
        color: '#4ECDC4'
      })
    })
  })

  describe('Navigation actions', () => {
    test('Home action should reset view', () => {
      const { result } = renderHook(() => useNavigation())

      const homeItem = result.current.navigationItems.find(item => item.id === 'home')
      expect(homeItem).toBeDefined()

      act(() => {
        homeItem?.action()
      })

      expect(mockMap.flyTo).toHaveBeenCalledWith({
        center: [-118.2437, 34.0522],
        zoom: 10,
        bearing: 0,
        pitch: 0,
        duration: 1500
      })
    })

    test('Free Events action should filter by free only', () => {
      const { result } = renderHook(() => useNavigation())

      const freeEventsItem = result.current.navigationItems.find(item => item.id === 'free-events')
      expect(freeEventsItem).toBeDefined()

      act(() => {
        freeEventsItem?.action()
      })

      expect(result.current.navState.selectedPriceFilter).toBe('Free Only')
    })
  })
})
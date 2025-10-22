/**
 * useNavigation Hook - Navigation State Management for Drive SoCal POV
 * Connects burger menu items to database-driven functionality
 * Mobile-optimized with gesture support and smooth transitions
 */

'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useLocations, useSanDiegoLocations, useFreeLocations, usePremiumLocations } from './useLocations'

// Navigation item types
export interface NavigationItem {
  id: string
  label: string
  icon: string
  action: () => void
  requiresAuth?: boolean
  isPremium?: boolean
  badge?: string
  description?: string
}

export interface NavigationState {
  isOpen: boolean
  activeSection: string | null
  selectedRegion: string
  selectedCategory: string
  selectedPriceFilter: string
  isFilterMode: boolean
}

// Region definitions with map coordinates
export const REGIONS = {
  'San Diego': {
    name: 'San Diego',
    coordinates: [-117.15, 32.71] as [number, number],
    zoom: 11,
    bounds: { north: 33.2, south: 32.5, east: -116.8, west: -117.4 }
  },
  'Los Angeles': {
    name: 'Los Angeles',
    coordinates: [-118.24, 34.05] as [number, number],
    zoom: 11,
    bounds: { north: 34.8, south: 33.7, east: -117.8, west: -118.8 }
  },
  'Inland Empire': {
    name: 'Inland Empire',
    coordinates: [-117.3, 34.1] as [number, number],
    zoom: 11,
    bounds: { north: 34.5, south: 33.8, east: -116.8, west: -117.8 }
  }
} as const

// Category definitions
export const CATEGORIES = {
  food: { name: 'Food & Dining', icon: '🍴', color: '#FF6B6B' },
  attractions: { name: 'Attractions', icon: '🎢', color: '#4ECDC4' },
  beaches: { name: 'Beaches', icon: '🏖️', color: '#45B7D1' },
  museums: { name: 'Museums', icon: '🏛️', color: '#96CEB4' },
  hiking: { name: 'Hiking & Nature', icon: '🥾', color: '#88D8B0' },
  shopping: { name: 'Shopping', icon: '🛍️', color: '#FFB6C1' },
  entertainment: { name: 'Entertainment', icon: '🎭', color: '#DDA0DD' },
  events: { name: 'Events', icon: '📅', color: '#F0E68C' }
} as const

export type Region = keyof typeof REGIONS
export type Category = keyof typeof CATEGORIES

export function useNavigation() {
  // const router = useRouter() // Not used yet

  // Navigation state
  const [navState, setNavState] = useState<NavigationState>({
    isOpen: false,
    activeSection: null,
    selectedRegion: 'Los Angeles',
    selectedCategory: 'food',
    selectedPriceFilter: 'All Prices',
    isFilterMode: false
  })

  // Location data hooks
  const allLocations = useLocations({
    initialFilters: { limit: 100 },
    enableCache: true,
    cacheExpiry: 5 * 60 * 1000
  })

  const sanDiegoLocations = useSanDiegoLocations(50)
  const freeLocations = useFreeLocations(navState.selectedRegion !== 'All Regions' ? navState.selectedRegion : undefined)
  const premiumLocations = usePremiumLocations(navState.selectedRegion !== 'All Regions' ? navState.selectedRegion : undefined)

  // Map instance access (from global window object)
  const getMapInstance = useCallback(() => {
    return (window as any).__debugMap
  }, [])

  // Navigation actions
  const openMenu = useCallback(() => {
    setNavState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const closeMenu = useCallback(() => {
    setNavState(prev => ({ ...prev, isOpen: false, activeSection: null }))
  }, [])

  const toggleMenu = useCallback(() => {
    setNavState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }, [])

  // Map navigation actions
  const flyToRegion = useCallback((region: Region) => {
    const map = getMapInstance()
    if (!map) return

    const regionConfig = REGIONS[region]
    map.flyTo({
      center: regionConfig.coordinates,
      zoom: regionConfig.zoom,
      bearing: 0,
      pitch: 0,
      duration: 1000,
      essential: true
    })

    setNavState(prev => ({ ...prev, selectedRegion: region }))

    // Update location data for selected region
    allLocations.updateFilters({ region })

    closeMenu()
  }, [getMapInstance, allLocations.updateFilters, closeMenu])

  const filterByCategory = useCallback((category: Category) => {
    setNavState(prev => ({ ...prev, selectedCategory: category }))
    allLocations.updateFilters({
      category_id: category,
      ...(navState.selectedRegion !== 'All Regions' && { region: navState.selectedRegion })
    })
    closeMenu()
  }, [allLocations.updateFilters, navState.selectedRegion, closeMenu])

  const filterByPrice = useCallback((priceFilter: string) => {
    setNavState(prev => ({ ...prev, selectedPriceFilter: priceFilter }))

    let filters: any = {}
    if (priceFilter === 'Free Only') {
      filters.is_free = true
    } else if (priceFilter !== 'All Prices') {
      // Note: price filtering to be implemented when available in LocationFilters interface
    }

    allLocations.updateFilters(filters)
    closeMenu()
  }, [allLocations.updateFilters, closeMenu])

  // Navigation menu items
  const navigationItems = useMemo((): NavigationItem[] => [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      action: () => {
        const map = getMapInstance()
        if (map) {
          map.flyTo({
            center: [-118.2437, 34.0522], // Downtown LA
            zoom: 10,
            bearing: 0,
            pitch: 0,
            duration: 1500
          })
        }
        allLocations.clearFilters()
        closeMenu()
      }
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: '🔍',
      action: () => {
        setNavState(prev => ({ ...prev, activeSection: 'explore', isFilterMode: true }))
      }
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: '❤️',
      action: () => {
        // TODO: Implement favorites functionality
        console.log('Favorites clicked - will open user favorites')
        closeMenu()
      },
      requiresAuth: true
    },
    {
      id: 'itinerary',
      label: 'My Itinerary',
      icon: '📅',
      action: () => {
        // TODO: Implement itinerary functionality
        console.log('Itinerary clicked - will open user itineraries')
        closeMenu()
      },
      requiresAuth: true
    },
    {
      id: 'top-rated',
      label: 'Top Rated',
      icon: '⭐',
      action: () => {
        allLocations.updateFilters({}) // TODO: Add rating filter when available
        closeMenu()
      }
    },
    {
      id: 'free-events',
      label: 'Free Events',
      icon: '🆓',
      action: () => {
        filterByPrice('Free Only')
        closeMenu()
      }
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      action: () => {
        // TODO: Implement profile functionality
        console.log('Profile clicked - will open user profile')
        closeMenu()
      },
      requiresAuth: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      action: () => {
        // TODO: Implement settings functionality
        console.log('Settings clicked - will open settings panel')
        closeMenu()
      }
    }
  ], [getMapInstance, allLocations, filterByPrice, closeMenu])

  // Premium feature actions
  const premiumFeatures = useMemo((): NavigationItem[] => [
    {
      id: 'premium-spots',
      label: 'Premium Spots',
      icon: '🎯',
      description: 'Hidden gems & exclusive locations',
      action: () => {
        filterByCategory('attractions')
        allLocations.updateFilters({ is_premium: true })
        closeMenu()
      },
      isPremium: true,
      badge: 'PRO'
    },
    {
      id: 'food-tours',
      label: 'Food Tours',
      icon: '🍴',
      description: 'Curated culinary experiences',
      action: () => {
        filterByCategory('food')
        allLocations.updateFilters({ is_premium: true })
        closeMenu()
      },
      isPremium: true,
      badge: 'PRO'
    },
    {
      id: 'local-guides',
      label: 'Local Guides',
      icon: '🚗',
      description: 'Expert tips & insider knowledge',
      action: () => {
        // TODO: Implement local guides functionality
        console.log('Local guides clicked - will show curated guides')
        closeMenu()
      },
      isPremium: true,
      badge: 'PRO'
    }
  ], [filterByCategory, allLocations.updateFilters, closeMenu])

  // Region selection actions
  const regionActions = useMemo((): NavigationItem[] => {
    return Object.entries(REGIONS).map(([key, config]) => ({
      id: `region-${key}`,
      label: config.name,
      icon: navState.selectedRegion === key ? '📍' : '🗺️',
      action: () => flyToRegion(key as Region)
    }))
  }, [navState.selectedRegion, flyToRegion])

  // Category selection actions
  const categoryActions = useMemo((): NavigationItem[] => {
    return Object.entries(CATEGORIES).map(([key, config]) => ({
      id: `category-${key}`,
      label: config.name,
      icon: config.icon,
      action: () => filterByCategory(key as Category)
    }))
  }, [filterByCategory])

  // Search functionality
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim()) {
      allLocations.clearFilters()
      return
    }

    allLocations.updateFilters({ search: query.trim() })
  }, [allLocations.updateFilters])

  // Mobile gesture support
  const handleSwipeLeft = useCallback(() => {
    if (navState.isOpen) {
      closeMenu()
    }
  }, [navState.isOpen, closeMenu])

  const handleSwipeRight = useCallback(() => {
    if (!navState.isOpen) {
      openMenu()
    }
  }, [navState.isOpen, openMenu])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && navState.isOpen) {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [navState.isOpen, closeMenu])

  return {
    // State
    navState,
    setNavState,

    // Menu controls
    openMenu,
    closeMenu,
    toggleMenu,

    // Navigation actions
    navigationItems,
    premiumFeatures,
    regionActions,
    categoryActions,

    // Filter actions
    flyToRegion,
    filterByCategory,
    filterByPrice,
    searchLocations,

    // Location data
    allLocations,
    sanDiegoLocations,
    freeLocations,
    premiumLocations,

    // Mobile gestures
    handleSwipeLeft,
    handleSwipeRight,

    // Constants
    REGIONS,
    CATEGORIES
  }
}

export default useNavigation
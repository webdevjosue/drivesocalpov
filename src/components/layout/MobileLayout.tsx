/**
 * Mobile Layout Component - Systematic Design System Implementation
 * Proper semantic HTML5 structure with modern mobile-first design
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Navigation, Menu, Home, Search, Heart, User, MapPin, Star, Settings, LogOut, Maximize2, X, ChevronUp } from 'lucide-react'

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
}

// Type definitions for map object
interface MapLibreMap {
  getCenter(): { lat: number; lng: number }
  flyTo(options: {
    center: [number, number]
    zoom: number
    bearing?: number
    pitch?: number
    duration?: number
    essential?: boolean
  }): void
}

interface WindowWithDebugMap extends Window {
  __debugMap?: MapLibreMap
}

export default function MobileLayout({ children, title = "Drive SoCal POV" }: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'region' | 'places' | 'free' | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('Los Angeles')
  const [selectedPlace, setSelectedPlace] = useState('food')
  const [currentMapRegion, setCurrentMapRegion] = useState('Los Angeles')

  // New state for slide-up filter and ad banner interactions
  const [areAdsVisible, setAreAdsVisible] = useState(true)
  const [isFilterCardVisible, setIsFilterCardVisible] = useState(false)

  // Close filter popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-filter-container]')) {
        setActiveFilter(null)
      }
      // Also close menu when clicking outside
      if (!target.closest('[data-menu-container]')) {
        setIsMenuOpen(false)
      }
    }

    if (activeFilter || isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
    return undefined
  }, [activeFilter, isMenuOpen])

  // Smart region detection based on map center position
  useEffect(() => {
    const detectRegion = () => {
      const map = (window as WindowWithDebugMap).__debugMap
      if (!map) return

      const center = map.getCenter()
      const lat = center.lat
      const lng = center.lng

      // Define region boundaries
      let detectedRegion = 'Los Angeles' // default

      if (lat >= 32.5 && lat <= 33.5 && lng >= -117.5 && lng <= -116.5) {
        detectedRegion = 'San Diego'
      } else if (lat >= 33.8 && lat <= 34.5 && lng >= -118.5 && lng <= -117.8) {
        detectedRegion = 'Los Angeles'
      } else if (lat >= 33.8 && lat <= 34.5 && lng >= -117.8 && lng <= -116.8) {
        detectedRegion = 'Inland Empire'
      }

      setCurrentMapRegion(detectedRegion)
    }

    // Initial detection
    detectRegion()

    // Set up interval to detect region changes
    const interval = setInterval(detectRegion, 2000)
    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: Search, label: 'Explore' },
    { icon: Heart, label: 'Favorites' },
    { icon: MapPin, label: 'Itinerary' },
    { icon: Star, label: 'Top Rated' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
  ]

  // Regions with coordinates for map navigation
  const regions = [
    { name: 'Inland Empire', coordinates: [-117.3, 34.1] as [number, number] },
    { name: 'Los Angeles', coordinates: [-118.24, 34.05] as [number, number] },
    { name: 'San Diego', coordinates: [-117.15, 32.71] as [number, number] },
  ]

  // Place categories
  const placeCategories = ['food', 'events', 'attractions', 'beaches', 'museums', 'bars']

  // Price levels
  const priceLevels = ['$', '$$', '$$$']

  // Handle region selection - move map to selected region
  const handleRegionSelect = (region: typeof regions[0]) => {
    setSelectedRegion(region.name)
    setActiveFilter(null)

    // Access the map instance and move to selected region
    const map = (window as WindowWithDebugMap).__debugMap
    if (map) {
      map.flyTo({
        center: region.coordinates,
        zoom: 11,
        bearing: 0,
        pitch: 0,
        duration: 1000,
        essential: true,
      })
    }
  }

  // Handle place selection
  const handlePlaceSelect = (place: string) => {
    setSelectedPlace(place)
    setActiveFilter(null)
  }

  // Handle ad banner interactions
  const handleCloseAds = () => {
    setTimeout(() => {
      setAreAdsVisible(false)
      setIsFilterCardVisible(true)
    }, 300)
  }

  const handleSlideAdsDown = () => {
    setTimeout(() => {
      setAreAdsVisible(false)
      setIsFilterCardVisible(true)
    }, 300)
  }

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Semantic Header - Matching Wireframe */}
      <header
        className="app-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3)',
          backgroundColor: 'var(--color-background)',
          borderBottom: `1px solid var(--color-border-primary)`,
          position: 'relative',
          zIndex: 'var(--z-sticky)',
          flexShrink: 0,
          height: 'var(--header-height)',
        }}
      >
        {/* Fullscreen Icon - Top Left - Now Functional */}
        <button
          className="btn btn--ghost btn--icon"
          aria-label="Toggle fullscreen"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen()
            } else {
              document.exitFullscreen()
            }
          }}
          style={{
            border: '2px solid var(--color-primary-600)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px',
            transition: 'all var(--transition-normal)',
            backgroundColor: 'var(--color-background)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-50)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-background)'
          }}
        >
          <Maximize2 style={{ width: '16px', height: '16px', color: 'var(--color-primary-600)' }} />
        </button>

        {/* Application Title - Centered with Border - Now Clickable */}
        <button
          className="btn btn--secondary"
          onClick={() => {
            // Reset map to initial view
            const map = (window as WindowWithDebugMap).__debugMap
            if (map) {
              map.flyTo({
                center: [-118.2437, 34.0522],
                zoom: 10,
                bearing: 0,
                pitch: 0,
                duration: 1500,
              })
            }
          }}
          style={{
            border: '2px solid var(--color-primary-600)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: 'var(--color-primary-50)',
            transition: 'all var(--transition-normal)',
            minHeight: '44px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-100)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-50)'
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary-700)',
              textAlign: 'center',
              margin: 0,
              lineHeight: 'var(--line-height-tight)',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h1>
        </button>

        </header>

      {/* Main Content Area - Full Width Map */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0, // Critical: Allows flex item to shrink properly
          height: 'calc(100vh - var(--header-height) - var(--filter-height) - var(--footer-height))',
        }}
      >
        {/* Map Container - Full Width */}
        {children}
      </main>

      {/* Smart Filter Bar - Slide-up Card from Bottom */}
      <div
        data-filter-container
        data-menu-container
        style={{
          position: 'fixed',
          bottom: isFilterCardVisible ? 'calc(var(--footer-height) + 8px)' : '-100px',
          left: 'var(--space-4)',
          right: 'var(--space-4)',
          zIndex: 'var(--z-fixed)',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-4)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          transform: isFilterCardVisible ? 'translateY(0)' : 'translateY(100px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isFilterCardVisible ? 1 : 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '450px',
            margin: '0 auto',
          }}
        >
          {/* Region Filter */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className={activeFilter === 'region' ? 'btn btn--primary' : 'btn btn--ghost'}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                minHeight: '40px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeFilter === 'region' ? 'var(--color-primary-600)' : 'var(--color-surface)',
                color: activeFilter === 'region' ? 'white' : 'var(--color-text-primary)',
                border: `1px solid ${activeFilter === 'region' ? 'var(--color-primary-600)' : 'var(--color-border-primary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-normal)',
              }}
              onClick={() => setActiveFilter(activeFilter === 'region' ? null : 'region')}
            >
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                Region
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-semibold)' }}>
                {selectedRegion}
              </span>
            </button>

            {/* Region Dropdown */}
            {activeFilter === 'region' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 'var(--space-2)',
                  right: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-3)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 'var(--z-dropdown)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textAlign: 'center', fontWeight: 'var(--font-weight-semibold)' }}>
                  Current: {currentMapRegion}
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border-primary)', marginBottom: 'var(--space-2)' }} />
                {regions.map((region) => (
                  <button
                    key={region.name}
                    className="btn btn--ghost"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                      minHeight: '44px',
                      backgroundColor: selectedRegion === region.name ? 'var(--color-primary-50)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = selectedRegion === region.name ? 'var(--color-primary-100)' : 'var(--color-gray-50)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selectedRegion === region.name ? 'var(--color-primary-50)' : 'transparent'
                    }}
                    onClick={() => handleRegionSelect(region)}
                  >
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{region.name}</span>
                    {currentMapRegion === region.name && (
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        backgroundColor: 'var(--color-primary-600)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Current
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Places Filter */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className={activeFilter === 'places' ? 'btn btn--primary' : 'btn btn--ghost'}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                minHeight: '40px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeFilter === 'places' ? 'var(--color-primary-600)' : 'var(--color-surface)',
                color: activeFilter === 'places' ? 'white' : 'var(--color-text-primary)',
                border: `1px solid ${activeFilter === 'places' ? 'var(--color-primary-600)' : 'var(--color-border-primary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-normal)',
              }}
              onClick={() => setActiveFilter(activeFilter === 'places' ? null : 'places')}
            >
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                Places
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-semibold)', textTransform: 'capitalize' }}>
                {selectedPlace}
              </span>
            </button>

            {/* Places Dropdown */}
            {activeFilter === 'places' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 'var(--space-2)',
                  right: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-3)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 'var(--z-dropdown)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {placeCategories.map((place) => (
                  <button
                    key={place}
                    className="btn btn--ghost"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                      minHeight: '44px',
                      backgroundColor: selectedPlace === place ? 'var(--color-primary-50)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = selectedPlace === place ? 'var(--color-primary-100)' : 'var(--color-gray-50)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selectedPlace === place ? 'var(--color-primary-50)' : 'transparent'
                    }}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <span style={{ fontWeight: 'var(--font-weight-medium)', textTransform: 'capitalize' }}>{place}</span>
                    {selectedPlace === place && (
                      <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-primary-600)', borderRadius: '50%' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Free Filter */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className={activeFilter === 'free' ? 'btn btn--primary' : 'btn btn--ghost'}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                minHeight: '40px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeFilter === 'free' ? 'var(--color-primary-600)' : 'var(--color-surface)',
                color: activeFilter === 'free' ? 'white' : 'var(--color-text-primary)',
                border: `1px solid ${activeFilter === 'free' ? 'var(--color-primary-600)' : 'var(--color-border-primary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-normal)',
              }}
              onClick={() => setActiveFilter(activeFilter === 'free' ? null : 'free')}
            >
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                Price
              </span>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                {priceLevels.map((level) => (
                  <span
                    key={level}
                    style={{
                      fontSize: '10px',
                      color: activeFilter === 'free' ? 'white' : 'var(--color-text-secondary)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </button>

            {/* Price Options Dropdown */}
            {activeFilter === 'free' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 'var(--space-2)',
                  right: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-3)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 'var(--z-dropdown)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', textAlign: 'center', fontWeight: 'var(--font-weight-semibold)' }}>
                  Filter by Price Range
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {['Free Only', '$', '$$', '$$$', 'All Prices'].map((price) => (
                    <button
                      key={price}
                      className="btn btn--ghost"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        fontSize: 'var(--text-sm)',
                        textAlign: 'left',
                        minHeight: '44px',
                        backgroundColor: 'transparent',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      onClick={() => {
                        setActiveFilter(null)
                        // TODO: Implement price filtering logic
                      }}
                    >
                      <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Burger Menu Icon - Integrated into Filter Card */}
          <div style={{ position: 'relative', flex: '0 0 auto' }}>
            <button
              className="btn btn--ghost btn--icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open navigation menu"
              style={{
                padding: 'var(--space-2)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-lg)',
                minHeight: '40px',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                zIndex: isMenuOpen ? 'var(--z-popover)' : 'auto',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)'
              }}
            >
              <Menu style={{ width: '16px', height: '16px', color: 'var(--color-text-secondary)' }} />
            </button>

            {/* Menu Popup from Behind Filter Card */}
            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: '0',
                  marginBottom: 'var(--space-2)',
                  width: '280px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 'calc(var(--z-dropdown) - 1)', // Behind dropdowns but above other elements
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                  opacity: isMenuOpen ? 1 : 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'popUpFromBehind 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-3)',
                  textAlign: 'center'
                }}>
                  Menu
                </div>
                <div style={{
                  height: '1px',
                  backgroundColor: 'var(--color-border-primary)',
                  marginBottom: 'var(--space-3)'
                }} />

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }} aria-label="Main navigation">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      className="btn btn--ghost"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        fontSize: 'var(--text-sm)',
                        textAlign: 'left',
                        minHeight: '44px',
                        backgroundColor: 'transparent',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 'var(--space-3)',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      onClick={() => {
                        setIsMenuOpen(false)
                        // TODO: Add navigation logic for each menu item
                      }}
                    >
                      <item.icon style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
                      <span style={{
                        flex: 1,
                        textAlign: 'left',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)'
                      }}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </nav>

                <div style={{
                  height: '1px',
                  backgroundColor: 'var(--color-border-primary)',
                  margin: 'var(--space-3) 0'
                }} />

                <button
                  className="btn btn--ghost"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'left',
                    minHeight: '44px',
                    backgroundColor: 'transparent',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 'var(--space-3)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-red-50)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    setIsMenuOpen(false)
                    // TODO: Add sign out logic
                  }}
                >
                  <LogOut style={{ width: '16px', height: '16px', color: 'var(--color-red-500)' }} />
                  <span style={{
                        flex: 1,
                        textAlign: 'left',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-red-500)'
                      }}>
                        Sign Out
                      </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locate Me Button - Above Floating Card */}
      <button
        className="btn btn--primary"
        style={{
          position: 'absolute',
          bottom: 'calc(var(--footer-height) + 120px)',
          right: 'var(--space-4)',
          padding: 'var(--space-2)',
          fontSize: 'var(--text-xs)',
          minHeight: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          zIndex: 'calc(var(--z-fixed) - 1)',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3), 0 4px 16px rgba(37, 99, 235, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(37, 99, 235, 0.95)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.4), 0 6px 20px rgba(37, 99, 235, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 99, 235, 0.3), 0 4px 16px rgba(37, 99, 235, 0.2)'
        }}
        aria-label="Find my location"
        onClick={() => {
          // Get user location and center map
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const map = (window as WindowWithDebugMap).__debugMap
                if (map) {
                  map.flyTo({
                    center: [position.coords.longitude, position.coords.latitude],
                    zoom: 14,
                    bearing: 0,
                    pitch: 0,
                    duration: 1000,
                  })
                }
              },
              (error) => {
                console.error('Error getting location:', error)
              }
            )
          }
        }}
      >
        <Navigation style={{ width: '20px', height: '20px', color: 'white' }} />
      </button>

      {/* Ad Banner with X button and Slide-down functionality */}
      <footer
        style={{
          height: areAdsVisible ? 'var(--footer-height)' : '0px',
          backgroundColor: 'var(--color-surface)',
          borderTop: areAdsVisible ? `1px solid var(--color-border-primary)` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: areAdsVisible ? '0 var(--space-3)' : '0',
          flexShrink: 0,
          transform: areAdsVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          opacity: areAdsVisible ? 1 : 0,
        }}
      >
        {areAdsVisible && (
          <>
            {/* Three Ad Segments */}
            <div style={{ display: 'flex', flex: 1, gap: 'var(--space-1)', height: '100%' }}>
              {['ADS', 'ADS', 'ADS'].map((ad, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--color-gray-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {ad}
                  </span>
                </div>
              ))}
            </div>

            {/* X Button to Close Ads */}
            <button
              className="btn btn--ghost btn--icon"
              onClick={handleCloseAds}
              aria-label="Close ads"
              style={{
                padding: 'var(--space-1)',
                marginLeft: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-red-50)',
                border: '1px solid var(--color-red-200)',
                transition: 'all var(--transition-normal)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-red-100)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-red-50)'
              }}
            >
              <X style={{ width: '16px', height: '16px', color: 'var(--color-red-600)' }} />
            </button>
          </>
        )}
      </footer>

      {/* Slide-down indicator when ads are visible */}
      {areAdsVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: 'var(--footer-height)',
            left: 'var(--space-4)',
            right: 'var(--space-4)',
            zIndex: 'calc(var(--z-fixed) + 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--space-2)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderTopLeftRadius: 'var(--radius-lg)',
            borderTopRightRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
          }}
          onClick={handleSlideAdsDown}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <ChevronUp style={{ width: '20px', height: '20px', color: 'var(--color-text-muted)' }} />
          <span style={{
            marginLeft: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Slide to reveal menu
          </span>
        </div>
      )}

      </div>
  )
}
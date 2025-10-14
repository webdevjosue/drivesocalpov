/**
 * Mobile Layout Component - Systematic Design System Implementation
 * Proper semantic HTML5 structure with modern mobile-first design
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Navigation, Menu, Home, Search, Heart, User, MapPin, Star, Settings, LogOut, Maximize2, X } from 'lucide-react'

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
  easeTo(options: {
    bearing?: number
    pitch?: number
    duration?: number
    easing?: (t: number) => number
  }): void
}

interface WindowWithDebugMap extends Window {
  __debugMap?: MapLibreMap
}

export default function MobileLayout({ children, title = "Drive SoCal POV" }: MobileLayoutProps) {
  // State management - single declarations only
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'region' | 'places' | 'free' | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('Los Angeles')
  const [selectedPlace, setSelectedPlace] = useState('food')
  const [currentMapRegion, setCurrentMapRegion] = useState('Los Angeles')
  const [selectedPrice, setSelectedPrice] = useState('All Prices')

  
  // Close filter popups and menu when clicking outside
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

  // Handle integrated menu interactions - premium features are part of the menu
  const handlePremiumFeatureClick = (feature: string) => {
    console.log(`Premium feature clicked: ${feature}`)
    // TODO: Show premium upgrade modal or navigate to premium features
  }

  // Generate contextual ad targeting based on user preferences
  const generateAdTargeting = () => {
    const targeting = {
      region: currentMapRegion.toLowerCase(),
      category: selectedPlace.toLowerCase(),
      price: selectedPrice.toLowerCase(),
      // Add specific keywords for better targeting
      keywords: [
        currentMapRegion,
        selectedPlace,
        selectedPrice,
        'southern california',
        'san diego',
        'los angeles',
        'inland empire'
      ].filter(Boolean).join(',')
    }
    return targeting
  }

  
  return (
    <div
      className="app-container"
      style={{
        backgroundColor: 'var(--color-background)',
        // iOS Safari specific fixes for bottom edge
        paddingBottom: '0px',
        marginBottom: '0px',
        // Ensure container extends to actual viewport bottom
        height: '100dvh',
        // Force iOS Safari to respect bottom edge
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
      }}
    >
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
              fontWeight: '700',
              color: 'var(--color-primary-700)',
              textAlign: 'center',
              margin: 0,
              lineHeight: '1.2',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontVariantNumeric: 'tabular-nums',
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
          // iOS Safari specific height calculations - maximized map space
          height: 'calc(100dvh - var(--header-height) - 116px)', // 60px filter + 56px ad = 116px
          // Ensure content doesn't exceed available space
          maxHeight: 'calc(100dvh - var(--header-height) - 116px)',
          // Remove any bottom padding/margins
          paddingBottom: '0px',
          marginBottom: '0px',
          WebkitOverflowScrolling: 'touch',
          // Ensure map fills entire available space
          width: '100%',
        }}
      >
        {/* Map Container - Full Width */}
        {children}
      </main>

      {/* Simple Filter Bar - Always Visible at Bottom */}
      <div
        data-filter-container
        style={{
          position: 'fixed',
          bottom: '60px', // Further reduced - 56px ad + 4px gap
          left: 'var(--space-4)',
          right: 'var(--space-4)',
          zIndex: 'var(--z-fixed)',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-2)', // Reduced padding for more compact design
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(20px)',
          // iOS Safari specific fixes
          touchAction: 'pan-y',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          // GPU acceleration
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Region Filter */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className={activeFilter === 'region' ? 'btn btn--primary' : 'btn btn--ghost'}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                minHeight: '36px', // Optimized for compact design while maintaining touchability
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeFilter === 'region' ? 'var(--color-primary-600)' : 'var(--color-surface)',
                color: activeFilter === 'region' ? 'white' : 'var(--color-text-primary)',
                border: `1px solid ${activeFilter === 'region' ? 'var(--color-primary-600)' : 'var(--color-border-primary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-normal)',
                // Enhanced touch feedback
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'pan-y',
              }}
              onClick={() => setActiveFilter(activeFilter === 'region' ? null : 'region')}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                letterSpacing: '0.025em',
                lineHeight: '1.2'
              }}>
                {currentMapRegion}
              </span>
            </button>

            {/* Region Dropdown */}
            {activeFilter === 'region' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 12px)',
                  left: '0px',
                  right: '0px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 'var(--z-dropdown)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  WebkitBackdropFilter: 'blur(20px)',
                  backdropFilter: 'blur(20px)',
                  transform: 'translateY(0)',
                  WebkitTransform: 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  WebkitTransition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform',
                  minWidth: '160px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {regions.map((region) => (
                  <button
                    key={region.name}
                    className="btn btn--ghost"
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-4)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'center',
                      minHeight: '40px',
                      backgroundColor: selectedRegion === region.name ? 'var(--color-primary-50)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)',
                      gap: 'var(--space-2)',
                    }}
                    onClick={() => handleRegionSelect(region)}
                  >
                    <span style={{
                      fontWeight: '500',
                      fontSize: '13px',
                      lineHeight: '1.2',
                      letterSpacing: '0.01em',
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textDecoration: currentMapRegion === region.name ? 'underline' : 'none',
                      textDecorationColor: 'var(--color-primary-600)',
                      textDecorationThickness: '1px',
                      textUnderlineOffset: '1px'
                    }}>{region.name}</span>
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
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                minHeight: '36px', // Optimized for compact design while maintaining touchability
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeFilter === 'places' ? 'var(--color-primary-600)' : 'var(--color-surface)',
                color: activeFilter === 'places' ? 'white' : 'var(--color-text-primary)',
                border: `1px solid ${activeFilter === 'places' ? 'var(--color-primary-600)' : 'var(--color-border-primary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-normal)',
                // Enhanced touch feedback
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'pan-y',
              }}
              onClick={() => setActiveFilter(activeFilter === 'places' ? null : 'places')}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                letterSpacing: '0.025em',
                lineHeight: '1.2'
              }}>
                {selectedPlace}
              </span>
            </button>

            {/* Places Dropdown */}
            {activeFilter === 'places' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 12px)',
                  left: '0px',
                  right: '0px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 'var(--z-dropdown)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  WebkitBackdropFilter: 'blur(20px)',
                  backdropFilter: 'blur(20px)',
                  transform: 'translateY(0)',
                  WebkitTransform: 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  WebkitTransition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform',
                  minWidth: '160px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
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
                      textAlign: 'center',
                      minHeight: '44px',
                      backgroundColor: selectedPlace === place ? 'var(--color-primary-50)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)',
                    }}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <span style={{
                      fontWeight: '500',
                      fontSize: '14px',
                      lineHeight: '1.3',
                      letterSpacing: '0.025em',
                      textTransform: 'capitalize',
                      textDecoration: selectedPlace === place ? 'underline' : 'none',
                      textDecorationColor: 'var(--color-primary-600)',
                      textDecorationThickness: '2px',
                      textUnderlineOffset: '2px'
                    }}>{place}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              className={activeFilter === 'free' ? 'btn btn--primary' : 'btn btn--ghost'}
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                minHeight: '36px', // Optimized for compact design while maintaining touchability
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeFilter === 'free' ? 'var(--color-primary-600)' : 'var(--color-surface)',
                color: activeFilter === 'free' ? 'white' : 'var(--color-text-primary)',
                border: `1px solid ${activeFilter === 'free' ? 'var(--color-primary-600)' : 'var(--color-border-primary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-normal)',
                // Enhanced touch feedback
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'pan-y',
              }}
              onClick={() => setActiveFilter(activeFilter === 'free' ? null : 'free')}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                letterSpacing: '0.025em',
                lineHeight: '1.2'
              }}>
                {selectedPrice}
              </span>
            </button>

            {/* Price Options Dropdown */}
            {activeFilter === 'free' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 12px)',
                  left: '0px',
                  right: '0px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
                  zIndex: 'var(--z-dropdown)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  WebkitBackdropFilter: 'blur(20px)',
                  backdropFilter: 'blur(20px)',
                  transform: 'translateY(0)',
                  WebkitTransform: 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  WebkitTransition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform',
                  minWidth: '140px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {['Free Only', '$', '$$', '$$$', 'All Prices'].map((price) => (
                    <button
                      key={price}
                      className="btn btn--ghost"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        fontSize: 'var(--text-sm)',
                        textAlign: 'center',
                        minHeight: '44px',
                        backgroundColor: selectedPrice === price ? 'var(--color-primary-50)' : 'transparent',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                        border: selectedPrice === price ? '1px solid var(--color-primary-200)' : '1px solid transparent',
                        boxShadow: selectedPrice === price ? '0 2px 8px rgba(37, 99, 235, 0.1)' : 'none',
                      }}
                      onClick={() => {
                        setSelectedPrice(price)
                        setActiveFilter(null)
                      }}
                    >
                      <span style={{
                        fontWeight: 'var(--font-weight-medium)',
                        color: selectedPrice === price ? 'var(--color-primary-700)' : 'var(--color-text-primary)',
                        textDecoration: selectedPrice === price ? 'underline' : 'none',
                        textDecorationColor: 'var(--color-primary-600)',
                        textDecorationThickness: '2px',
                        textUnderlineOffset: '2px'
                      }}>
                        {price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Burger Menu Icon - Opens Premium Menu */}
          <button
            className="btn btn--ghost btn--icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open navigation menu with premium features"
            style={{
              padding: 'var(--space-2)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-lg)',
              minHeight: '36px',
              transition: 'all var(--transition-normal)',
              flex: '0 0 auto',
            }}
          >
            <Menu style={{ width: '14px', height: '14px', color: 'var(--color-text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* Locate Me Button - Positioned to not conflict with menu */}
      <button
        className="btn btn--primary"
        style={{
          position: 'absolute',
          bottom: '172px', // Adjusted for more compact layout
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
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(37, 99, 235, 0.95)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          WebkitTransition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform, box-shadow',
          // iOS Safari specific fixes
          touchAction: 'pan-y',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.webkitTransform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.4), 0 6px 20px rgba(37, 99, 235, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.webkitTransform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 99, 235, 0.3), 0 4px 16px rgba(37, 99, 235, 0.2)'
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.webkitTransform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.4), 0 6px 20px rgba(37, 99, 235, 0.3)'
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.webkitTransform = 'translateY(0)'
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

      
      {/* Integrated Premium Menu with Embedded Ads */}
      {isMenuOpen && (
        <div
          data-menu-container
          style={{
            position: 'fixed',
            bottom: 'calc(140px + var(--space-3))', // Position above AdSense ad area
            left: 'var(--space-4)',
            right: 'var(--space-4)',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-4)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)',
            zIndex: 'var(--z-dropdown)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            WebkitBackdropFilter: 'blur(20px)',
            backdropFilter: 'blur(20px)',
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
            WebkitTransform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            WebkitTransition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform, opacity',
            maxHeight: 'calc(100dvh - 280px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
          }}>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.025em',
              lineHeight: '1.3',
            }}>
              Menu & Premium Features
            </div>
            <button
              className="btn btn--ghost btn--icon"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              style={{
                padding: 'var(--space-1)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-gray-100)',
              }}
            >
              <X style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
            </button>
          </div>

          {/* Premium Features Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.05) 0%, rgba(31, 41, 55, 0.05) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-3)',
            }}>
              <div style={{
                fontSize: '20px',
              }}>✨</div>
              <div style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.05em',
                lineHeight: '1.2',
              }}>
                Premium Features
              </div>
            </div>

            {/* Premium Feature Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Premium Spots */}
              <button
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  transition: 'all var(--transition-normal)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => handlePremiumFeatureClick('Premium Spots')}
              >
                <div style={{
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  🎯
                </div>
                <div style={{
                  textAlign: 'left',
                  flex: 1,
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: '3px',
                    letterSpacing: '0.025em',
                    lineHeight: '1.3',
                  }}>
                    Premium Spots
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.01em',
                    lineHeight: '1.4',
                  }}>
                    Hidden gems & exclusive locations
                  </div>
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--color-primary-600)',
                  fontWeight: '700',
                  backgroundColor: 'var(--color-primary-50)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.075em',
                  lineHeight: '1',
                  textTransform: 'uppercase',
                }}>
                  PRO
                </div>
              </button>

              {/* Food Tours */}
              <button
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  transition: 'all var(--transition-normal)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => handlePremiumFeatureClick('Food Tours')}
              >
                <div style={{
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  🍴
                </div>
                <div style={{
                  textAlign: 'left',
                  flex: 1,
                }}>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px',
                  }}>
                    Food Tours
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                  }}>
                    Curated culinary experiences
                  </div>
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-blue-600)',
                  fontWeight: 'var(--font-weight-semibold)',
                  backgroundColor: 'var(--color-blue-50)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  PRO
                </div>
              </button>

              {/* Local Guides */}
              <button
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  transition: 'all var(--transition-normal)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => handlePremiumFeatureClick('Local Guides')}
              >
                <div style={{
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  🚗
                </div>
                <div style={{
                  textAlign: 'left',
                  flex: 1,
                }}>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px',
                  }}>
                    Local Guides
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                  }}>
                    Expert tips & insider knowledge
                  </div>
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-green-600)',
                  fontWeight: 'var(--font-weight-semibold)',
                  backgroundColor: 'var(--color-green-50)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  PRO
                </div>
              </button>
            </div>

            {/* Upgrade CTA */}
            <button
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-blue-600) 100%)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3)',
                marginTop: 'var(--space-3)',
                color: 'white',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-bold)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onClick={() => handlePremiumFeatureClick('Upgrade')}
            >
              🔓 Upgrade to Premium
            </button>
          </div>

          {/* Regular Navigation Items */}
          <div>
            <div style={{
              height: '1px',
              backgroundColor: 'var(--color-border-primary)',
              marginBottom: 'var(--space-3)',
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
        </div>
      )}

      {/* AdSense Contextual Ad Area - Behind Menu Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm border-t border-border/30 z-10 ios-safe-area-bottom"
        style={{
          height: '56px', // Further reduced from 72px to minimize footer space
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.9) 100%)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08), 0 -2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="container mx-auto px-3 py-1 h-full flex items-center justify-center">
          <div className="w-full max-w-md mx-auto flex items-center justify-center gap-3">
            {/* Ad Label */}
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider whitespace-nowrap">
              Ad
            </div>

            {/* AdSense Ad with Contextual Targeting */}
            <ins
              className="adsbygoogle block flex-1"
              style={{
                display: 'block',
                height: '50px',
                maxWidth: '100%',
                textAlign: 'center',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                overflow: 'hidden'
              }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="horizontal"
              data-full-width-responsive="false"
              data-adtest="on" // Remove this for production
              {...generateAdTargeting()}
            />

            {/* Contextual Info - simplified */}
            <div className="text-xs text-gray-400 italic text-center max-w-xs truncate whitespace-nowrap">
              {selectedPlace} • {currentMapRegion}
            </div>
          </div>
        </div>
      </div>

      </div>
  )
}
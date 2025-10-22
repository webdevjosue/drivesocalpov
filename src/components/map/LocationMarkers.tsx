/**
 * Location Markers Component - Real Database Integration
 * Replaces mock markers with real Supabase location data
 * Mobile-optimized with clustering and performance monitoring
 */

'use client'

import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Marker } from '@vis.gl/react-maplibre'
import { useSecureLocations } from '@/hooks/useSecureLocations'
import { useNavigation } from '@/hooks/useNavigation'
import { transformLocationToMarker } from '@/lib/services/secure-location-service'

// Marker component types
interface LocationMarkerProps {
  marker: NonNullable<ReturnType<typeof import('@/lib/services/secure-location-service').transformLocationToMarker>>
  isSelected: boolean
  onSelect: (marker: LocationMarkerProps['marker']) => void
  onDeselect: () => void
  showPopup?: boolean
}

// Marker icons by category
const MARKER_ICONS = {
  food: '🍴',
  attractions: '🎢',
  beaches: '🏖️',
  museums: '🏛️',
  hiking: '🥾',
  shopping: '🛍️',
  entertainment: '🎭',
  events: '📅',
  unknown: '📍'
} as const

// Marker colors by type
const MARKER_COLORS = {
  food: '#FF6B6B',
  attractions: '#4ECDC4',
  beaches: '#45B7D1',
  museums: '#96CEB4',
  hiking: '#88D8B0',
  shopping: '#FFB6C1',
  entertainment: '#DDA0DD',
  events: '#F0E68C',
  unknown: '#95A5A6'
} as const

// Mobile-optimized marker component
function LocationMarker({ marker, isSelected, onSelect, onDeselect, showPopup = true }: LocationMarkerProps) {

  // Get marker icon and color
  const icon = MARKER_ICONS[marker.category as keyof typeof MARKER_ICONS] || MARKER_ICONS.unknown
  const color = MARKER_COLORS[marker.category as keyof typeof MARKER_COLORS] || MARKER_COLORS.unknown

  // Handle marker click with mobile optimization
  const handleClick = useCallback(() => {
    if (isSelected) {
      onDeselect()
    } else {
      onSelect(marker)
    }
  }, [isSelected, onSelect, onDeselect, marker])

  
  // Popup content
  const popupContent = useMemo(() => {
    if (!showPopup) return null

    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          maxWidth: '280px',
          minWidth: '200px',
          transform: 'translateY(-8px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#2C3E50',
              lineHeight: '1.2',
              marginBottom: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {marker.name}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#7F8C8D',
              fontWeight: '500'
            }}>
              {marker.region}
            </div>
          </div>
        </div>

        {/* Description */}
        {marker.description && (
          <div style={{
            fontSize: '12px',
            color: '#5D6D7E',
            lineHeight: '1.4',
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {marker.description}
          </div>
        )}

        {/* Meta info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}>
          {marker.rating > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: '#F39C12',
              fontWeight: '600'
            }}>
              ⭐ {marker.rating.toFixed(1)}
            </div>
          )}
          {marker.isFree && (
            <div style={{
              fontSize: '10px',
              backgroundColor: '#27AE60',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              FREE
            </div>
          )}
          {marker.isPremium && (
            <div style={{
              fontSize: '10px',
              backgroundColor: '#9B59B6',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              PRO
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          <button
            style={{
              flex: 1,
              padding: '6px 12px',
              backgroundColor: color,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onClick={() => {
              // TODO: Navigate to location details
              console.log('Navigate to location:', marker.id)
            }}
          >
            View Details
          </button>
          <button
            style={{
              padding: '6px 12px',
              backgroundColor: '#ECF0F1',
              color: '#2C3E50',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#BDC3C7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ECF0F1'
            }}
            onClick={() => {
              // TODO: Get directions
              console.log('Get directions to:', marker.id)
            }}
          >
            Directions
          </button>
        </div>
      </div>
    )
  }, [marker, icon, color, showPopup])

  return (
    <Marker
      longitude={marker.coordinates[0]}
      latitude={marker.coordinates[1]}
      anchor="bottom"
      style={{
        cursor: 'pointer',
        zIndex: isSelected ? 1000 : 1,
        transition: 'all 0.2s ease',
      }}
      onClick={handleClick}
          >
      {/* Marker container */}
      <div
        style={{
          position: 'relative',
          transform: isSelected ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.2s ease',
          filter: isSelected ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        }}
      >
        {/* Marker pin */}
        <div
          style={{
            width: '32px',
            height: '40px',
            position: 'relative',
          }}
        >
          {/* Pin body */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              width: '24px',
              height: '24px',
              backgroundColor: color,
              borderRadius: '50% 50% 50% 0',
              transform: 'translateX(-50%) rotate(-45deg)',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          />

          {/* Icon overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '14px',
              zIndex: 1,
            }}
          >
            {icon}
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '50%',
                width: '32px',
                height: '32px',
                border: '3px solid white',
                borderRadius: '50%',
                boxShadow: '0 0 0 2px ' + color,
                animation: 'pulse 2s infinite',
              }}
            />
          )}
        </div>

        {/* Popup */}
        {isSelected && popupContent && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              zIndex: 1000,
            }}
          >
            {popupContent}
          </div>
        )}
      </div>

      {/* Pulse animation for selected marker */}
      {isSelected && (
        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: translateX(-50%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translateX(-50%) scale(1.2);
              opacity: 0.7;
            }
            100% {
              transform: translateX(-50%) scale(1);
              opacity: 1;
            }
          }
        `}</style>
      )}
    </Marker>
  )
}

// Main LocationMarkers component
export function LocationMarkers() {
  const { locations, loading, error } = useSecureLocations()
  const { navState } = useNavigation()
  const selectedRegion = navState.selectedRegion || 'Los Angeles'

  // Transform locations to markers for map display
  const markers = useMemo(() => {
    if (!locations) return []
    return locations.map(transformLocationToMarker)
  }, [locations])
  const selectedCategory = navState.selectedCategory || 'all'
  const selectedPriceFilter = navState.selectedPriceFilter || 'All Prices'
  const [selectedMarker, setSelectedMarker] = useState<LocationMarkerProps['marker'] | null>(null)

  // Filter markers based on navigation state
  const filteredMarkers = useMemo(() => {
    return markers.filter(marker => {
      if (!marker) return false

      // Region filter
      if (selectedRegion !== 'All Regions' && marker.region !== selectedRegion) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'all' && marker.category !== selectedCategory) {
        return false
      }

      // Price filter
      if (selectedPriceFilter === 'Free Only' && !marker.isFree) {
        return false
      }
      if (selectedPriceFilter !== 'Free Only' && selectedPriceFilter !== 'All Prices') {
        const priceLevel = selectedPriceFilter.length // $ = 1, $$ = 2, etc.
        if (marker.price_level !== priceLevel) {
          return false
        }
      }

      return true
    })
  }, [markers, selectedRegion, selectedCategory, selectedPriceFilter])

  // Handle marker selection
  const handleMarkerSelect = useCallback((marker: LocationMarkerProps['marker']) => {
    setSelectedMarker(marker)

    // Fly to marker location
    const map = (window as any).__debugMap
    if (map) {
      map.flyTo({
        center: marker.coordinates,
        zoom: 15,
        bearing: 0,
        pitch: 0,
        duration: 800,
        essential: true
      })
    }
  }, [])

  const handleMarkerDeselect = useCallback(() => {
    setSelectedMarker(null)
  }, [])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedMarker(null)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Performance optimization: limit markers on mobile
  const visibleMarkers = useMemo(() => {
    // On mobile, show max 50 markers for performance
    const isMobile = window.innerWidth < 768
    return isMobile ? filteredMarkers.slice(0, 50) : filteredMarkers
  }, [filteredMarkers])

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #3498DB',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '14px', color: '#2C3E50', fontWeight: '500' }}>
            Loading locations...
          </span>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#E74C3C',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(231, 76, 60, 0.3)',
          zIndex: 1000,
          maxWidth: '300px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          Error loading locations
        </div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          {error}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Render location markers */}
      {visibleMarkers.filter((marker): marker is NonNullable<typeof marker> => Boolean(marker)).map((marker) => (
        <LocationMarker
          key={marker.id}
          marker={marker}
          isSelected={selectedMarker?.id === marker.id}
          onSelect={handleMarkerSelect}
          onDeselect={handleMarkerDeselect}
        />
      ))}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            zIndex: 1000,
          }}
        >
          <div>Markers: {visibleMarkers.length}</div>
          <div>Selected: {selectedRegion}</div>
          <div>Category: {selectedCategory}</div>
          <div>Price: {selectedPriceFilter}</div>
        </div>
      )}
    </>
  )
}

export default LocationMarkers
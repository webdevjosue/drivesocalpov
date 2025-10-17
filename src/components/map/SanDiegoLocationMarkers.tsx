/**
 * San Diego Location Markers Component
 * Displays real location data from Supabase database on the map
 * Replaces mock data with actual San Diego locations
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Marker, Popup } from '@vis.gl/react-maplibre'
import { Pin, Star, Heart, Navigation, ExternalLink } from 'lucide-react'
import { fetchLocationMarkers } from '@/lib/services/location-service'

// Filter interface
interface FilterState {
  region?: string
  category: string
  price: string
}

// Location marker data structure from API - matches transformLocationToMarker return type
interface LocationMarker {
  id: string
  name: string
  coordinates: [number, number]
  category: string
  type: string
  description: string
  rating: number
  isFree: boolean
  isPremium: boolean
  region: string
  address?: string | null
  phone?: string | null
  website?: string | null
  photos: string[]
  amenities: string[]
  hours?: unknown
  price_level?: number | null
  review_count: number
  _source?: any // LocationWithCategories from the database
}

interface SanDiegoLocationMarkersProps {
  showPopups?: boolean
  onMarkerClick?: (location: LocationMarker) => void
  filters?: FilterState
}

export default function SanDiegoLocationMarkers({
  showPopups = true,
  onMarkerClick,
  filters = { region: 'San Diego', category: 'All Categories', price: 'All Prices' }
}: SanDiegoLocationMarkersProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [locations, setLocations] = useState<LocationMarker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch locations when filters change
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build filter parameters for the API call
        const apiFilters: Record<string, string | boolean | number> = {}
        if (filters?.region) {
          apiFilters.region = filters.region
        }
        if (filters?.category && filters.category !== 'All Categories') {
          apiFilters.category_id = filters.category // This would need to be converted to category ID
        }
        if (filters?.price && filters.price !== 'All Prices') {
          if (filters.price === 'Free Only') {
            apiFilters.is_free = true
          }
        }

        const { markers, error } = await fetchLocationMarkers(apiFilters)

        if (error) {
          setError(error)
          console.error(`Failed to load locations for ${filters?.region || 'San Diego'}:`, error)
        } else {
          setLocations(markers as LocationMarker[])
          console.log(`Loaded ${markers.length} locations for ${filters?.region || 'San Diego'} from database`, markers)
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load locations'
        setError(errorMsg)
        console.error(`Error loading locations for ${filters?.region || 'San Diego'}:`, err)
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [filters?.region, filters?.category, filters?.price])

  // Filter locations based on filter props
  const filteredLocations = React.useMemo(() => {
    return locations.filter((location) => {
      // Category filter
      if (filters.category && filters.category !== 'All Categories' && location.category !== filters.category) {
        return false
      }

      // Price filter
      if (filters.price) {
        if (filters.price === 'Free Only' && !location.isFree) {
          return false
        } else if (filters.price === '$' && (!location.isFree || location.rating > 3.5)) {
          return false
        } else if (filters.price === '$$' && (!location.isFree || location.rating > 4.0)) {
          return false
        } else if (filters.price === '$$$' && location.isFree) {
          return false
        }
      }

      return true
    })
  }, [locations, filters])

  // Render marker content
  const renderMarkerContent = (location: LocationMarker) => {
    return (
      <div className="relative flex items-center justify-center" style={{
        transform: 'translate(-50%, -100%)',
        WebkitTransform: 'translate(-50%, -100%)'
      }}>
        {/* Pulsing effect */}
        <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md animate-pulse" style={{
          width: '40px',
          height: '40px',
          transform: 'translate(-50%, -50%)',
          WebkitTransform: 'translate(-50%, -50%)'
        }}></div>

        {/* Marker pin */}
        <div className={`relative bg-white rounded-full shadow-lg border-2 ${
          location.isFree ? 'border-green-500' : 'border-blue-500'
        }`} style={{
          padding: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '2px solid',
          minWidth: '32px',
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Pin className={`w-4 h-4 ${
            location.type === 'beaches' ? 'text-blue-600' :
            location.type === 'museums' ? 'text-purple-600' :
            location.type === 'parks-recreation' ? 'text-green-600' :
            location.type === 'attractions' ? 'text-red-600' :
            location.type === 'outdoor-activities' ? 'text-orange-600' :
            'text-gray-600'
          }`} style={{
            strokeWidth: 2.5
          }} />
        </div>

        {/* FREE badge for free locations */}
        {location.isFree && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full" style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            F
          </div>
        )}

        {/* Premium badge for premium locations */}
        {location.isPremium && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full" style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            P
          </div>
        )}
      </div>
    )
  }

  // Handle marker click
  const handleMarkerClick = (location: LocationMarker) => {
    setSelectedLocation(location.id === selectedLocation ? null : location.id)
    onMarkerClick?.(location)
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }}></div>
        <span>Loading {filters?.region || 'San Diego'} locations...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(239, 68, 68, 0.95)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontSize: '14px',
        fontWeight: '500',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>⚠️ Error: {error}</span>
      </div>
    )
  }

  return (
    <>
      {/* Filter Results Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: filteredLocations.length > 0 ? '#10b981' : '#ef4444',
          borderRadius: '50%',
          animation: filteredLocations.length > 0 ? 'pulse 2s infinite' : 'none'
        }}></div>
        <span>
          {filteredLocations.length === 0
            ? `No ${filters?.region || 'San Diego'} locations found`
            : `${filteredLocations.length} ${filters?.region || 'San Diego'} location${filteredLocations.length === 1 ? '' : 's'} found`
          }
        </span>
      </div>

      {/* Location markers */}
      {filteredLocations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.coordinates[0] as number}
          latitude={location.coordinates[1] as number}
          anchor="bottom"
          onClick={() => handleMarkerClick(location)}
        >
          {renderMarkerContent(location)}
        </Marker>
      ))}

      {/* Popups for selected locations */}
      {showPopups && selectedLocation && (
        filteredLocations
          .filter(loc => loc.id === selectedLocation)
          .map((location) => (
            <Popup
              key={`popup-${location.id}`}
              longitude={location.coordinates[0] as number}
              latitude={location.coordinates[1] as number}
              anchor="bottom"
              onClose={() => setSelectedLocation(null)}
              className="location-popup"
              closeButton={true}
              closeOnClick={false}
              offset={[0, -10]}
              style={{
                maxWidth: '360px',
                minWidth: '300px'
              }}
            >
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}>
                {/* Header with name and rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '6px',
                      lineHeight: '1.3',
                      letterSpacing: '-0.01em'
                    }}>
                      {location.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        letterSpacing: '0.025em',
                        backgroundColor:
                          location.type === 'beaches' ? '#dbeafe' :
                          location.type === 'museums' ? '#f3e8ff' :
                          location.type === 'parks-recreation' ? '#dcfce7' :
                          location.type === 'attractions' ? '#fee2e2' :
                          location.type === 'outdoor-activities' ? '#fed7aa' :
                          '#f3f4f6',
                        color:
                          location.type === 'beaches' ? '#1e40af' :
                          location.type === 'museums' ? '#6b21a8' :
                          location.type === 'parks-recreation' ? '#166534' :
                          location.type === 'attractions' ? '#b91c1c' :
                          location.type === 'outdoor-activities' ? '#c2410c' :
                          '#374151'
                      }}>
                        {location.type.replace(/-/g, ' ')}
                      </span>
                      {location.isFree && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '700',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase'
                        }}>
                          FREE
                        </span>
                      )}
                      {location.isPremium && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '700',
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase'
                        }}>
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#fef3c7',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}>
                    <Star style={{
                      width: '14px',
                      height: '14px',
                      color: '#f59e0b',
                      fill: 'currentColor'
                    }} />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#92400e'
                    }}>
                      {location.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {location.description && (
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#4b5563',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {location.description}
                  </p>
                )}

                {/* Contact info */}
                <div style={{
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  {location.address && (
                    <div style={{ marginBottom: '4px' }}>
                      📍 {location.address}
                    </div>
                  )}
                  {location.phone && (
                    <div style={{ marginBottom: '4px' }}>
                      📞 {location.phone}
                    </div>
                  )}
                  {location.review_count > 0 && (
                    <div>
                      ⭐ {location.review_count} reviews
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button style={{
                    flex: 1,
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  >
                    <Navigation style={{ width: '16px', height: '16px' }} />
                    Directions
                  </button>
                  {location.website && (
                    <button style={{
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onClick={() => location.website && window.open(location.website, '_blank')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                      e.currentTarget.style.color = '#ef4444'
                      e.currentTarget.style.borderColor = '#fecaca'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.color = '#6b7280'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                      e.currentTarget.style.color = '#ef4444'
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.color = '#6b7280'
                    }}
                    >
                      <ExternalLink style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                  <button style={{
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                    e.currentTarget.style.color = '#ef4444'
                    e.currentTarget.style.borderColor = '#fecaca'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.color = '#6b7280'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                    e.currentTarget.style.color = '#ef4444'
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.color = '#6b7280'
                  }}
                  >
                    <Heart style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            </Popup>
          ))
      )}

      {/* Custom styles for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}
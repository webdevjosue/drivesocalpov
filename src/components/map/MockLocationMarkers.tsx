/**
 * Mock Location Markers Component
 * Adds sample location markers to the map for testing and demonstration
 */

'use client'

import React from 'react'
import { Marker, Popup } from '@vis.gl/react-maplibre'
import { Pin, Star, Heart, Navigation } from 'lucide-react'

// Mock location data for Southern California
const mockLocations = [
  // San Diego Locations
  {
    id: 1,
    name: "Balboa Park",
    category: "attractions",
    coordinates: [-117.1611, 32.7343],
    description: "Historic urban cultural park with museums, gardens, and attractions",
    rating: 4.8,
    isFree: true,
    type: "park",
    region: "San Diego"
  },
  {
    id: 2,
    name: "San Diego Zoo",
    category: "attractions",
    coordinates: [-117.1617, 32.7357],
    description: "World-famous zoo with over 12,000 animals",
    rating: 4.7,
    isFree: false,
    type: "zoo",
    region: "San Diego"
  },
  {
    id: 3,
    name: "USS Midway Museum",
    category: "museums",
    coordinates: [-117.1750, 32.7143],
    description: "Historic naval aircraft carrier museum",
    rating: 4.6,
    isFree: false,
    type: "museum",
    region: "San Diego"
  },
  {
    id: 4,
    name: "La Jolla Cove",
    category: "beaches",
    coordinates: [-117.2719, 32.8328],
    description: "Beautiful cove with clear water and sea lions",
    rating: 4.7,
    isFree: true,
    type: "beach",
    region: "San Diego"
  },
  {
    id: 5,
    name: "Gaslamp Quarter",
    category: "bars",
    coordinates: [-117.1627, 32.7128],
    description: "Historic downtown district with dining and nightlife",
    rating: 4.5,
    isFree: false,
    type: "district",
    region: "San Diego"
  },

  // Los Angeles Locations
  {
    id: 6,
    name: "Santa Monica Pier",
    category: "attractions",
    coordinates: [-118.4976, 34.0089],
    description: "Iconic pier with amusement park and ocean views",
    rating: 4.6,
    isFree: true,
    type: "pier",
    region: "Los Angeles"
  },
  {
    id: 7,
    name: "Griffith Observatory",
    category: "museums",
    coordinates: [-118.2943, 34.1184],
    description: "Observatory with planetarium and city views",
    rating: 4.8,
    isFree: true,
    type: "observatory",
    region: "Los Angeles"
  },
  {
    id: 8,
    name: "Hollywood Walk of Fame",
    category: "attractions",
    coordinates: [-118.3394, 34.1015],
    description: "Famous sidewalk with celebrity stars",
    rating: 4.3,
    isFree: true,
    type: "landmark",
    region: "Los Angeles"
  },
  {
    id: 9,
    name: "Getty Center",
    category: "museums",
    coordinates: [-118.4731, 34.0786],
    description: "Art museum with architecture and gardens",
    rating: 4.7,
    isFree: true,
    type: "museum",
    region: "Los Angeles"
  },
  {
    id: 10,
    name: "Venice Beach",
    category: "beaches",
    coordinates: [-118.4695, 33.9850],
    description: "Famous beach with boardwalk and street performers",
    rating: 4.4,
    isFree: true,
    type: "beach",
    region: "Los Angeles"
  },
  {
    id: 11,
    name: "The Getty Villa",
    category: "museums",
    coordinates: [-118.5637, 34.0536],
    description: "Art museum with Greek and Roman artifacts",
    rating: 4.6,
    isFree: false,
    type: "museum",
    region: "Los Angeles"
  },
  {
    id: 12,
    name: "Santa Monica Beach",
    category: "beaches",
    coordinates: [-118.5149, 34.0195],
    description: "Wide sandy beach with pier and ocean views",
    rating: 4.5,
    isFree: true,
    type: "beach",
    region: "Los Angeles"
  },

  // Food locations
  {
    id: 13,
    name: "Phil's BBQ",
    category: "food",
    coordinates: [-117.1627, 32.7128],
    description: "Famous BBQ restaurant with local atmosphere",
    rating: 4.6,
    isFree: false,
    type: "restaurant",
    region: "San Diego"
  },
  {
    id: 14,
    name: "Grand Central Market",
    category: "food",
    coordinates: [-118.2437, 34.0502],
    description: "Historic food hall with diverse vendors",
    rating: 4.4,
    isFree: false,
    type: "market",
    region: "Los Angeles"
  },

  // Bars locations
  {
    id: 15,
    name: "The Whiskey House",
    category: "bars",
    coordinates: [-117.1611, 32.7343],
    description: "Local whiskey bar with extensive selection",
    rating: 4.3,
    isFree: false,
    type: "bar",
    region: "San Diego"
  },
  {
    id: 16,
    name: "The Varnish",
    category: "bars",
    coordinates: [-118.2498, 34.0506],
    description: "Speakeasy-style cocktail bar",
    rating: 4.7,
    isFree: false,
    type: "bar",
    region: "Los Angeles"
  },

  // Events locations
  {
    id: 17,
    name: "San Diego County Fair",
    category: "events",
    coordinates: [-117.1611, 32.7343],
    description: "Annual county fair with rides and entertainment",
    rating: 4.2,
    isFree: false,
    type: "event",
    region: "San Diego"
  },
  {
    id: 18,
    name: "Coachella Music Festival",
    category: "events",
    coordinates: [-116.2392, 33.6803],
    description: "Famous music and arts festival",
    rating: 4.8,
    isFree: false,
    type: "festival",
    region: "Inland Empire"
  }
]

// Filter interface
interface FilterState {
  region: string
  category: string
  price: string
}

interface MockLocationMarkersProps {
  showPopups?: boolean
  onMarkerClick?: (location: any) => void
  filters?: FilterState
}

export default function MockLocationMarkers({
  showPopups = true,
  onMarkerClick,
  filters = { region: 'Los Angeles', category: 'food', price: 'All Prices' }
}: MockLocationMarkersProps) {
  const [selectedLocation, setSelectedLocation] = React.useState<number | null>(null)

  // Filter locations based on filter props
  const filteredLocations = React.useMemo(() => {
    return mockLocations.filter((location) => {
      // Region filter
      if (filters.region && filters.region !== 'All Regions' && location.region !== filters.region) {
        return false
      }

      // Category filter
      if (filters.category && filters.category !== 'All Categories' && location.category !== filters.category) {
        return false
      }

      // Price filter
      if (filters.price) {
        if (filters.price === 'Free Only' && !location.isFree) {
          return false
        } else if (filters.price === '$' && (location.isFree || location.rating > 3.5)) {
          return false
        } else if (filters.price === '$$' && (location.isFree || location.rating > 4.0)) {
          return false
        } else if (filters.price === '$$$' && location.isFree) {
          return false
        }
      }

      return true
    })
  }, [filters])

  // Render marker content
  const renderMarkerContent = (location: any) => {
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
            location.type === 'beach' ? 'text-blue-600' :
            location.type === 'museum' ? 'text-purple-600' :
            location.type === 'park' ? 'text-green-600' :
            location.type === 'observatory' ? 'text-yellow-600' :
            'text-red-600'
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
      </div>
    )
  }

  // Handle marker click
  const handleMarkerClick = (location: any) => {
    setSelectedLocation(location.id === selectedLocation ? null : location.id)
    onMarkerClick?.(location)
  }

  console.log(`Filtered to ${filteredLocations.length} locations with filters:`, filters)

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
            ? 'No locations found'
            : `${filteredLocations.length} location${filteredLocations.length === 1 ? '' : 's'} found`
          }
        </span>
      </div>

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
                maxWidth: '320px',
                minWidth: '280px'
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
                          location.type === 'beach' ? '#dbeafe' :
                          location.type === 'museum' ? '#f3e8ff' :
                          location.type === 'park' ? '#dcfce7' :
                          location.type === 'observatory' ? '#fef3c7' :
                          '#fee2e2',
                        color:
                          location.type === 'beach' ? '#1e40af' :
                          location.type === 'museum' ? '#6b21a8' :
                          location.type === 'park' ? '#166534' :
                          location.type === 'observatory' ? '#d97706' :
                          '#b91c1c'
                      }}>
                        {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
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
                      {location.rating}
                    </span>
                  </div>
                </div>

                {/* Description */}
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
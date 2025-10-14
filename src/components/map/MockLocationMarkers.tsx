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
    category: "attraction",
    coordinates: [-117.1611, 32.7343],
    description: "Historic urban cultural park with museums, gardens, and attractions",
    rating: 4.8,
    isFree: true,
    type: "park"
  },
  {
    id: 2,
    name: "San Diego Zoo",
    category: "attraction",
    coordinates: [-117.1617, 32.7357],
    description: "World-famous zoo with over 12,000 animals",
    rating: 4.7,
    isFree: false,
    type: "zoo"
  },
  {
    id: 3,
    name: "USS Midway Museum",
    category: "attraction",
    coordinates: [-117.1750, 32.7143],
    description: "Historic naval aircraft carrier museum",
    rating: 4.6,
    isFree: false,
    type: "museum"
  },
  {
    id: 4,
    name: "La Jolla Cove",
    category: "beach",
    coordinates: [-117.2719, 32.8328],
    description: "Beautiful cove with clear water and sea lions",
    rating: 4.7,
    isFree: true,
    type: "beach"
  },
  {
    id: 5,
    name: "Gaslamp Quarter",
    category: "entertainment",
    coordinates: [-117.1627, 32.7128],
    description: "Historic downtown district with dining and nightlife",
    rating: 4.5,
    isFree: true,
    type: "district"
  },

  // Los Angeles Locations
  {
    id: 6,
    name: "Santa Monica Pier",
    category: "attraction",
    coordinates: [-118.4976, 34.0089],
    description: "Iconic pier with amusement park and ocean views",
    rating: 4.6,
    isFree: true,
    type: "pier"
  },
  {
    id: 7,
    name: "Griffith Observatory",
    category: "attraction",
    coordinates: [-118.2943, 34.1184],
    description: "Observatory with planetarium and city views",
    rating: 4.8,
    isFree: true,
    type: "observatory"
  },
  {
    id: 8,
    name: "Hollywood Walk of Fame",
    category: "attraction",
    coordinates: [-118.3394, 34.1015],
    description: "Famous sidewalk with celebrity stars",
    rating: 4.3,
    isFree: true,
    type: "landmark"
  },
  {
    id: 9,
    name: "Getty Center",
    category: "museum",
    coordinates: [-118.4731, 34.0786],
    description: "Art museum with architecture and gardens",
    rating: 4.7,
    isFree: true,
    type: "museum"
  },
  {
    id: 10,
    name: "Venice Beach",
    category: "beach",
    coordinates: [-118.4695, 33.9850],
    description: "Famous beach with boardwalk and street performers",
    rating: 4.4,
    isFree: true,
    type: "beach"
  }
]

interface MockLocationMarkersProps {
  showPopups?: boolean
  onMarkerClick?: (location: any) => void
}

export default function MockLocationMarkers({
  showPopups = true,
  onMarkerClick
}: MockLocationMarkersProps) {
  const [selectedLocation, setSelectedLocation] = React.useState<number | null>(null)

  // Render marker content
  const renderMarkerContent = (location: any) => {
    return (
      <div className="relative flex items-center justify-center gta-marker">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
        <div className={`relative bg-white rounded-full p-2 shadow-lg border-2 ${
          location.isFree ? 'border-green-400' : 'border-blue-400'
        }`}>
          <Pin className={`w-4 h-4 ${
            location.type === 'beach' ? 'text-blue-500' :
            location.type === 'museum' ? 'text-purple-500' :
            location.type === 'park' ? 'text-green-500' :
            location.type === 'observatory' ? 'text-yellow-500' :
            'text-red-500'
          }`} />
        </div>
      </div>
    )
  }

  // Handle marker click
  const handleMarkerClick = (location: any) => {
    setSelectedLocation(location.id === selectedLocation ? null : location.id)
    onMarkerClick?.(location)
  }

  return (
    <>
      {mockLocations.map((location) => (
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
        mockLocations
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
            >
              <div className="p-3 min-w-72 max-w-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {location.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        location.type === 'beach' ? 'bg-blue-100 text-blue-700' :
                        location.type === 'museum' ? 'bg-purple-100 text-purple-700' :
                        location.type === 'park' ? 'bg-green-100 text-green-700' :
                        location.type === 'observatory' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                      </span>
                      {location.isFree && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          FREE
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{location.rating}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {location.description}
                </p>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Directions
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Popup>
          ))
      )}
    </>
  )
}
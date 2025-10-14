/**
 * Drive SoCal POV - Home Page
 * Mobile-first travel guide with interactive map
 */

'use client'

import React, { useEffect } from 'react'
import MapContainer from '@/components/map/MapContainer'
import MobileLayout from '@/components/layout/MobileLayout'
import MockLocationMarkers from '@/components/map/MockLocationMarkers'
import { validateMapEnvironment } from '@/lib/map/config'

export default function Home() {
  // Validate OpenStreetMap environment on app load
  useEffect(() => {
    validateMapEnvironment()
  }, [])

  const handleMarkerClick = (location: any) => {
    console.log('Location clicked:', location.name)
    // TODO: Show location details or navigate to location page
  }

  return (
    <MobileLayout
      title="Drive SoCal POV"
    >
      {/* Map Container - Full Width */}
      <MapContainer
        className="w-full h-full"
        showControls={true}
        enablePerformanceMode={true}
      >
        {/* Mock Location Markers */}
        <MockLocationMarkers
          showPopups={true}
          onMarkerClick={handleMarkerClick}
        />
      </MapContainer>
    </MobileLayout>
  )
}
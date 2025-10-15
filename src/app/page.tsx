/**
 * Drive SoCal POV - Home Page
 * Mobile-first travel guide with interactive map
 */

'use client'

import React, { useEffect, useState } from 'react'
import MapContainer from '@/components/map/MapContainer'
import MobileLayout from '@/components/layout/MobileLayout'
import MockLocationMarkers from '@/components/map/MockLocationMarkers'
import { validateMapEnvironment } from '@/lib/map/config'

// Filter state interface
interface FilterState {
  region: string
  category: string
  price: string
}

export default function Home() {
  // Validate OpenStreetMap environment on app load
  useEffect(() => {
    validateMapEnvironment()
  }, [])

  // Filter state to pass to markers
  const [filters, setFilters] = useState<FilterState>({
    region: 'Los Angeles',
    category: 'food',
    price: 'All Prices'
  })

  // Listen for filter changes from MobileLayout
  useEffect(() => {
    const handleFilterChange = () => {
      // Get current filter values from localStorage or global state
      const selectedRegion = localStorage.getItem('selectedRegion') || 'Los Angeles'
      const selectedCategory = localStorage.getItem('selectedCategory') || 'food'
      const selectedPrice = localStorage.getItem('selectedPrice') || 'All Prices'

      setFilters({
        region: selectedRegion,
        category: selectedCategory,
        price: selectedPrice
      })
    }

    // Listen for custom filter change events
    const filterListener = (event: CustomEvent) => {
      setFilters(event.detail)
    }

    // Initial filter setup
    handleFilterChange()

    // Listen for filter changes
    window.addEventListener('filterChange', filterListener as EventListener)

    // Also listen for storage changes (for cross-tab sync)
    const storageListener = () => {
      handleFilterChange()
    }
    window.addEventListener('storage', storageListener)

    // Check for filter updates periodically
    const interval = setInterval(() => {
      const newFilters = {
        region: localStorage.getItem('selectedRegion') || 'Los Angeles',
        category: localStorage.getItem('selectedCategory') || 'food',
        price: localStorage.getItem('selectedPrice') || 'All Prices'
      }

      // Only update if filters actually changed
      if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
        setFilters(newFilters)
      }
    }, 500)

    return () => {
      window.removeEventListener('filterChange', filterListener as EventListener)
      window.removeEventListener('storage', storageListener)
      clearInterval(interval)
    }
  }, [filters])

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
        {/* Mock Location Markers with Filter Support */}
        <MockLocationMarkers
          showPopups={true}
          onMarkerClick={handleMarkerClick}
          filters={filters}
        />
      </MapContainer>
    </MobileLayout>
  )
}
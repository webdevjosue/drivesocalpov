/**
 * Drive SoCal POV - Home Page
 * Mobile-first travel guide with interactive map
 */

'use client'

import React, { useEffect, useState } from 'react'
import MapContainer from '@/components/map/MapContainer'
import MobileLayout from '@/components/layout/MobileLayout'
import SanDiegoLocationMarkers from '@/components/map/SanDiegoLocationMarkers'
import { validateMapEnvironment } from '@/lib/map/config'
import {
  WebSiteStructuredData,
  MobileApplicationStructuredData,
  TravelActionStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
} from '@/components/seo/StructuredData'

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
    region: 'San Diego',
    category: 'All Categories',
    price: 'All Prices'
  })

  // Listen for filter changes from MobileLayout
  useEffect(() => {
    const handleFilterChange = () => {
      // Get current filter values from localStorage or global state
      const selectedRegion = localStorage.getItem('selectedRegion') || 'San Diego'
      const selectedCategory = localStorage.getItem('selectedCategory') || 'All Categories'
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
        region: localStorage.getItem('selectedRegion') || 'San Diego',
        category: localStorage.getItem('selectedCategory') || 'All Categories',
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
    <>
      {/* SEO Structured Data */}
      <WebSiteStructuredData />
      <MobileApplicationStructuredData />
      <TravelActionStructuredData />

      
      {/* Breadcrumb for navigation */}
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: 'https://drivesocalpov.com' },
          { name: 'Southern California Map', url: 'https://drivesocalpov.com/map' },
        ]}
      />

      {/* FAQ Structured Data */}
      <FAQStructuredData
        faqs={[
          {
            question: 'Is Drive SoCal POV free to use?',
            answer: 'Yes! Drive SoCal POV is completely free to use. We offer a premium tier with additional features, but the core travel guide functionality is always free.',
          },
          {
            question: 'What areas of Southern California do you cover?',
            answer: 'We cover all of Southern California including Los Angeles, San Diego, Orange County, and the Inland Empire, from Palmdale to Ensenada and Yuma to Santa Barbara.',
          },
          {
            question: 'Can I use Drive SoCal POV on my mobile device?',
            answer: 'Absolutely! Drive SoCal POV is designed mobile-first and works perfectly on smartphones and tablets with touch-optimized controls.',
          },
        ]}
      />

      <MobileLayout
        title="Drive SoCal POV - Southern California Travel Guide"
      >
        {/* Map Container - Full Width */}
        <MapContainer
          className="w-full h-full"
          showControls={true}
          enablePerformanceMode={true}
        >
          {/* Real San Diego Location Markers from Database */}
          <SanDiegoLocationMarkers
            showPopups={true}
            onMarkerClick={handleMarkerClick}
            filters={filters}
          />
        </MapContainer>
      </MobileLayout>
    </>
  )
}
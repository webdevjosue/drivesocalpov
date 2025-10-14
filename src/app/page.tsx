/**
 * Drive SoCal POV - Home Page
 * Mobile-first travel guide with interactive map
 */

'use client'

import React, { useEffect } from 'react'
import MapContainer from '@/components/map/MapContainer'
import { validateMapEnvironment } from '@/lib/map/config'

export default function Home() {
  // Validate OpenStreetMap environment on app load
  useEffect(() => {
    validateMapEnvironment()
  }, [])

  return (
    <div className="w-full h-screen relative bg-gray-100">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Drive SoCal POV</h1>
          <p className="text-sm text-gray-600">Discover Southern California</p>
        </div>
      </header>

      {/* Map Container */}
      <main className="w-full h-full pt-16">
        <MapContainer
          className="w-full h-full"
          showControls={true}
          enablePerformanceMode={true}
        >
          {/* Map content will be added here */}
        </MapContainer>
      </main>

      {/* Bottom Navigation (placeholder for Phase 3) */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="flex justify-around">
            <button className="p-2 text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
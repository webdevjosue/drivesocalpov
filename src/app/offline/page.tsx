/**
 * Offline Page
 * Displayed when user is offline or server is unavailable
 */

'use client'

import React from 'react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        {/* Offline Icon */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>

        {/* Offline Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You&apos;re Offline
        </h1>
        <p className="text-gray-600 mb-6">
          Drive SoCal POV requires an internet connection to load the interactive map and location data.
        </p>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full mb-4"
        >
          Try Again
        </button>

        {/* Tips */}
        <div className="text-left bg-blue-50 rounded-lg p-4">
          <h2 className="font-semibold text-blue-900 mb-2">While offline, you can:</h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• View cached map tiles</li>
            <li>• Access previously loaded locations</li>
            <li>• Use basic app functionality</li>
          </ul>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-6">
          Some features may be limited until you reconnect to the internet.
        </p>
      </div>
    </div>
  )
}
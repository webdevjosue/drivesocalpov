import React from 'react'
import { useSecureLocations } from '@/hooks/useSecureLocations'
import { LocationCard } from './LocationCard'
import { SoCalButton } from '@/components/ui/socal-button'
import { Loader2, MapPin, Search } from 'lucide-react'

interface LocationGridProps {
  region?: string
  category?: string
  isFree?: boolean
  variant?: 'socal' | 'gta' | 'compact'
  limit?: number
  className?: string
}

export function LocationGrid({
  region,
  category,
  isFree,
  variant = 'socal',
  limit = 12,
  className
}: LocationGridProps) {
  const {
    locations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    search,
    searchResults,
    searchLoading,
    searchError
  } = useSecureLocations({
    region,
    category,
    isFree: isFree !== undefined ? isFree : undefined,
    limit,
    autoLoad: true
  })

  const displayLocations = searchResults.length > 0 ? searchResults : locations
  const isLoading = loading || searchLoading
  const hasError = error || searchError
  const errorMessage = searchError || error

  if (hasError && displayLocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <MapPin className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load locations
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          {errorMessage}
        </p>
        <SoCalButton onClick={refresh} variant="outline">
          Try Again
        </SoCalButton>
      </div>
    )
  }

  if (displayLocations.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-orange-100 rounded-full p-4 mb-4">
          <MapPin className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No locations found
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          {isFree !== false
            ? `No free locations found in ${region || 'Southern California'}${category ? ` for ${category}` : ''}. Try adjusting your filters.`
            : `No locations found matching your criteria.`}
        </p>
        <SoCalButton onClick={refresh} variant="outline">
          Refresh
        </SoCalButton>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {isFree ? 'Free' : 'All'} Locations
            {region && ` in ${region}`}
            {category && ` - ${category}`}
          </h2>
          <p className="text-muted-foreground mt-1">
            Discover amazing {isFree ? 'free ' : ''}places in Southern California
          </p>
        </div>

        <SoCalButton
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <MapPin className="h-4 w-4 mr-2" />
          )}
          Refresh
        </SoCalButton>
      </div>

      {/* Search Results Indicator */}
      {searchResults.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Found {searchResults.length} location{searchResults.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Location Grid */}
      <div className={
        variant === 'compact'
          ? 'space-y-4'
          : variant === 'gta'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }>
        {displayLocations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            variant={variant}
            showBookmark={true}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && displayLocations.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
            <span className="text-sm font-medium text-gray-600">
              Loading more locations...
            </span>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && hasMore && displayLocations.length > 0 && (
        <div className="flex justify-center pt-4">
          <SoCalButton
            onClick={loadMore}
            variant="default"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <MapPin className="h-5 w-5 mr-2" />
            )}
            Load More Locations
          </SoCalButton>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && displayLocations.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You've reached the end! Showing {displayLocations.length} location{displayLocations.length !== 1 ? 's' : ''}.
          </p>
        </div>
      )}
    </div>
  )
}
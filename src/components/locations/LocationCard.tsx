import React, { useState } from 'react'
import Image from 'next/image'
import { Star, MapPin, Clock, DollarSign, Heart, Navigation } from 'lucide-react'
import { SecureLocation } from '@/lib/services/secure-location-service'
import { SoCalCard, SoCalCardHeader, SoCalCardTitle, SoCalCardContent, SoCalCardFooter, GTACard } from '@/components/ui/socal-card'
import { SoCalBadge } from '@/components/ui/socal-badge'
import { SoCalButton } from '@/components/ui/socal-button'

interface LocationCardProps {
  location: SecureLocation
  variant?: 'socal' | 'gta' | 'compact'
  onCardClick?: (location: SecureLocation) => void
  showBookmark?: boolean
  className?: string
}

export function LocationCard({
  location,
  variant = 'socal',
  onCardClick,
  showBookmark = true,
  className
}: LocationCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // TODO: Implement actual bookmark functionality
  }

  const handleCardClick = () => {
    onCardClick?.(location)
  }

  const renderPriceBadge = () => {
    if (location.is_free) {
      return <SoCalBadge variant="free" className="ml-2">FREE</SoCalBadge>
    }
    return <SoCalBadge variant="premium" className="ml-2">PREMIUM</SoCalBadge>
  }

  const renderRating = () => {
    if (!location.rating) return null

    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{location.rating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({location.review_count.toLocaleString()})</span>
      </div>
    )
  }

  const getMainImage = () => {
    if (imageError || !location.photos || location.photos.length === 0) {
      return null
    }
    return location.photos[0]
  }

  if (variant === 'compact') {
    return (
      <div
        className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl ${className}`}
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            {getMainImage() && (
              <Image
                src={getMainImage()}
                alt={location.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 truncate">{location.name}</h3>
              {renderPriceBadge()}
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <MapPin className="h-3 w-3" />
              <span>{location.city}, {location.region}</span>
            </div>

            {location.summary && (
              <p className="text-sm text-gray-600 line-clamp-2">{location.summary}</p>
            )}

            <div className="flex items-center justify-between mt-2">
              {renderRating()}
              {showBookmark && (
                <button
                  onClick={handleBookmark}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'gta') {
    return (
      <GTACard
        variant={location.is_free ? "location" : "premium"}
        className={`cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          {/* GTA-style header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-black text-lg text-black uppercase tracking-wide">
                {location.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-black" />
                <span className="text-sm font-bold text-black">
                  {location.city}, {location.region}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {renderPriceBadge()}
              {showBookmark && (
                <button
                  onClick={handleBookmark}
                  className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-300 transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${isBookmarked ? 'fill-red-600 text-red-600' : 'text-black'}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* GTA-style image */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-black bg-gray-200">
            {getMainImage() && (
              <Image
                src={getMainImage()}
                alt={location.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            )}
            {!getMainImage() && (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-200 to-purple-200">
                <MapPin className="h-12 w-12 text-black" />
              </div>
            )}
          </div>

          {/* GTA-style content */}
          <div className="space-y-2">
            {location.summary && (
              <p className="text-sm font-medium text-gray-700 line-clamp-2">
                {location.summary}
              </p>
            )}

            <div className="flex items-center justify-between">
              {renderRating()}
              <SoCalButton
                variant="gta"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick()
                }}
              >
                <Navigation className="h-4 w-4 mr-1" />
                VIEW
              </SoCalButton>
            </div>
          </div>
        </div>
      </GTACard>
    )
  }

  // Default SoCal variant
  return (
    <SoCalCard className={`cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl ${className}`} onClick={handleCardClick}>
      <SoCalCardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <SoCalCardTitle className="text-xl mb-2">{location.name}</SoCalCardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>{location.city}, {location.region}</span>
              {renderPriceBadge()}
            </div>
          </div>

          {showBookmark && (
            <button
              onClick={handleBookmark}
              className="p-2 rounded-full hover:bg-orange-100 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
          )}
        </div>
      </SoCalCardHeader>

      <SoCalCardContent className="space-y-4">
        {/* Image */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
          {getMainImage() && (
            <Image
              src={getMainImage()}
              alt={location.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
          {!getMainImage() && (
            <div className="flex items-center justify-center h-full">
              <MapPin className="h-16 w-16 text-orange-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {location.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {location.summary}
            </p>
          )}

          {/* Tags */}
          {location.tags && location.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {location.tags.slice(0, 3).map((tag, index) => (
                <SoCalBadge key={index} variant="location" className="text-xs">
                  {tag}
                </SoCalBadge>
              ))}
              {location.tags.length > 3 && (
                <SoCalBadge variant="secondary" className="text-xs">
                  +{location.tags.length - 3} more
                </SoCalBadge>
              )}
            </div>
          )}
        </div>
      </SoCalCardContent>

      <SoCalCardFooter className="pt-3">
        <div className="flex items-center justify-between">
          {renderRating()}

          <SoCalButton
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
          >
            View Details
          </SoCalButton>
        </div>
      </SoCalCardFooter>
    </SoCalCard>
  )
}
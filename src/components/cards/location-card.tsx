"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SoCalIcon } from "@/components/ui/so-cal-icon"
import { Heart, MapPin, ExternalLink, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationCardProps {
  // Core SEO-optimized data structure
  id: string
  name: string
  category: 'beach' | 'park' | 'attraction' | 'museum' | 'hiking' | 'food' | 'shopping' | 'entertainment'
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  address: string
  city: string
  county: 'San Diego' | 'Los Angeles' | 'Orange' | 'Inland Empire'

  // Pricing and access
  isFree: boolean
  price?: string

  // Official source data
  officialWebsite?: string

  // Engagement metrics
  rating?: number
  reviewCount?: number

  // UI props
  variant?: 'default' | 'socal' | 'gtav'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LocationCard = React.forwardRef<HTMLDivElement, LocationCardProps>(
  ({
    id,
    name,
    category,
    description,
    coordinates,
    address,
    city,
    county,
    isFree,
    price,
    officialWebsite,
    rating,
    reviewCount,
    variant = 'default',
    size = 'md',
    className,
    ...props
  }, ref) => {
    const sizeStyles = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }

    const titleSizes = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl'
    }

    const cardVariants = {
      default: 'card-socal',
      socal: 'card-socal',
      gtav: 'card-gtav'
    }

    return (
      <Card
        ref={ref}
        className={cn(
          cardVariants[variant],
          sizeStyles[size],
          'group cursor-pointer transition-all duration-300 hover:shadow-2xl',
          className
        )}
        {...props}
        // SEO optimization
        itemScope
        itemType="https://schema.org/TouristAttraction"
      >
        {/* Schema.org structured data */}
        <meta itemProp="identifier" content={id} />
        <meta itemProp="geo" content={`${coordinates.lat},${coordinates.lng}`} />
        <meta itemProp="address" content={address} />
        <meta itemProp="addressLocality" content={city} />
        <meta itemProp="addressRegion" content={county} />

        <CardHeader className="pb-3">
          {/* Header with icon and category */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <SoCalIcon
                category={category}
                size="md"
                variant={variant}
                alt={`${category} icon for ${name}`}
              />
              <div className="flex-1">
                <CardTitle
                  className={cn(
                    titleSizes[size],
                    'font-semibold text-left group-hover:text-primary transition-colors'
                  )}
                  itemProp="name"
                >
                  {name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={isFree ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {isFree ? "FREE" : price || "Paid"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {city}
                  </span>
                </div>
              </div>
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Add ${name} to favorites`}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Description - SEO optimized */}
          <CardDescription
            className="text-sm mb-4 line-clamp-3"
            itemProp="description"
          >
            {description}
          </CardDescription>

          {/* Location info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <MapPin className="h-3 w-3" />
            <span>{city}, {county}</span>
          </div>

          {/* Rating and reviews */}
          {rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-gtav-gold-500" />
                <span className="text-sm font-medium" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                  <span itemProp="ratingValue">{rating}</span>
                  <meta itemProp="reviewCount" content={reviewCount?.toString() || '0'} />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                </span>
              </div>
              {reviewCount && (
                <span className="text-xs text-muted-foreground">
                  ({reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                // Map navigation logic here
                console.log(`Navigate to ${coordinates.lat}, ${coordinates.lng}`)
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>

            {officialWebsite && (
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a
                  href={officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="url"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Visit official website</span>
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

LocationCard.displayName = "LocationCard"

export { LocationCard, type LocationCardProps }
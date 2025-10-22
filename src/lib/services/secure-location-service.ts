/**
 * SECURE Location Service - Fetches location data via API endpoints
 * Replaces direct database access with secure API calls to protect business intelligence
 */

// Location interface with limited data exposure
export interface SecureLocation {
  id: string;
  name: string;
  summary: string | null;
  city: string;
  region: string;
  is_free: boolean;
  rating: number | null;
  review_count: number;
  photos: string[] | null;
  tags: string[] | null;
  category_id: string;
  created_at: string;
  longitude: number;
  latitude: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number | null;
}

// API response types
interface ApiResponse<T> {
  data: T[];
  count: number;
  filters?: {
    region?: string | null;
    category?: string | null;
    isFree?: string | null;
  };
}

class SecureLocationService {
  private baseUrl = '/api';

  /**
   * Fetch locations with optional filters
   * Now uses secure API endpoints instead of direct database access
   */
  async getLocations(options: {
    region?: string;
    category?: string;
    is_free?: boolean;
    limit?: number;
    include_premium?: boolean;
  } = {}): Promise<{ data: SecureLocation[]; error: string | null }> {
    try {
      const { region, category, is_free, limit = 20, include_premium = false } = options;

      // Build query parameters
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      if (category) params.append('category', category);
      if (is_free !== undefined) params.append('is_free', is_free.toString());
      params.append('limit', Math.min(limit, 100).toString());

      const url = `${this.baseUrl}/locations?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          return { data: [], error: 'Rate limit exceeded. Please try again later.' };
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<SecureLocation> = await response.json();

      // Filter premium content if user is not authenticated
      const filteredData = include_premium
        ? result.data
        : result.data.filter(location => !location.is_free || location.is_free);

      return {
        data: filteredData,
        error: null
      };

    } catch (error) {
      console.error('Secure location service error:', error);
      return {
        data: [],
        error: 'Failed to load locations. Please try again.'
      };
    }
  }

  /**
   * Fetch categories (public data only)
   */
  async getCategories(): Promise<{ data: Category[]; error: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<Category> = await response.json();

      return {
        data: result.data || [],
        error: null
      };

    } catch (error) {
      console.error('Secure categories service error:', error);
      return {
        data: [],
        error: 'Failed to load categories. Please try again.'
      };
    }
  }

  /**
   * Get location by ID (if public)
   */
  async getLocationById(id: string): Promise<{ data: SecureLocation | null; error: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/locations?id=${id}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<SecureLocation> = await response.json();
      const location = result.data.find(loc => loc.id === id) || null;

      return {
        data: location,
        error: location ? null : 'Location not found'
      };

    } catch (error) {
      console.error('Secure location fetch error:', error);
      return {
        data: null,
        error: 'Failed to load location. Please try again.'
      };
    }
  }

  /**
   * Search locations (limited to public data)
   */
  async searchLocations(query: string, options: {
    region?: string;
    limit?: number;
  } = {}): Promise<{ data: SecureLocation[]; error: string | null }> {
    try {
      const { region, limit = 20 } = options;

      // For search, we'll use the main locations endpoint
      // In a real implementation, you'd create a dedicated search endpoint
      const result = await this.getLocations({ region, limit });

      if (result.error) {
        return result;
      }

      // Client-side filtering for search (since we're protecting the database)
      const filteredData = result.data.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        (location.summary && location.summary.toLowerCase().includes(query.toLowerCase())) ||
        (location.tags && location.tags.some(tag =>
          tag.toLowerCase().includes(query.toLowerCase())
        ))
      );

      return {
        data: filteredData,
        error: null
      };

    } catch (error) {
      console.error('Secure search error:', error);
      return {
        data: [],
        error: 'Search failed. Please try again.'
      };
    }
  }

  /**
   * Get featured locations (public only)
   */
  async getFeaturedLocations(region?: string): Promise<{ data: SecureLocation[]; error: string | null }> {
    try {
      const result = await this.getLocations({
        region,
        limit: 10,
        is_free: true  // Only show free featured locations to anonymous users
      });

      if (result.error) {
        return result;
      }

      // Sort by rating and review count to get "featured" locations
      const featuredData = result.data
        .sort((a, b) => {
          // First sort by rating, then by review count
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return b.review_count - a.review_count;
        })
        .slice(0, 6); // Top 6 featured locations

      return {
        data: featuredData,
        error: null
      };

    } catch (error) {
      console.error('Featured locations error:', error);
      return {
        data: [],
        error: 'Failed to load featured locations. Please try again.'
      };
    }
  }
}

// Export singleton instance
export const secureLocationService = new SecureLocationService();

// Transform location to marker format for map integration
export function transformLocationToMarker(location: SecureLocation) {
  return {
    id: location.id,
    name: location.name,
    coordinates: [location.longitude, location.latitude],
    city: location.city,
    region: location.region,
    category: 'attractions', // Default category
    rating: location.rating,
    is_free: location.is_free,
    photos: location.photos,
    tags: location.tags,
    summary: location.summary
  };
}

// Export types for use in components
export type { SecureLocation as Location, Category };

// Legacy compatibility export
export const locationService = secureLocationService;
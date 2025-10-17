/**
 * Location Service - Fetches location data from Supabase
 * Handles all database queries for locations with proper error handling
 */

import { supabase, safeQuery } from '@/lib/supabase/client';

// Simple location types without strict Database typing
export interface Location {
  id: string;
  name: string;
  summary: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string;
  region: string;
  postal_code: string | null;
  coordinates: any;
  price_level: number | null;
  is_free: boolean | null;
  cost_estimate: string | null;
  rating: number | null;
  review_count: number | null;
  photos: string[] | null;
  tags: string[] | null;
  amenities: string[] | null;
  is_premium: boolean | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  hours: any | null;
  seasonality: string[] | null;
  category_id: string;
  subcategory_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  category_id: string;
  sort_order: number | null;
  is_active: boolean | null;
}

export type LocationWithCategories = Location & {
  category: Category | null;
  subcategory: Subcategory | null;
};

// Filter interface for location queries
export interface LocationFilters {
  region?: string;
  category_id?: string;
  subcategory_id?: string;
  is_free?: boolean;
  is_premium?: boolean;
  is_published?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Coordinate bounds for Southern California
export const SOCAL_BOUNDS = {
  north: 34.6,   // Palmdale area
  south: 31.5,   // Past Ensenada, Baja California
  east: -113.5,  // Past Yuma, Arizona
  west: -120.5,  // Past Santa Barbara
};

/**
 * Fetch locations with optional filtering
 */
export async function fetchLocations(filters: LocationFilters = {}): Promise<{
  data: LocationWithCategories[] | null;
  error: string | null;
  count: number | null;
}> {
  const queryFilters = {
    ...filters,
  };

  try {
    let query = supabase
      .from('locations')
      .select(`
        *,
        category:categories (*),
        subcategory:subcategories (*)
      `, { count: 'exact' });

    // Apply filters
    if (queryFilters.region) {
      query = query.eq('region', queryFilters.region);
    }
    if (queryFilters.category_id) {
      query = query.eq('category_id', queryFilters.category_id);
    }
    if (queryFilters.subcategory_id) {
      query = query.eq('subcategory_id', queryFilters.subcategory_id);
    }
    if (queryFilters.is_free !== undefined) {
      query = query.eq('is_free', queryFilters.is_free);
    }
    if (queryFilters.is_premium !== undefined) {
      query = query.eq('is_premium', queryFilters.is_premium);
    }
    if (queryFilters.is_published !== undefined) {
      query = query.eq('is_published', queryFilters.is_published);
    }
    if (queryFilters.search) {
      query = query.or(`name.ilike.%${queryFilters.search}%,description.ilike.%${queryFilters.search}%,summary.ilike.%${queryFilters.search}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false });

    if (queryFilters.limit) {
      query = query.limit(queryFilters.limit);
    }
    if (queryFilters.offset) {
      query = query.range(queryFilters.offset, queryFilters.offset + (queryFilters.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      return { data: null, error: error.message || 'Failed to fetch locations', count: null };
    }

    return { data, error: null, count };
  } catch (err) {
    console.error('Unexpected database error:', err);
    return { data: null, error: 'Failed to fetch locations', count: null };
  }
}

/**
 * Fetch San Diego locations specifically
 */
export async function fetchSanDiegoLocations(limit: number = 50): Promise<{
  data: LocationWithCategories[] | null;
  error: string | null;
}> {
  return safeQuery(async () => {
    return await supabase
      .from('locations')
      .select(`
        *,
        category:categories (*),
        subcategory:subcategories (*)
      `)
      .eq('region', 'San Diego')
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit);
  }, 'Failed to fetch San Diego locations');
}

/**
 * Fetch a single location by ID
 */
export async function fetchLocationById(id: string): Promise<{
  data: LocationWithCategories | null;
  error: string | null;
}> {
  return safeQuery(async () => {
    return await supabase
      .from('locations')
      .select(`
        *,
        category:categories (*),
        subcategory:subcategories (*)
      `)
      .eq('id', id)
      .single();
  }, 'Failed to fetch location');
}

/**
 * Fetch locations by coordinates (within bounds)
 */
export async function fetchLocationsByBounds(
  bounds: typeof SOCAL_BOUNDS,
  limit: number = 100
): Promise<{
  data: LocationWithCategories[] | null;
  error: string | null;
}> {
  return safeQuery(async () => {
    // Using PostGIS ST_MakeEnvelope and ST_Intersects for spatial query
    const { data, error } = await supabase.rpc('search_places', {
      bbox: `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`,
      lim: limit,
    });

    if (error) {
      console.warn('Spatial query failed, falling back to region filter:', error);
      // Fallback to region-based query
      return await supabase
        .from('locations')
        .select(`
          *,
          category:categories (*),
          subcategory:subcategories (*)
        `)
        .in('region', ['San Diego', 'Los Angeles', 'Inland Empire'])
        .order('rating', { ascending: false })
        .limit(limit);
    }

    return { data, error: null };
  }, 'Failed to fetch locations by bounds');
}

/**
 * Transform database location to map marker format
 */
export function transformLocationToMarker(location: LocationWithCategories) {
  // Extract coordinates from PostGIS geometry
  let coordinates: [number, number] | null = null;

  if (location.coordinates) {
    // Handle both GeoJSON and PostGIS point formats
    if (typeof location.coordinates === 'object' && location.coordinates.coordinates) {
      // GeoJSON format: {"type":"Point","coordinates":[-117.2532,32.9218]}
      coordinates = [parseFloat(location.coordinates.coordinates[0]), parseFloat(location.coordinates.coordinates[1])];
    } else {
      // PostGIS text format: "SRID=4326;POINT(lng lat)" or "POINT(lng lat)"
      const coordMatch = String(location.coordinates).match(/POINT\s*\(([-\d.]+)\s+([-\d.]+)\)/);
      if (coordMatch && coordMatch[1] && coordMatch[2]) {
        coordinates = [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
      }
    }
  }

  if (!coordinates) {
    console.warn(`Invalid coordinates for location: ${location.name}`, location.coordinates);
    return null;
  }

  // Validate coordinates are within Southern California bounds
  const [lng, lat] = coordinates;
  if (
    lat < SOCAL_BOUNDS.south ||
    lat > SOCAL_BOUNDS.north ||
    lng < SOCAL_BOUNDS.west ||
    lng > SOCAL_BOUNDS.east
  ) {
    console.warn(`Location ${location.name} is outside Southern California bounds:`, { lat, lng });
    return null;
  }

  return {
    id: location.id,
    name: location.name,
    coordinates,
    category: location.category?.slug || 'unknown',
    type: location.subcategory?.slug || location.category?.slug || 'unknown',
    description: location.summary || location.description || '',
    rating: location.rating || 0,
    isFree: location.is_free || false,
    isPremium: location.is_premium || false,
    region: location.region,
    address: location.address,
    phone: location.phone,
    website: location.website,
    photos: location.photos || [],
    amenities: location.amenities || [],
    hours: location.hours,
    price_level: location.price_level,
    review_count: location.review_count || 0,
    // Include full database record for reference
    _source: location,
  };
}

/**
 * Fetch ready-to-use location markers for the map
 */
export async function fetchLocationMarkers(filters: LocationFilters = {}): Promise<{
  markers: ReturnType<typeof transformLocationToMarker>[];
  error: string | null;
  count: number;
}> {
  const { data: locations, error, count } = await fetchLocations(filters);

  if (error || !locations) {
    return { markers: [], error, count: 0 };
  }

  const markers = locations
    .map(transformLocationToMarker)
    .filter(Boolean) as ReturnType<typeof transformLocationToMarker>[];

  return { markers, error: null, count: count || 0 };
}

/**
 * Fetch San Diego location markers specifically for testing
 */
export async function fetchSanDiegoLocationMarkers(): Promise<{
  markers: ReturnType<typeof transformLocationToMarker>[];
  error: string | null;
}> {
  const { data: locations, error } = await fetchSanDiegoLocations(50);

  if (error || !locations) {
    return { markers: [], error };
  }

  const markers = locations
    .map(transformLocationToMarker)
    .filter(Boolean) as ReturnType<typeof transformLocationToMarker>[];

  console.log(`Loaded ${markers.length} San Diego location markers`);
  return { markers, error: null };
}
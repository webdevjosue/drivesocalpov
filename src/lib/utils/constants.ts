// Geographic boundaries for Southern California
export const SOCAL_BOUNDARIES = {
  north: 35.8, // Northern Santa Barbara County
  south: 32.5, // US-Mexico border
  west: -120.5, // Central California coast
  east: -114.1, // California-Arizona border
};

// Major cities in Southern California
export const MAJOR_CITIES = {
  'San Diego': { lat: 32.7157, lng: -117.1611, zoom: 11 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, zoom: 10 },
  'Inland Empire': { lat: 34.1083, lng: -117.2898, zoom: 9 },
  'Orange County': { lat: 33.7175, lng: -117.8311, zoom: 10 },
  'Santa Barbara': { lat: 34.4208, lng: -119.6982, zoom: 11 },
};

// Map configuration
export const MAP_CONFIG = {
  initialView: {
    latitude: 33.7175, // Orange County center
    longitude: -117.8311,
    zoom: 9,
    pitch: 0,
    bearing: 0,
  },
  minZoom: 6,
  maxZoom: 18,
  maxBounds: [
    [SOCAL_BOUNDARIES.south, SOCAL_BOUNDARIES.west], // Southwest
    [SOCAL_BOUNDARIES.north, SOCAL_BOUNDARIES.east], // Northeast
  ],
};

// Location categories
export const LOCATION_CATEGORIES = {
  ATTRACTION: 'attraction',
  RESTAURANT: 'restaurant',
  EVENT: 'event',
  PARK: 'park',
  BEACH: 'beach',
  MUSEUM: 'museum',
  ENTERTAINMENT: 'entertainment',
  SHOPPING: 'shopping',
  NIGHTLIFE: 'nightlife',
  OUTDOOR: 'outdoor',
} as const;

export type LocationCategory = typeof LOCATION_CATEGORIES[keyof typeof LOCATION_CATEGORIES];

// Freemium feature limits
export const FREEMIUM_LIMITS = {
  MAX_FAVORITES: 25,
  MAX_ITINERARY_ITEMS: 10,
  MAX_OFFLINE_DOWNLOADS: 5,
  PREMIUM_FEATURES: [
    'offline_maps',
    'detailed_itineraries',
    'hidden_gems',
    'no_ads',
    'advanced_filters',
    'real_time_updates',
  ],
};

// Mobile-specific constants
export const MOBILE_CONSTANTS = {
  TOUCH_TARGET_SIZE: 44, // Minimum touch target in pixels
  SWIPE_THRESHOLD: 50, // Minimum swipe distance in pixels
  SWIPE_VELOCITY: 0.3, // Minimum swipe velocity
  TAP_TIMEOUT: 200, // Maximum time for a tap gesture
  DOUBLE_TAP_TIMEOUT: 300, // Maximum time between double taps
  PINCH_ZOOM_SENSITIVITY: 0.01,
  PAN_SENSITIVITY: 1.0,
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  XS: 375, // iPhone SE
  SM: 414, // iPhone Pro
  MD: 768, // iPad
  LG: 1024, // iPad Pro
  XL: 1280, // Desktop
};

// Storage keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'drivesocal_onboarding_completed',
  USER_PREFERENCES: 'drivesocal_user_preferences',
  FAVORITES: 'drivesocal_favorites',
  ITINERARY: 'drivesocal_itinerary',
  OFFLINE_DATA: 'drivesocal_offline_data',
  LAST_LOCATION: 'drivesocal_last_location',
};

// API endpoints
export const API_ENDPOINTS = {
  LOCATIONS: '/api/locations',
  EVENTS: '/api/events',
  ITINERARY: '/api/itinerary',
  FAVORITES: '/api/favorites',
  AUTH: '/api/auth',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  LOCATION_PERMISSION_DENIED: 'Location permission denied. Please enable location services.',
  LOCATION_UNAVAILABLE: 'Unable to get your location. Please try again.',
  OFFLINE_MODE: 'You are currently offline. Some features may be unavailable.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};
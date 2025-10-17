// Core application types
export interface Location {
  id: string;
  name: string;
  description: string | null;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string;
  state: string;
  zipCode: string | null;
  phone: string | null;
  website: string | null;
  hours: Record<string, unknown> | null;
  priceRange: string | null;
  rating: number | null;
  imageUrls: string[];
  tags: string[];
  isFree: boolean;
  isPremium: boolean;
  distance?: number; // Calculated distance from user
}

export interface Event {
  id: string;
  locationId: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  isFree: boolean;
  price: number | null;
  imageUrls: string[];
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  fullName: string | null;
  isPremium: boolean;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  favoriteCategories: LocationCategory[];
  preferredCities: string[];
  notifications: {
    events: boolean;
    favorites: boolean;
    recommendations: boolean;
  };
  map: {
    defaultZoom: number;
    showTraffic: boolean;
    showTransit: boolean;
  };
}

export interface Favorite {
  id: string;
  userId: string;
  locationId: string;
  createdAt: string;
  location?: Location;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  items?: ItineraryItem[];
}

export interface ItineraryItem {
  id: string;
  itineraryId: string;
  locationId: string;
  orderIndex: number;
  notes: string | null;
  durationMinutes: number | null;
  createdAt: string;
  location?: Location;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: AchievementType;
  achievementData: Record<string, unknown>;
  createdAt: string;
}

export type LocationCategory =
  | 'attraction'
  | 'restaurant'
  | 'event'
  | 'park'
  | 'beach'
  | 'museum'
  | 'entertainment'
  | 'shopping'
  | 'nightlife'
  | 'outdoor';

export type AchievementType =
  | 'first_visit'
  | 'explorer'
  | 'foodie'
  | 'night_owl'
  | 'beach_lover'
  | 'park_enthusiast'
  | 'culture_seeker'
  | 'shopaholic';

// Map-related types
export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface MapMarker {
  id: string;
  location: Location;
  selected: boolean;
  visible: boolean;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// UI-related types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  disabled?: boolean;
}

// Mobile touch gesture types
export interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export interface SwipeGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
  endTime: number;
  direction: 'up' | 'down' | 'left' | 'right';
  velocity: number;
}

export interface PinchGesture {
  distance: number;
  center: { x: number; y: number };
  scale: number;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
}

// Search and filter types
export interface SearchFilters {
  categories: LocationCategory[];
  cities: string[];
  isFree: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  distance?: number;
  tags?: string[];
}

export interface SearchParams {
  query?: string;
  filters?: SearchFilters;
  bounds?: MapBounds;
  sortBy?: 'distance' | 'rating' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// State management types (for Zustand)
export interface AppState {
  // Map state
  viewport: MapViewport;
  selectedLocation: Location | null;
  markers: MapMarker[];
  isLoading: boolean;

  // User state
  user: User | null;
  favorites: Favorite[];
  itineraries: Itinerary[];

  // UI state
  isMenuOpen: boolean;
  activeModal: string | null;
  toasts: ToastProps[];

  // Search state
  searchResults: Location[];
  searchFilters: SearchFilters;
  isSearching: boolean;
}

// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel';
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
}
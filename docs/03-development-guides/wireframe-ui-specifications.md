# Drive SoCal POV - Wireframe UI Specifications

## Wireframe Analysis Summary

Based on the provided wireframe image, we have a clear vision for the mobile app layout structure. This document outlines the specific UI components and their requirements derived from the wireframe.

## Layout Structure (From Wireframe)

### 1. Header Section (Top)
```
┌─────────────────────────────────────────────────────────────┐
│ [X]        Drive SoCal P.O.V.      [⧉]      [fullscreen]    │
└─────────────────────────────────────────────────────────────┘
```

**Components Required:**
- **Close Button (X)**: Left-aligned, square-shaped close functionality
- **App Title**: Centered "Drive SoCal P.O.V." branding
- **Location/Compass Icon**: Right-aligned diamond/compass symbol for GPS/location
- **Fullscreen Toggle**: Small text link for fullscreen mode switching

### 2. Main Content Area (Center)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [MAP/CONTENT AREA]                        │
│                                                             │
│                        (EMPTY SPACE)                         │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Requirements:**
- Large content area for map display
- Maximum visibility with minimal UI overlay
- Responsive to touch interactions
- Map-centric design philosophy

### 3. Filter Section (Below Main Content)
```
┌─────────────────────────────────────────────────────────────┐
│ Inland Empire  Los Angeles  San Diego        $  $$  $$$  Free │
│                    [Region]  [Places]  [Free]                │
└─────────────────────────────────────────────────────────────┘
```

**Components Required:**
- **Regional Filters**: Left-aligned location pills ("Inland Empire", "Los Angeles", "San Diego")
- **Price Range Filters**: Right-aligned price indicators ("$", "$$", "$$$", "Free")
- **Category Buttons**: Three primary filter buttons with "Region" highlighted as active

### 4. Bottom Ad Bar (Fixed Footer)
```
┌─────────────────────────────────────────────────────────────┐
│      ADS           ADS           ADS              [☰] A    │
└─────────────────────────────────────────────────────────────┘
```

**Components Required:**
- **Advertisement Sections**: Three equal-width "ADS" placeholder sections
- **Menu Icon**: Right-aligned hamburger menu (three horizontal lines)
- **Logo/Brand**: Small "A" placeholder in bottom-right corner

## Detailed Component Specifications

### 1. Header Component (`AppHeader`)
**File:** `src/components/mobile/Layout/AppHeader.tsx`

**Requirements:**
- Fixed position at top of screen
- Safe area support for notched devices
- Clean, minimal design with high contrast
- Touch-optimized button targets (minimum 44px)

**Props Interface:**
```typescript
interface AppHeaderProps {
  onClose?: () => void
  onLocationToggle?: () => void
  onFullscreenToggle?: () => void
  showCloseButton?: boolean
  showLocationButton?: boolean
  showFullscreenButton?: boolean
  variant?: 'light' | 'dark'
}
```

### 2. Filter Bar Component (`FilterBar`)
**File:** `src/components/mobile/Filters/FilterBar.tsx`

**Requirements:**
- Horizontal scrollable filter sections
- Touch-friendly pill buttons
- Active state visualization
- Smooth transitions between filter states

**Props Interface:**
```typescript
interface FilterBarProps {
  regions: string[]
  priceRanges: ('$' | '$$' | '$$$' | 'Free')[]
  activeRegion?: string
  activePriceRange?: string
  activeCategory?: 'region' | 'places' | 'free'
  onRegionChange?: (region: string) => void
  onPriceRangeChange?: (priceRange: string) => void
  onCategoryChange?: (category: 'region' | 'places' | 'free') => void
}
```

### 3. Ad Banner Component (`AdBanner`)
**File:** `src/components/mobile/AdBanner/AdBanner.tsx`

**Requirements:**
- Fixed position at bottom
- Three equal-width ad sections
- Swipeable to dismiss functionality
- Menu integration with overlay
- Respect safe areas on mobile devices

**Props Interface:**
```typescript
interface AdBannerProps {
  adSections: AdSection[]
  onMenuToggle?: () => void
  swipeToDismiss?: boolean
  autoHideDelay?: number
  showMenuButton?: boolean
}
```

### 4. Burger Menu Component (`BurgerMenu`)
**File:** `src/components/mobile/Navigation/BurgerMenu.tsx`

**Requirements:**
- Positioned in bottom-right corner
- Three horizontal lines icon
- Touch-optimized tap target
- Animated transition to X icon when opened
- Safe area offset adjustment

**Props Interface:**
```typescript
interface BurgerMenuProps {
  isOpen: boolean
  onToggle: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  variant?: 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
}
```

### 5. Main Content Container (`MainContent`)
**File:** `src/components/mobile/Layout/MainContent.tsx`

**Requirements:**
- Full-height content area
- Accommodates map or other dynamic content
- Handles safe area insets
- Prevents horizontal scrolling
- Touch gesture support for content interaction

**Props Interface:**
```typescript
interface MainContentProps {
  children: React.ReactNode
  showFilters?: boolean
  showAdBanner?: boolean
  headerHeight?: number
  filterBarHeight?: number
  adBannerHeight?: number
}
```

## Mobile Layout Integration

### Complete Layout Structure
```typescript
// Main mobile layout hierarchy
<MobileLayout>
  <AppHeader />
  <MainContent>
    <MapContainer /> {/* or other content */}
  </MainContent>
  <FilterBar />
  <AdBanner />
  <SlideOutMenu /> {/* Triggered by burger menu */}
</MobileLayout>
```

### Responsive Design Requirements

#### Breakpoints
- **Small Mobile**: 320px - 375px (iPhone SE)
- **Mobile**: 376px - 414px (iPhone Pro)
- **Large Mobile**: 415px - 768px (Large phones/Tablets)

#### Component Sizing
- **Header Height**: 60px (adjusts for safe areas)
- **Filter Bar Height**: 80px
- **Ad Banner Height**: 80px
- **Touch Targets**: Minimum 44px × 44px
- **Button Padding**: 12px minimum
- **Icon Sizes**: 24px for standard icons

## Color Scheme and Styling

### Primary Colors (Based on Wireframe Monochrome)
- **Background**: #FFFFFF (White)
- **Text Primary**: #000000 (Black)
- **Text Secondary**: #666666 (Gray)
- **Accent**: #007AFF (Blue for interactive elements)
- **Border**: #E5E5E5 (Light gray)

### Interactive States
- **Default**: Subtle borders and shadows
- **Pressed**: Scale animation (0.95) + shadow reduction
- **Active**: Blue accent color
- **Disabled**: 50% opacity

## Animation Requirements

### Transitions
- **Menu Slide**: 300ms cubic-bezier ease-out
- **Filter Selection**: 200ms ease-in-out
- **Button Press**: 100ms ease-out
- **Ad Banner Swipe**: 150ms ease-out

### Micro-interactions
- **Button Ripple**: Subtle background color change
- **Filter Pills**: Scale and color transition
- **Menu Icon Morph**: Smooth line to X transformation

## Typography

### Font Hierarchy
- **Header Title**: 18px, 600 weight
- **Filter Labels**: 14px, 500 weight
- **Ad Text**: 12px, 400 weight
- **Button Text**: 16px, 500 weight

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

## Touch Interaction Patterns

### Gesture Support
- **Tap**: All buttons and interactive elements
- **Swipe**: Ad banner dismissal, menu opening
- **Pinch**: Map zoom (in content area)
- **Pan**: Map navigation (in content area)

### Touch Feedback
- **Visual**: Button press animation
- **Haptic**: Device vibration on button press (if supported)
- **Audio**: Optional click sound (user preference)

## Accessibility Requirements

### Screen Reader Support
- **ARIA Labels**: All interactive elements properly labeled
- **Focus Management**: Logical tab order and focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmark roles
- **Alt Text**: Meaningful descriptions for icons and images

### Motor Accessibility
- **Large Touch Targets**: Minimum 44px for all interactive elements
- **Spacing**: Adequate spacing between touch targets
- **Alternative Navigation**: Keyboard navigation support
- **Reduced Motion**: Respect user's motion preferences

## Performance Requirements

### Rendering Performance
- **Initial Render**: < 1.5 seconds
- **Animation FPS**: 60fps on target devices
- **Touch Response**: < 100ms latency
- **Memory Usage**: < 100MB for UI components

### Optimization Strategies
- **Lazy Loading**: Off-screen components
- **Image Optimization**: WebP format with responsive sizing
- **Bundle Splitting**: Code splitting by route/component
- **Animation Performance**: CSS transforms and opacity changes

## Component Dependencies

### Required Libraries
- **React**: 18+ for modern hooks and features
- **Framer Motion**: For smooth animations and gestures
- **React Spring**: For physics-based animations
- **React Gesture**: For touch gesture handling

### Optional Libraries
- **React Use Gesture**: Advanced gesture recognition
- **React Intersection Observer**: Lazy loading optimization
- **React Virtual**: For long lists (if needed)

## Testing Requirements

### Device Testing
- **iOS**: iPhone 12/13/14/15, iPad Air/Pro
- **Android**: Various screen sizes and manufacturers
- **Responsive**: Desktop and tablet views

### Interaction Testing
- **Touch Events**: Tap, swipe, pinch, pan gestures
- **Orientation**: Portrait and landscape modes
- **Safe Areas**: Notched devices and different screen ratios
- **Performance**: Memory usage and frame rate monitoring

## Implementation Priority

### Phase 1: Core Layout (High Priority)
1. Mobile layout wrapper with safe area support
2. Header component with navigation elements
3. Main content container
4. Basic styling and typography

### Phase 2: Interactive Elements (High Priority)
1. Filter bar with state management
2. Burger menu with slide-out navigation
3. Ad banner with swipe functionality
4. Touch gesture system

### Phase 3: Polish and Optimization (Medium Priority)
1. Animation system implementation
2. Performance monitoring
3. Accessibility improvements
4. Error boundaries and fallbacks

## Success Criteria

### Functional Requirements
- [ ] Layout matches wireframe exactly
- [ ] All interactive elements work on touch devices
- [ ] Responsive design works across target screen sizes
- [ ] Safe area support for modern devices
- [ ] Component reusability and maintainability

### Performance Requirements
- [ ] 60fps animations on target devices
- [ ] < 100ms touch response time
- [ ] Memory usage within limits
- [ ] Proper cleanup and memory management

### User Experience Requirements
- [ ] Intuitive navigation and interaction
- [ ] Visual feedback for all interactions
- [ ] Consistent styling and behavior
- [ ] Accessibility compliance (WCAG 2.1 AA)

## Conclusion

This wireframe provides a clear and practical vision for the Drive SoCal POV mobile interface. The specifications outlined above ensure that we build exactly what's envisioned while maintaining modern mobile development best practices.

The layout is simple yet functional, prioritizing the map/content area while providing essential navigation and filtering capabilities. The component architecture supports easy maintenance and future enhancements while delivering a polished, native-like mobile experience.
# Drive SoCal POV - Data Collection System

## Overview
Structured data collection system for Southern California travel guide content. Organized by freemium model, regions, and categories for efficient web scraping and database population.

## Folder Structure
```
docs/data-collection/
├── README.md                          # This file
├── schema/                            # Database schema and validation
│   ├── database-schema-for-scraping.json
│   ├── validation-rules.json
│   └── category-mappings.json
├── regions/                           # Data organized by geographic regions
│   ├── san-diego/
│   │   ├── free-attractions.json
│   │   ├── beaches.json
│   │   ├── paid-attractions.json
│   │   ├── restaurants.json
│   │   ├── events.json
│   │   └── tours.json
│   ├── los-angeles/
│   │   ├── free-attractions.json
│   │   ├── beaches.json
│   │   ├── paid-attractions.json
│   │   ├── restaurants.json
│   │   ├── events.json
│   │   └── tours.json
│   └── inland-empire/
│       ├── free-attractions.json
│       ├── beaches.json
│       ├── paid-attractions.json
│       ├── restaurants.json
│       ├── events.json
│       └── tours.json
├── categories/                        # Cross-regional category data
│   ├── free-attractions/
│   ├── beaches/
│   ├── paid-attractions/
│   ├── restaurants/
│   ├── events/
│   └── tours/
├── admin/                            # Admin and management tools
│   ├── duplicate-detector.js
│   ├── data-validator.js
│   ├── import-status.json
│   └── batch-import.js
└── processed/                        # Processed and validated data ready for import
    ├── validated-san-diego.json
    ├── validated-los-angeles.json
    ├── validated-inland-empire.json
    └── ready-for-import.json
```

## Data Collection Priority Order

### Phase 1: Free Content (Priority: HIGH)
1. **Free Attractions** - Parks, museums with free admission, public spaces
2. **Beaches** - All public beaches, beach parks, coastal access points
3. **Free Events** - Festivals, farmers markets, community events

### Phase 2: Paid Content (Priority: MEDIUM)
1. **Paid Attractions** - Theme parks, paid museums, tourist attractions
2. **Restaurants** - Budget-friendly to high-end dining options
3. **Tours** - Guided tours, experiences, activities

## Freemium Model Structure

### FREE TIER (Accessible to all users)
- ✅ All free attractions and public spaces
- ✅ All beaches and coastal areas
- ✅ Basic location information (name, address, hours)
- ✅ Photos and basic descriptions
- ✅ User reviews and ratings

### PREMIUM TIER (Paid subscribers only)
- 🔒 Detailed itineraries and trip planning
- 🔒 Hidden gems and secret spots
- 🔒 Advanced filtering and search
- 🔒 Offline map access
- 🔒 Restaurant recommendations and reviews
- 🔒 Tour bookings and reservations
- 🔒 Historical and cultural context

## Data Standards

### Required Fields for All Locations
```json
{
  "name": "Location Name",
  "category": "attractions|restaurants|events|outdoors",
  "subcategory": "museums|parks|beaches|landmarks",
  "city": "City Name",
  "region": "San Diego|Los Angeles|Inland Empire",
  "address": "Full Address",
  "coordinates": {
    "latitude": 32.7341,
    "longitude": -117.1596
  },
  "is_free": true|false,
  "tier": "free|premium",
  "summary": "Brief 1-2 sentence description",
  "description": "Detailed description"
}
```

### Optional but Recommended Fields
```json
{
  "website": "https://example.com",
  "phone": "(619) 555-0123",
  "hours": {
    "monday": "9:00-18:00",
    "tuesday": "9:00-18:00"
  },
  "price_level": 1|2|3|4,
  "cost_estimate": "$15-20 per person",
  "rating": 4.5,
  "review_count": 1250,
  "photos": ["https://example.com/photo1.jpg"],
  "tags": ["family-friendly", "outdoors", "historic"],
  "amenities": ["parking", "restrooms", "gift shop"]
}
```

## Duplicate Prevention Strategy

### Primary Deduplication Keys
1. **Name + Address Combination** - Most reliable for physical locations
2. **Website URL** - For businesses with unique websites
3. **Phone Number** - For contact verification
4. **Coordinates** - Within 100 meters proximity

### Deduplication Process
1. Check for exact name + address matches
2. Verify coordinate proximity (within 100m)
3. Cross-reference website and phone numbers
4. Manual review for potential duplicates

## Admin Management System

### Local JSON File Management
- All data stored in structured JSON files by region and category
- Local editing and validation before database import
- Version control with Git for tracking changes
- Automated validation and duplicate detection

### Admin Tools Location: `docs/data-collection/admin/`
- `duplicate-detector.js` - Finds and flags potential duplicates
- `data-validator.js` - Validates data against schema requirements
- `import-status.json` - Tracks import status and progress
- `batch-import.js` - Batch processing for database imports

## Secret Keys Management

### Recommended: Vercel Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Additional API Keys (if needed)
GOOGLE_PLACES_API_KEY=your_google_places_key
YELP_API_KEY=your_yelp_api_key
```

### Why Vercel Over GitHub Secrets
- ✅ **Runtime Access**: Available during server-side rendering and API routes
- ✅ **Client Safety**: Public keys safe for frontend, private keys server-only
- ✅ **Deployment Integration**: Automatically available on Vercel deployments
- ✅ **Environment Separation**: Different keys for dev/staging/production
- ✅ **No Git Exposure**: Never committed to version control

## Web Scraping Workflow

### Step 1: Targeted Search
Use websearchprime to search for specific categories:
- "best free attractions San Diego California"
- "top beaches Los Angeles County"
- "family-friendly activities Inland Empire"

### Step 2: Data Extraction
Extract information following the schema structure:
- Location name and type
- Address and coordinates
- Contact information
- Pricing and hours
- Descriptions and photos

### Step 3: Local Storage
Save extracted data to appropriate regional JSON files:
- `docs/data-collection/regions/san-diego/free-attractions.json`
- `docs/data-collection/regions/los-angeles/beaches.json`

### Step 4: Validation
Run admin tools for data quality:
```bash
node docs/data-collection/admin/data-validator.js
node docs/data-collection/admin/duplicate-detector.js
```

### Step 5: Database Import
Use MCP tools to populate Supabase:
```javascript
// Process validated data
mcp__supabase__apply_migration
mcp__supabase__execute_sql
```

## Import Status Tracking

Track progress in `docs/data-collection/admin/import-status.json`:
```json
{
  "last_import": "2025-01-16T10:00:00Z",
  "total_locations": 0,
  "imported_locations": 0,
  "regions": {
    "san-diego": {"status": "pending", "count": 0},
    "los-angeles": {"status": "pending", "count": 0},
    "inland-empire": {"status": "pending", "count": 0}
  },
  "categories": {
    "free-attractions": {"status": "pending", "count": 0},
    "beaches": {"status": "pending", "count": 0},
    "paid-attractions": {"status": "pending", "count": 0}
  }
}
```

## Next Steps

1. **Create folder structure** - Set up organized regional and category folders
2. **Start with free attractions** - Begin data collection with highest priority content
3. **Implement validation tools** - Ensure data quality and prevent duplicates
4. **Configure Vercel secrets** - Set up secure environment variables
5. **Begin systematic data import** - Populate database with validated content
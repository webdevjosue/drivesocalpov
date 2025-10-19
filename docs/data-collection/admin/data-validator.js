/**
 * Data Validation System for Drive SoCal POV
 * Validates location data against database schema requirements
 */

const fs = require('fs');
const path = require('path');

class DataValidator {
  constructor() {
    this.validationErrors = [];
    this.validatedLocations = [];
    this.invalidLocations = [];
    this.stats = {
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: 0
    };
  }

  /**
   * Load database schema for validation rules
   */
  loadSchema() {
    const schemaPath = path.join(__dirname, '../schema/database-schema-for-scraping.json');
    try {
      const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      return schemaData;
    } catch (error) {
      console.error('Error loading schema:', error.message);
      return null;
    }
  }

  /**
   * Validate required fields are present and properly formatted
   */
  validateRequiredFields(location, schema) {
    const errors = [];
    const warnings = [];

    // Core required fields
    const requiredFields = [
      'name',
      'category',
      'city',
      'region',
      'is_free',
      'tier'
    ];

    requiredFields.forEach(field => {
      if (location[field] === undefined || location[field] === null) {
        errors.push(`Missing required field: ${field}`);
      } else if (typeof location[field] === 'string' && location[field].trim() === '') {
        errors.push(`Empty required field: ${field}`);
      }
    });

    // Name validation
    if (location.name) {
      if (location.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
      if (location.name.length > 200) {
        errors.push('Name must be less than 200 characters');
      }
    }

    // Category validation
    if (location.category) {
      const validCategories = ['attractions', 'restaurants', 'events', 'outdoors', 'accommodations', 'shopping', 'entertainment', 'transportation'];
      if (!validCategories.includes(location.category)) {
        errors.push(`Invalid category: ${location.category}. Must be one of: ${validCategories.join(', ')}`);
      }
    }

    // Region validation
    if (location.region) {
      const validRegions = ['San Diego', 'Los Angeles', 'Inland Empire'];
      if (!validRegions.includes(location.region)) {
        errors.push(`Invalid region: ${location.region}. Must be one of: ${validRegions.join(', ')}`);
      }
    }

    // Tier validation
    if (location.tier) {
      const validTiers = ['free', 'premium'];
      if (!validTiers.includes(location.tier)) {
        errors.push(`Invalid tier: ${location.tier}. Must be one of: ${validTiers.join(', ')}`);
      }
    }

    // City validation (must be in Southern California)
    if (location.city && location.region) {
      const validCities = this.getValidCitiesForRegion(location.region);
      if (validCities.length > 0 && !validCities.includes(location.city)) {
        warnings.push(`City "${location.city}" may not be in ${location.region} region`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate coordinates are within Southern California bounds
   */
  validateCoordinates(location) {
    const errors = [];
    const warnings = [];

    if (!location.coordinates) {
      errors.push('Missing coordinates');
      return { errors, warnings };
    }

    const { latitude, longitude } = location.coordinates;

    // Check coordinate format
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      errors.push('Coordinates must be numeric values');
      return { errors, warnings };
    }

    // Southern California bounds
    const bounds = {
      north: 34.6,    // Palmdale area
      south: 31.5,    // Past Ensenada, Baja California
      east: -113.5,   // Past Yuma, Arizona
      west: -120.5    // Past Santa Barbara
    };

    if (latitude < bounds.south || latitude > bounds.north) {
      errors.push(`Latitude ${latitude} is outside Southern California bounds (${bounds.south} to ${bounds.north})`);
    }

    if (longitude < bounds.west || longitude > bounds.east) {
      errors.push(`Longitude ${longitude} is outside Southern California bounds (${bounds.west} to ${bounds.east})`);
    }

    // Coastal proximity check for beaches
    if (location.category === 'outdoors' && location.subcategory === 'beaches') {
      const distanceToCoast = this.calculateDistanceToCoast(latitude, longitude);
      if (distanceToCoast > 5) { // More than 5 miles from coast
        warnings.push(`Beach location is ${Math.round(distanceToCoast)} miles from coast - verify accuracy`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate address format and completeness
   */
  validateAddress(location) {
    const errors = [];
    const warnings = [];

    if (!location.address) {
      warnings.push('Missing address - recommended for better user experience');
      return { errors, warnings };
    }

    // Basic address format validation
    const address = location.address.trim();
    if (address.length < 10) {
      warnings.push('Address seems too short - may be incomplete');
    }

    // Check for California components
    if (!address.toLowerCase().includes('ca') && !address.toLowerCase().includes('california')) {
      warnings.push('Address may be missing California state designation');
    }

    // ZIP code validation
    const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
    if (!zipMatch) {
      warnings.push('Address may be missing ZIP code');
    } else {
      const zipCode = zipMatch[1];
      const firstDigit = parseInt(zipCode[0]);

      // Check if ZIP code is reasonable for Southern California
      if (location.region === 'San Diego' && (firstDigit < 9 || zipCode.startsWith('90'))) {
        warnings.push(`ZIP code ${zipCode} may not be in San Diego County`);
      }
      if (location.region === 'Los Angeles' && (firstDigit < 9 || !zipCode.startsWith('90') && !zipCode.startsWith('91'))) {
        warnings.push(`ZIP code ${zipCode} may not be in Los Angeles County`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate contact information
   */
  validateContactInfo(location) {
    const errors = [];
    const warnings = [];

    // Website validation
    if (location.website) {
      try {
        new URL(location.website);
      } catch (error) {
        errors.push('Invalid website URL format');
      }
    }

    // Phone validation
    if (location.phone) {
      const cleanPhone = location.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        errors.push('Phone number must have 10 digits (area code + number)');
      }

      // Check area code for Southern California
      const areaCode = cleanPhone.substring(0, 3);
      const socalAreaCodes = ['213', '310', '323', '424', '562', '619', '626', '714', '760', '805', '818', '858', '909', '925', '949', '951'];
      if (!socalAreaCodes.includes(areaCode)) {
        warnings.push(`Area code ${areaCode} may not be in Southern California`);
      }
    }

    // Email validation
    if (location.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(location.email)) {
        errors.push('Invalid email format');
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate pricing and business information
   */
  validateBusinessInfo(location) {
    const errors = [];
    const warnings = [];

    // Price level validation
    if (location.price_level !== undefined) {
      if (typeof location.price_level !== 'number' || location.price_level < 1 || location.price_level > 4) {
        errors.push('Price level must be a number between 1 and 4');
      }
    }

    // Rating validation
    if (location.rating !== undefined) {
      if (typeof location.rating !== 'number' || location.rating < 0 || location.rating > 5) {
        errors.push('Rating must be a number between 0 and 5');
      }
    }

    // Review count validation
    if (location.review_count !== undefined) {
      if (typeof location.review_count !== 'number' || location.review_count < 0) {
        errors.push('Review count must be a non-negative number');
      }
    }

    // Free vs paid consistency check
    if (location.is_free === true && location.price_level && location.price_level > 1) {
      warnings.push('Location marked as free but has high price level - review for consistency');
    }

    if (location.is_free === false && !location.cost_estimate && !location.price_level) {
      warnings.push('Paid location missing cost information');
    }

    return { errors, warnings };
  }

  /**
   * Calculate distance to nearest coast (simplified)
   */
  calculateDistanceToCoast(latitude, longitude) {
    // Simplified distance calculation - in reality would use more sophisticated method
    // Southern California approximate coastline
    const coastlinePoints = [
      { lat: 32.75, lng: -117.2 }, // San Diego
      { lat: 33.4, lng: -118.5 }, // Los Angeles
      { lat: 34.0, lng: -118.5 }, // Santa Monica
      { lat: 34.4, lng: -119.5 }, // Santa Barbara
    ];

    let minDistance = Infinity;
    coastlinePoints.forEach(point => {
      const distance = this.haversineDistance(latitude, longitude, point.lat, point.lng);
      minDistance = Math.min(minDistance, distance);
    });

    return minDistance;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Get valid cities for each region
   */
  getValidCitiesForRegion(region) {
    const cityLists = {
      'San Diego': ['San Diego', 'La Jolla', 'Coronado', 'Chula Vista', 'Escondido', 'Oceanside', 'Carlsbad', 'El Cajon', 'Vista', 'San Marcos'],
      'Los Angeles': ['Los Angeles', 'Santa Monica', 'Hollywood', 'Beverly Hills', 'Pasadena', 'Long Beach', 'Malibu', 'Burbank', 'Glendale', 'Santa Clarita'],
      'Inland Empire': ['Riverside', 'San Bernardino', 'Ontario', 'Palm Springs', 'Temecula', 'Murrieta', 'Moreno Valley', 'Fontana', 'Rancho Cucamonga', 'Victorville']
    };

    return cityLists[region] || [];
  }

  /**
   * Validate a single location
   */
  validateLocation(location, schema) {
    const validationResults = {
      location: location,
      errors: [],
      warnings: [],
      isValid: true,
      hasWarnings: false
    };

    // Run all validation checks
    const requiredValidation = this.validateRequiredFields(location, schema);
    const coordinatesValidation = this.validateCoordinates(location);
    const addressValidation = this.validateAddress(location);
    const contactValidation = this.validateContactInfo(location);
    const businessValidation = this.validateBusinessInfo(location);

    // Combine all errors and warnings
    validationResults.errors.push(...requiredValidation.errors);
    validationResults.errors.push(...coordinatesValidation.errors);
    validationResults.errors.push(...addressValidation.errors);
    validationResults.errors.push(...contactValidation.errors);
    validationResults.errors.push(...businessValidation.errors);

    validationResults.warnings.push(...requiredValidation.warnings);
    validationResults.warnings.push(...coordinatesValidation.warnings);
    validationResults.warnings.push(...addressValidation.warnings);
    validationResults.warnings.push(...contactValidation.warnings);
    validationResults.warnings.push(...businessValidation.warnings);

    // Determine validity
    validationResults.isValid = validationResults.errors.length === 0;
    validationResults.hasWarnings = validationResults.warnings.length > 0;

    return validationResults;
  }

  /**
   * Load and validate all location data
   */
  validateAllData() {
    const schema = this.loadSchema();
    if (!schema) {
      console.error('Cannot proceed without schema');
      return;
    }

    const regionsPath = path.join(__dirname, '../regions');
    const regions = ['san-diego', 'los-angeles', 'inland-empire'];

    regions.forEach(region => {
      const regionPath = path.join(regionsPath, region);
      if (!fs.existsSync(regionPath)) return;

      const categories = fs.readdirSync(regionPath).filter(file => file.endsWith('.json'));

      categories.forEach(categoryFile => {
        const filePath = path.join(regionPath, categoryFile);
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (data.locations && Array.isArray(data.locations)) {
            data.locations.forEach((location, index) => {
              this.stats.total++;

              const validation = this.validateLocation(location, schema);

              // Add source metadata
              validation._source = {
                region: region,
                category: categoryFile.replace('.json', ''),
                file: categoryFile,
                index: index
              };

              if (validation.isValid) {
                this.stats.valid++;
                this.validatedLocations.push(validation);
              } else {
                this.stats.invalid++;
                this.invalidLocations.push(validation);
              }

              if (validation.hasWarnings) {
                this.stats.warnings++;
              }
            });
          }
        } catch (error) {
          console.warn(`Error reading ${filePath}:`, error.message);
        }
      });
    });
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.stats,
      invalid_locations: this.invalidLocations.map(validation => ({
        name: validation.location.name,
        source: validation._source,
        errors: validation.errors,
        warnings: validation.warnings
      })),
      valid_locations_summary: {
        total_valid: this.validatedLocations.length,
        with_warnings: this.validatedLocations.filter(v => v.hasWarnings).length,
        without_warnings: this.validatedLocations.filter(v => !v.hasWarnings).length
      },
      validation_rules_applied: [
        'Required fields presence and format',
        'Coordinate bounds validation (Southern California)',
        'Address format and ZIP code validation',
        'Phone number and website format validation',
        'Business information consistency',
        'Regional city validation'
      ]
    };

    // Save report
    const reportPath = path.join(__dirname, 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Validation report saved to: ${reportPath}`);
    return report;
  }

  /**
   * Run complete validation process
   */
  run() {
    console.log('Starting data validation...');
    this.validateAllData();
    return this.generateReport();
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  const validator = new DataValidator();
  const report = validator.run();

  console.log('\n=== DATA VALIDATION SUMMARY ===');
  console.log(`Total locations: ${report.summary.total}`);
  console.log(`Valid locations: ${report.summary.valid}`);
  console.log(`Invalid locations: ${report.summary.invalid}`);
  console.log(`Locations with warnings: ${report.summary.warnings}`);

  if (report.summary.invalid > 0) {
    console.log('\n❌ INVALID LOCATIONS FOUND:');
    report.invalid_locations.forEach((location, index) => {
      console.log(`${index + 1}. "${location.name}" in ${location.source.file}`);
      location.errors.forEach(error => {
        console.log(`   ❌ ${error}`);
      });
    });
  }

  if (report.summary.warnings > 0) {
    console.log('\n⚠️  VALIDATION WARNINGS:');
    report.invalid_locations.concat(report.valid_locations_summary).forEach((location, index) => {
      if (location.warnings && location.warnings.length > 0) {
        console.log(`${index + 1}. "${location.name}" in ${location.source.file}`);
        location.warnings.forEach(warning => {
          console.log(`   ⚠️  ${warning}`);
        });
      }
    });
  }

  if (report.summary.invalid === 0) {
    console.log('\n✅ All locations passed validation!');
  }
}

module.exports = DataValidator;
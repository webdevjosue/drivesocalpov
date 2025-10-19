#!/usr/bin/env node

/**
 * Supabase Data Migration Script
 * Imports validated location data from JSON files to Supabase database
 */

const fs = require('fs');
const path = require('path');

class SupabaseDataMigrator {
  constructor() {
    this.stats = {
      total: 0,
      imported: 0,
      skipped: 0,
      errors: 0
    };
    this.errors = [];
    this.categoryMap = new Map();
    this.subcategoryMap = new Map();
    this.neighborhoodMap = new Map();
  }

  /**
   * Load category and subcategory mappings
   */
  async loadMappings() {
    console.log('Loading category and subcategory mappings...');

    // This would normally query Supabase, but for now we'll use static mappings
    // based on the database structure we observed

    // Category mappings (from our collected data to database slugs)
    this.categoryMap.set('attractions', 'attractions');
    this.categoryMap.set('outdoors', 'parks'); // Map outdoors to parks & recreation
    this.categoryMap.set('shopping', 'shopping');
    this.categoryMap.set('entertainment', 'entertainment');

    // Subcategory mappings (we'll need to create these as needed)
    this.subcategoryMap.set('parks', 'parks-and-recreation');
    this.subcategoryMap.set('beaches', 'beaches');
    this.subcategoryMap.set('museums', 'culture-and-arts');
    this.subcategoryMap.set('historic-district', 'attractions');
    this.subcategoryMap.set('beach-pier', 'outdoor-activities');
    this.subcategoryMap.set('boardwalk', 'outdoor-activities');
    this.subcategoryMap.set('zoo', 'attractions');
    this.subcategoryMap.set('outdoor-mall', 'shopping');

    console.log('Mappings loaded successfully');
  }

  /**
   * Extract ZIP code from address
   */
  extractZipCode(address) {
    if (!address) return null;
    const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
    return zipMatch ? zipMatch[1] : null;
  }

  /**
   * Convert coordinates to PostGIS point format
   */
  formatCoordinates(coordinates) {
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
      return null;
    }
    return `SRID=4326;POINT(${coordinates.longitude} ${coordinates.latitude})`;
  }

  /**
   * Determine if location should be premium based on tier
   */
  isPremiumLocation(location) {
    return location.tier === 'premium' || location.is_free === false;
  }

  /**
   * Generate slug from name
   */
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Transform location data to match database schema
   */
  transformLocation(location, sourceInfo) {
    const transformed = {
      slug: this.generateSlug(location.name),
      name: location.name,
      summary: location.summary || null,
      description: location.description || null,
      website: location.website || null,
      phone: location.phone || null,
      email: location.email || null,
      address: location.address || null,
      city: location.city,
      region: location.region,
      postal_code: this.extractZipCode(location.address),
      coordinates: this.formatCoordinates(location.coordinates),
      price_level: location.price_level || null,
      is_free: location.is_free,
      cost_estimate: location.cost_estimate || null,
      rating: location.rating || null,
      review_count: location.review_count || 0,
      photos: location.photos || [],
      tags: location.tags || [],
      amenities: location.amenities || [],
      is_premium: this.isPremiumLocation(location),
      is_featured: false,
      is_published: true, // Set all imported locations as published
      hours: location.hours ? JSON.stringify(location.hours) : null,
      seasonality: location.seasonality || [],
      // Auto-generated fields will be handled by database
    };

    // Add category mappings
    const categorySlug = this.categoryMap.get(location.category);
    if (categorySlug) {
      transformed.category_slug = categorySlug;
    }

    const subcategorySlug = this.subcategoryMap.get(location.subcategory);
    if (subcategorySlug) {
      transformed.subcategory_slug = subcategorySlug;
    }

    return transformed;
  }

  /**
   * Generate SQL INSERT statement for a location
   */
  generateInsertSQL(location, index) {
    const fields = [];
    const values = [];
    const paramIndex = [];

    // Map fields and escape values properly
    Object.entries(location).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fields.push(`"${key}"`);

        if (typeof value === 'string') {
          if (key === 'coordinates') {
            // PostGIS geometry
            values.push(`ST_GeomFromText('${value}')`);
          } else if (key === 'hours') {
            // JSON field
            values.push(`'${value.replace(/'/g, "''")}'::jsonb`);
          } else {
            // Regular string - escape single quotes
            values.push(`'${value.replace(/'/g, "''")}'`);
          }
        } else if (Array.isArray(value)) {
          // Array field
          const arrayValue = value.map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ');
          values.push(`ARRAY[${arrayValue}]`);
        } else if (typeof value === 'boolean') {
          values.push(value ? 'true' : 'false');
        } else {
          // Number
          values.push(String(value));
        }

        paramIndex.push(`$${index}`);
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to insert');
    }

    // We need to handle category_id and subcategory_id with joins
    // For now, we'll create a simplified version
    let sql = `INSERT INTO locations (${fields.join(', ')}) VALUES (${values.join(', ')});\n`;

    // Add comment with source info
    sql += `-- Source: ${location.source_info?.region || 'unknown'}/${location.source_info?.category || 'unknown'}\n`;

    return sql;
  }

  /**
   * Load all location data from JSON files
   */
  loadAllLocationData() {
    const allLocations = [];
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
              const locationWithSource = {
                ...location,
                source_info: {
                  region: region,
                  category: categoryFile.replace('.json', ''),
                  file: categoryFile,
                  index: index
                }
              };
              allLocations.push(locationWithSource);
            });
          }
        } catch (error) {
          console.warn(`Error reading ${filePath}:`, error.message);
        }
      });
    });

    return allLocations;
  }

  /**
   * Generate migration SQL file
   */
  async generateMigration() {
    console.log('Starting data migration generation...');

    await this.loadMappings();

    const locations = this.loadAllLocationData();
    this.stats.total = locations.length;

    console.log(`Processing ${locations.length} locations...`);

    let sqlContent = `-- Drive SoCal POV - Location Data Migration
-- Generated: ${new Date().toISOString()}
-- Total Locations: ${locations.length}

-- Begin transaction
BEGIN;

`;

    locations.forEach((location, index) => {
      try {
        this.stats.imported++;

        const transformed = this.transformLocation(location, location.source_info);
        const insertSQL = this.generateInsertSQL(transformed, index + 1);

        sqlContent += insertSQL + '\n';

        if ((index + 1) % 10 === 0) {
          console.log(`Processed ${index + 1}/${locations.length} locations...`);
        }

      } catch (error) {
        this.stats.errors++;
        this.stats.skipped++;

        const errorMsg = `Error processing "${location.name}": ${error.message}`;
        this.errors.push(errorMsg);
        console.warn(errorMsg);

        sqlContent += `-- ERROR: ${errorMsg}\n`;
      }
    });

    sqlContent += `
-- Update statistics
UPDATE locations SET
  data_completeness_score = CASE
    WHEN (website IS NOT NULL AND phone IS NOT NULL AND photos IS NOT NULL AND array_length(photos, 1) > 0) THEN 90
    WHEN (website IS NOT NULL OR phone IS NOT NULL) THEN 70
    ELSE 50
  END,
  content_quality_score = CASE
    WHEN (description IS NOT NULL AND length(description) > 200) THEN 85
    WHEN (description IS NOT NULL AND length(description) > 100) THEN 70
    WHEN (description IS NOT NULL) THEN 50
    ELSE 25
  END,
  search_score = CASE
    WHEN (rating >= 4.5 AND review_count > 1000) THEN 90
    WHEN (rating >= 4.0 AND review_count > 500) THEN 75
    WHEN (rating >= 3.5 AND review_count > 100) THEN 60
    WHEN (rating > 0) THEN 40
    ELSE 20
  END;

-- Commit transaction
COMMIT;

-- Migration Summary
-- Total: ${this.stats.total}
-- Imported: ${this.stats.imported}
-- Errors: ${this.stats.errors}
-- Skipped: ${this.stats.skipped}
`;

    // Save migration file
    const migrationPath = path.join(__dirname, 'migration.sql');
    fs.writeFileSync(migrationPath, sqlContent);

    console.log(`\nMigration SQL saved to: ${migrationPath}`);
    console.log(`\n=== MIGRATION SUMMARY ===`);
    console.log(`Total locations: ${this.stats.total}`);
    console.log(`Successfully processed: ${this.stats.imported}`);
    console.log(`Errors: ${this.stats.errors}`);
    console.log(`Skipped: ${this.stats.skipped}`);

    if (this.errors.length > 0) {
      console.log(`\n=== ERRORS ===`);
      this.errors.forEach(error => console.log(`❌ ${error}`));
    }

    return migrationPath;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  const migrator = new SupabaseDataMigrator();
  migrator.generateMigration()
    .then(migrationPath => {
      console.log(`\n✅ Migration generated successfully!`);
      console.log(`📄 File: ${migrationPath}`);
      console.log(`\n🚀 Next steps:`);
      console.log(`1. Review the generated SQL file`);
      console.log(`2. Apply to Supabase using: supabase db reset && supabase db push`);
      console.log(`3. Or apply manually in Supabase dashboard`);
    })
    .catch(error => {
      console.error('❌ Migration generation failed:', error);
      process.exit(1);
    });
}

module.exports = SupabaseDataMigrator;
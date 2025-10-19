/**
 * Duplicate Detection System for Drive SoCal POV
 * Identifies potential duplicate locations across collected data
 */

const fs = require('fs');
const path = require('path');

class DuplicateDetector {
  constructor() {
    this.locations = [];
    this.potentialDuplicates = [];
    this.exactMatches = [];
    this.nearDuplicates = [];
  }

  /**
   * Load all location data from regional files
   */
  loadData() {
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
            data.locations.forEach(location => {
              // Add metadata for tracking
              location._source = {
                region: region,
                category: categoryFile.replace('.json', ''),
                file: categoryFile
              };
              this.locations.push(location);
            });
          }
        } catch (error) {
          console.warn(`Error reading ${filePath}:`, error.message);
        }
      });
    });

    console.log(`Loaded ${this.locations.length} locations for duplicate detection`);
  }

  /**
   * Normalize text for comparison (remove extra spaces, lowercase, etc.)
   */
  normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  /**
   * Calculate distance between two coordinates in meters
   */
  calculateDistance(coord1, coord2) {
    if (!coord1 || !coord2 || !coord1.latitude || !coord1.longitude ||
        !coord2.latitude || !coord2.longitude) {
      return Infinity;
    }

    const R = 6371000; // Earth's radius in meters
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Check if two locations are exact matches
   */
  isExactMatch(loc1, loc2) {
    // Skip if comparing location to itself
    if (loc1 === loc2) return false;

    const name1 = this.normalizeText(loc1.name);
    const name2 = this.normalizeText(loc2.name);
    const address1 = this.normalizeText(loc1.address);
    const address2 = this.normalizeText(loc2.address);

    // Exact name and address match
    if (name1 === name2 && address1 === address2) {
      return {
        type: 'exact',
        reason: 'Exact name and address match',
        confidence: 1.0
      };
    }

    // Exact website match
    if (loc1.website && loc2.website && loc1.website === loc2.website) {
      return {
        type: 'exact',
        reason: 'Exact website match',
        confidence: 0.95
      };
    }

    // Exact phone match
    if (loc1.phone && loc2.phone && loc1.phone === loc2.phone) {
      return {
        type: 'exact',
        reason: 'Exact phone match',
        confidence: 0.9
      };
    }

    return null;
  }

  /**
   * Check if two locations are potential duplicates
   */
  isPotentialDuplicate(loc1, loc2) {
    if (loc1 === loc2) return false;

    const name1 = this.normalizeText(loc1.name);
    const name2 = this.normalizeText(loc2.name);
    const address1 = this.normalizeText(loc1.address);
    const address2 = this.normalizeText(loc2.address);

    // Name similarity check
    const nameSimilarity = this.calculateSimilarity(name1, name2);

    // Address similarity check
    const addressSimilarity = this.calculateSimilarity(address1, address2);

    // Coordinate proximity check
    const distance = this.calculateDistance(loc1.coordinates, loc2.coordinates);

    // Combined duplicate score
    let duplicateScore = 0;
    let reasons = [];

    if (nameSimilarity > 0.8) {
      duplicateScore += 0.4;
      reasons.push(`Name similarity: ${Math.round(nameSimilarity * 100)}%`);
    }

    if (addressSimilarity > 0.7) {
      duplicateScore += 0.3;
      reasons.push(`Address similarity: ${Math.round(addressSimilarity * 100)}%`);
    }

    if (distance < 100) { // Within 100 meters
      duplicateScore += 0.3;
      reasons.push(`Distance: ${Math.round(distance)}m`);
    }

    // Same category and city bonus
    if (loc1.category === loc2.category && loc1.city === loc2.city) {
      duplicateScore += 0.1;
      reasons.push('Same category and city');
    }

    if (duplicateScore >= 0.7) {
      return {
        type: 'potential',
        confidence: duplicateScore,
        reasons: reasons,
        distance: distance,
        nameSimilarity: nameSimilarity,
        addressSimilarity: addressSimilarity
      };
    }

    return null;
  }

  /**
   * Calculate string similarity using Jaccard similarity
   */
  calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;

    const words1 = new Set(str1.split(' '));
    const words2 = new Set(str2.split(' '));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Run duplicate detection
   */
  detectDuplicates() {
    console.log('Starting duplicate detection...');

    // Check for exact matches first
    for (let i = 0; i < this.locations.length; i++) {
      for (let j = i + 1; j < this.locations.length; j++) {
        const exactMatch = this.isExactMatch(this.locations[i], this.locations[j]);
        if (exactMatch) {
          this.exactMatches.push({
            location1: this.locations[i],
            location2: this.locations[j],
            ...exactMatch
          });
        }
      }
    }

    // Check for potential duplicates
    for (let i = 0; i < this.locations.length; i++) {
      for (let j = i + 1; j < this.locations.length; j++) {
        // Skip if already identified as exact match
        const isAlreadyExactMatch = this.exactMatches.some(match =>
          (match.location1 === this.locations[i] && match.location2 === this.locations[j]) ||
          (match.location1 === this.locations[j] && match.location2 === this.locations[i])
        );

        if (!isAlreadyExactMatch) {
          const potentialDuplicate = this.isPotentialDuplicate(this.locations[i], this.locations[j]);
          if (potentialDuplicate) {
            this.potentialDuplicates.push({
              location1: this.locations[i],
              location2: this.locations[j],
              ...potentialDuplicate
            });
          }
        }
      }
    }

    console.log(`Found ${this.exactMatches.length} exact matches`);
    console.log(`Found ${this.potentialDuplicates.length} potential duplicates`);
  }

  /**
   * Generate duplicate detection report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      total_locations: this.locations.length,
      exact_matches: this.exactMatches.length,
      potential_duplicates: this.potentialDuplicates.length,
      exact_matches_details: this.exactMatches.map(match => ({
        location1: {
          name: match.location1.name,
          address: match.location1.address,
          source: match.location1._source
        },
        location2: {
          name: match.location2.name,
          address: match.location2.address,
          source: match.location2._source
        },
        match_type: match.type,
        reason: match.reason,
        confidence: match.confidence
      })),
      potential_duplicates_details: this.potentialDuplicates.map(match => ({
        location1: {
          name: match.location1.name,
          address: match.location1.address,
          source: match.location1._source
        },
        location2: {
          name: match.location2.name,
          address: match.location2.address,
          source: match.location2._source
        },
        match_type: match.type,
        confidence: match.confidence,
        reasons: match.reasons,
        distance_meters: match.distance,
        name_similarity: Math.round(match.nameSimilarity * 100),
        address_similarity: Math.round(match.addressSimilarity * 100)
      }))
    };

    // Save report
    const reportPath = path.join(__dirname, 'duplicate-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Duplicate detection report saved to: ${reportPath}`);
    return report;
  }

  /**
   * Run the complete duplicate detection process
   */
  run() {
    this.loadData();
    this.detectDuplicates();
    return this.generateReport();
  }
}

// Run duplicate detection if this file is executed directly
if (require.main === module) {
  const detector = new DuplicateDetector();
  const report = detector.run();

  console.log('\n=== DUPLICATE DETECTION SUMMARY ===');
  console.log(`Total locations processed: ${report.total_locations}`);
  console.log(`Exact matches found: ${report.exact_matches}`);
  console.log(`Potential duplicates found: ${report.potential_duplicates}`);

  if (report.exact_matches > 0) {
    console.log('\n⚠️  EXACT MATCHES FOUND - Review required:');
    report.exact_matches_details.forEach((match, index) => {
      console.log(`${index + 1}. "${match.location1.name}" in ${match.location1.source.file} matches "${match.location2.name}" in ${match.location2.source.file}`);
      console.log(`   Reason: ${match.reason} (Confidence: ${match.confidence})`);
    });
  }

  if (report.potential_duplicates > 0) {
    console.log('\n⚠️  POTENTIAL DUPLICATES FOUND - Manual review recommended:');
    report.potential_duplicates_details.forEach((match, index) => {
      console.log(`${index + 1}. "${match.location1.name}" ≈ "${match.location2.name}"`);
      console.log(`   Confidence: ${Math.round(match.confidence * 100)}%, Distance: ${match.distance_meters}m`);
      console.log(`   Reasons: ${match.reasons.join(', ')}`);
    });
  }
}

module.exports = DuplicateDetector;
"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle, ThemeToggleExpanded } from "@/components/theme/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LocationCard } from "@/components/cards/location-card"
import { Moon, Sun, Palette, Star, Settings } from "lucide-react"

export default function ThemeShowcasePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      {/* Header with Theme Toggle */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-socal-ocean-600 to-socal-sunset-600 bg-clip-text text-transparent">
              Drive SoCal POV Theme Showcase
            </h1>
            <p className="text-muted-foreground">
              SoCal-inspired design system with GTA V aesthetics and improved contrast
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Theme Options */}
      <section className="max-w-6xl mx-auto mb-12">
        <Card className="card-socal">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Selection
            </CardTitle>
            <CardDescription>
              Experience our custom SoCal and GTA V inspired themes with perfect dark/light mode contrast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeToggleExpanded />
          </CardContent>
        </Card>
      </section>

      {/* Button Variants Showcase */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6">Button Variants</h2>

        <div className="grid gap-8">
          {/* Standard Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Standard Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          {/* SoCal Themed Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-socal-sunset-500" />
                SoCal Themed Buttons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="socal" size="mobile">
                  SoCal Ocean
                </Button>
                <Button variant="sunset" size="mobile">
                  SoCal Sunset
                </Button>
                <Button variant="palm" size="mobile">
                  SoCal Palm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GTA V Themed Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gtav-gold-500" />
                GTA V Inspired Buttons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="gtavGold" size="mobile-lg">
                  GTA V Gold
                </Button>
                <Button variant="gtavPurple" size="mobile-lg">
                  GTA V Purple
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* High Contrast Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                High Contrast (Accessibility)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="contrast" size="mobile">
                  Contrast Light
                </Button>
                <Button variant="contrast-dark" size="mobile">
                  Contrast Dark
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Color Palette */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6">SoCal Color Palette</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ocean Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-socal-ocean-600">Ocean Blue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-ocean-900)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-ocean-700)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-ocean-500)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-ocean-300)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-ocean-100)' }}></div>
              </div>
            </CardContent>
          </Card>

          {/* Sunset Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-socal-sunset-600">Sunset Orange</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-sunset-900)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-sunset-700)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-sunset-500)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-sunset-300)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-sunset-100)' }}></div>
              </div>
            </CardContent>
          </Card>

          {/* Palm Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-socal-palm-600">Palm Green</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-palm-900)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-palm-700)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-palm-500)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-palm-300)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--socal-palm-100)' }}></div>
              </div>
            </CardContent>
          </Card>

          {/* GTA V Gold */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gtav-gold-600">GTA V Gold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--gtav-gold-900)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--gtav-gold-700)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--gtav-gold-500)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--gtav-gold-300)' }}></div>
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'var(--gtav-gold-100)' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Elements - SEO Optimized Location Cards */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6">SEO-Optimized Location Cards</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* San Diego Beach Example */}
          <LocationCard
            id="torrey-pines-state-beach"
            name="Torrey Pines State Beach"
            category="beach"
            description="Pristine sandy beach with rare Torrey pine trees, coastal bluffs, and excellent surfing conditions. Features 2,000 acres of natural preserve with hiking trails and stunning ocean views."
            coordinates={{ lat: 32.9231, lng: -117.2546 }}
            address="12600 N Torrey Pines Rd, La Jolla, CA 92037"
            city="La Jolla"
            county="San Diego"
            isFree={true}
            officialWebsite="https://www.parks.ca.gov/?page_id=642"
            rating={4.8}
            reviewCount={3247}
            variant="socal"
          />

          {/* GTA V Premium Example */}
          <LocationCard
            id="balboa-park-museum"
            name="Balboa Park Museums"
            category="museum"
            description="Cultural hub featuring 17 museums, beautiful gardens, and Spanish Colonial Revival architecture. Home to the famous San Diego Zoo and numerous cultural attractions."
            coordinates={{ lat: 32.7342, lng: -117.1440 }}
            address="1549 El Prado, San Diego, CA 92101"
            city="San Diego"
            county="San Diego"
            isFree={false}
            price="$15-25 per museum"
            officialWebsite="https://www.balboapark.org/"
            rating={4.9}
            reviewCount={8543}
            variant="gtav"
          />

          {/* Hiking Trail Example */}
          <LocationCard
            id="sunset-cliffs-natural-park"
            name="Sunset Cliffs Natural Park"
            category="hiking"
            description="Dramatic coastal cliffs offering breathtaking sunset views and rugged ocean landscapes. Features hiking trails along 68 acres of protected coastal habitat."
            coordinates={{ lat: 32.7551, lng: -117.2527 }}
            address="1750 Sunset Cliffs Blvd, San Diego, CA 92107"
            city="San Diego"
            county="San Diego"
            isFree={true}
            officialWebsite="https://www.sandiego.gov/park-and-recreation/parks/sunset-cliffs"
            rating={4.7}
            reviewCount={2156}
            variant="default"
          />
        </div>

        {/* Data Structure Information */}
        <Card className="mt-8 border-2 border-dashed border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              SEO-Optimized Data Structure
            </CardTitle>
            <CardDescription>
              Clean, efficient data structure following Schema.org standards for maximum SEO impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Core Data Points:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Unique ID for database tracking</li>
                  <li>• Precise coordinates for mapping</li>
                  <li>• Structured address with city/county</li>
                  <li>• Schema.org microdata integration</li>
                  <li>• Official source verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">SEO Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rich snippets for search results</li>
                  <li>• Structured data for Google indexing</li>
                  <li>• Proper semantic HTML5 elements</li>
                  <li>• Optimized image alt attributes</li>
                  <li>• Mobile-first responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Dark Mode Preview */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Dark Mode Preview</h2>

        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Optimized Dark Mode
            </CardTitle>
            <CardDescription>
              Our dark mode features carefully selected colors from the SoCal palette with perfect contrast ratios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Dark Mode Features:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Deep blacks (0a0a0a) for true OLED savings</li>
                  <li>• SoCal stone colors for perfect contrast</li>
                  <li>• Ocean blues for primary actions</li>
                  <li>• Sunset oranges for accents</li>
                  <li>• Smooth theme transitions</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Accessibility Focus:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• WCAG AAA contrast ratios</li>
                  <li>• Larger touch targets on mobile</li>
                  <li>• High contrast variants available</li>
                  <li>• Reduced motion support</li>
                  <li>• Screen reader optimized</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-muted-foreground">
                Toggle the theme switcher in the header to experience the full dark mode transformation
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
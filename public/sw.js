/**
 * Service Worker for Drive SoCal POV
 * Provides offline functionality and performance optimizations
 */

const CACHE_NAME = 'drive-socal-pov-v1'
const OFFLINE_CACHE = 'drive-socal-pov-offline-v1'

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/_next/static/css/app/globals.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico',
]

// Map tile URLs for caching (OpenStreetMap)
const MAP_TILE_CACHE = [
  'https://tile.openstreetmap.org/',
  'https://a.tile.openstreetmap.org/',
  'https://b.tile.openstreetmap.org/',
  'https://c.tile.openstreetmap.org/',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')

  event.waitUntil(
    caches.open(OFFLINE_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    // Cache map tiles for offline use
    if (MAP_TILE_CACHE.some(tileUrl => request.url.startsWith(tileUrl))) {
      event.respondWith(
        caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match(request)
              .then((response) => {
                // Return cached tile or fetch and cache it
                if (response) {
                  return response
                }

                return fetch(request)
                  .then((response) => {
                    // Cache successful responses
                    if (response.ok) {
                      const responseClone = response.clone()
                      cache.put(request, responseClone)
                    }
                    return response
                  })
                  .catch(() => {
                    // Return offline tile if available
                    return new Response('Offline: Map tile not available', {
                      status: 503,
                      statusText: 'Service Unavailable'
                    })
                  })
              })
          })
      )
    }
    return
  }

  // Handle same-origin requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
            }
            return response
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline')
            }

            // Offline fallback for other requests
            return new Response('Offline: Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            })
          })
      })
  )
})

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered')
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve()
    )
  }
})

// Push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    console.log('Service Worker: Push notification received:', data)

    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: data.tag,
      data: data.data,
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received')

  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})

// Periodic background sync for map tiles
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'map-tiles-sync') {
    console.log('Service Worker: Periodic map tile sync')
    event.waitUntil(
      // Pre-cache popular map tiles
      cachePopularMapTiles()
    )
  }
})

// Cache popular map tiles for offline use
async function cachePopularMapTiles() {
  try {
    const cache = await caches.open(CACHE_NAME)

    // Popular Southern California coordinates at different zoom levels
    const popularAreas = [
      { lat: 34.0522, lng: -118.2437, zoom: 10 }, // Los Angeles
      { lat: 32.7157, lng: -117.1611, zoom: 10 }, // San Diego
      { lat: 33.8366, lng: -117.9143, zoom: 10 }, // Orange County
      { lat: 34.1083, lng: -117.2898, zoom: 10 }, // Inland Empire
    ]

    // Generate tile URLs for popular areas
    const tilePromises = []

    popularAreas.forEach(area => {
      const { x, y } = latLngToTile(area.lat, area.lng, area.zoom)

      // Cache a 3x3 grid around each popular area
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const tileUrl = `https://tile.openstreetmap.org/${area.zoom}/${x + dx}/${y + dy}.png`
          tilePromises.push(
            fetch(tileUrl)
              .then(response => {
                if (response.ok) {
                  return cache.put(tileUrl, response)
                }
              })
              .catch(err => console.log('Failed to cache tile:', tileUrl, err))
          )
        }
      }
    })

    await Promise.allSettled(tilePromises)
    console.log('Service Worker: Map tiles cached successfully')
  } catch (error) {
    console.error('Service Worker: Failed to cache map tiles:', error)
  }
}

// Convert lat/lng to tile coordinates
function latLngToTile(lat, lng, zoom) {
  const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom))
  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
  return { x, y }
}
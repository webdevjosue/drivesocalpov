module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/map/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * MapLibre GL configuration for Drive SoCal POV
 * Mobile-optimized settings using OpenStreetMap tiles
 * Completely free solution with no API tokens required
 * Updated for @vis.gl/react-maplibre v8
 */ __turbopack_context__.s([
    "BOUNDS_UTILS",
    ()=>BOUNDS_UTILS,
    "EXPANDED_BOUNDS",
    ()=>EXPANDED_BOUNDS,
    "GTA_MAP_STYLES",
    ()=>GTA_MAP_STYLES,
    "MAP_CONFIG",
    ()=>MAP_CONFIG,
    "MARKER_STYLE_CONFIG",
    ()=>MARKER_STYLE_CONFIG,
    "MOBILE_PERFORMANCE_CONFIG",
    ()=>MOBILE_PERFORMANCE_CONFIG,
    "OPENSTREETMAP_STYLES",
    ()=>OPENSTREETMAP_STYLES,
    "OPENSTREETMAP_TILES",
    ()=>OPENSTREETMAP_TILES,
    "PERFORMANCE_THRESHOLDS",
    ()=>PERFORMANCE_THRESHOLDS,
    "SOUTHERN_CALIFORNIA_BOUNDS",
    ()=>SOUTHERN_CALIFORNIA_BOUNDS,
    "TOUCH_GESTURE_CONFIG",
    ()=>TOUCH_GESTURE_CONFIG,
    "getOptimizedConfig",
    ()=>getOptimizedConfig,
    "validateMapEnvironment",
    ()=>validateMapEnvironment
]);
const SOUTHERN_CALIFORNIA_BOUNDS = {
    north: 35.5,
    south: 32.5,
    east: -117.0,
    west: -118.8
};
const EXPANDED_BOUNDS = {
    north: 34.6,
    south: 31.5,
    east: -113.5,
    west: -120.5
};
const OPENSTREETMAP_TILES = {
    // Standard OpenStreetMap tiles (free, no attribution required beyond standard)
    standard: {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    },
    // CartoDB (free, based on OpenStreetMap data)
    cartodb: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors © CartoDB',
        maxZoom: 19
    },
    // CartoDB Dark theme
    cartodb_dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors © CartoDB',
        maxZoom: 19
    },
    // OpenTopoMap (topographic maps)
    opentopomap: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors © OpenTopoMap',
        maxZoom: 17
    },
    // Stamen Toner (artistic maps)
    stamen_toner: {
        url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors © Stamen Design',
        maxZoom: 20
    },
    // Stamen Terrain (terrain maps)
    stamen_terrain: {
        url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors © Stamen Design',
        maxZoom: 18
    }
};
const OPENSTREETMAP_STYLES = {
    // Standard OSM style
    osm_standard: {
        version: 8,
        name: 'OpenStreetMap Standard',
        sources: {
            'osm-tiles': {
                type: 'raster',
                tiles: [
                    OPENSTREETMAP_TILES.standard.url
                ],
                tileSize: 256,
                attribution: OPENSTREETMAP_TILES.standard.attribution,
                maxzoom: OPENSTREETMAP_TILES.standard.maxZoom
            }
        },
        layers: [
            {
                id: 'osm-tiles-layer',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: OPENSTREETMAP_TILES.standard.maxZoom
            }
        ]
    },
    // CartoDB Light style
    cartodb_light: {
        version: 8,
        name: 'CartoDB Light',
        sources: {
            'cartodb-tiles': {
                type: 'raster',
                tiles: [
                    OPENSTREETMAP_TILES.cartodb.url
                ],
                tileSize: 256,
                attribution: OPENSTREETMAP_TILES.cartodb.attribution,
                maxzoom: OPENSTREETMAP_TILES.cartodb.maxZoom
            }
        },
        layers: [
            {
                id: 'cartodb-tiles-layer',
                type: 'raster',
                source: 'cartodb-tiles',
                minzoom: 0,
                maxzoom: OPENSTREETMAP_TILES.cartodb.maxZoom
            }
        ]
    },
    // CartoDB Dark style
    cartodb_dark: {
        version: 8,
        name: 'CartoDB Dark',
        sources: {
            'cartodb-dark-tiles': {
                type: 'raster',
                tiles: [
                    OPENSTREETMAP_TILES.cartodb_dark.url
                ],
                tileSize: 256,
                attribution: OPENSTREETMAP_TILES.cartodb_dark.attribution,
                maxzoom: OPENSTREETMAP_TILES.cartodb_dark.maxZoom
            }
        },
        layers: [
            {
                id: 'cartodb-dark-tiles-layer',
                type: 'raster',
                source: 'cartodb-dark-tiles',
                minzoom: 0,
                maxzoom: OPENSTREETMAP_TILES.cartodb_dark.maxZoom
            }
        ]
    },
    // Stamen Toner style
    stamen_toner: {
        version: 8,
        name: 'Stamen Toner',
        sources: {
            'stamen-toner-tiles': {
                type: 'raster',
                tiles: [
                    OPENSTREETMAP_TILES.stamen_toner.url
                ],
                tileSize: 256,
                attribution: OPENSTREETMAP_TILES.stamen_toner.attribution,
                maxzoom: OPENSTREETMAP_TILES.stamen_toner.maxZoom
            }
        },
        layers: [
            {
                id: 'stamen-toner-tiles-layer',
                type: 'raster',
                source: 'stamen-toner-tiles',
                minzoom: 0,
                maxzoom: OPENSTREETMAP_TILES.stamen_toner.maxZoom
            }
        ]
    }
};
const MAP_CONFIG = {
    // Optimized initial view for mobile devices
    initialViewState: {
        longitude: -118.2437,
        latitude: 34.0522,
        zoom: 11,
        pitch: 0,
        bearing: 0
    },
    // Custom boundaries: Palmdale (N), Ensenada (S), Yuma (E), Santa Barbara (W)
    // Strict enforcement prevents panning outside these bounds
    maxBounds: [
        [
            EXPANDED_BOUNDS.west,
            EXPANDED_BOUNDS.south
        ],
        [
            EXPANDED_BOUNDS.east,
            EXPANDED_BOUNDS.north
        ]
    ],
    // OpenStreetMap configuration - Completely free tiles, no API tokens required
    mapStyle: OPENSTREETMAP_STYLES.osm_standard,
    projection: 'mercator',
    // Mobile-optimized touch interactions (per official docs)
    dragPan: true,
    dragRotate: false,
    scrollZoom: true,
    doubleClickZoom: false,
    touchZoomRotate: true,
    touchPitch: false,
    keyboard: false,
    // Performance-optimized zoom levels
    maxZoom: 18,
    minZoom: 8,
    maxPitch: 0,
    minPitch: 0,
    // Rendering optimization settings
    reuseMaps: true
};
const GTA_MAP_STYLES = {
    day: OPENSTREETMAP_STYLES.osm_standard,
    night: OPENSTREETMAP_STYLES.cartodb_dark,
    satellite: OPENSTREETMAP_STYLES.cartodb_light,
    hybrid: OPENSTREETMAP_STYLES.cartodb_light,
    streets: OPENSTREETMAP_STYLES.stamen_toner
};
const MOBILE_PERFORMANCE_CONFIG = {
    // Reduce tile requests for better mobile performance
    maxTileCacheSize: 50,
    enableCollisionDetection: true,
    enableTerrain: false,
    enable3D: false,
    // Optimized rendering settings
    fadeDuration: 300,
    antialias: false,
    // Resource optimization (per official docs)
    renderWorldCopies: false,
    preserveDrawingBuffer: false
};
const TOUCH_GESTURE_CONFIG = {
    // Enhanced mobile touch settings
    cooperativeGestures: true,
    touchZoomRotate: true,
    touchPitch: false,
    // Performance optimizations
    touchAction: 'pan-y',
    // Gesture sensitivity settings
    zoomSpeed: 0.5,
    panSpeed: 1.0
};
const PERFORMANCE_THRESHOLDS = {
    // Frame rate targets
    TARGET_FPS: 60,
    MINIMUM_FPS: 30,
    // Memory limits (in MB)
    MAX_MEMORY_USAGE: 150,
    MAX_TILE_MEMORY: 50,
    // Network performance (in milliseconds)
    TILE_LOAD_TIMEOUT: 5000,
    API_REQUEST_TIMEOUT: 3000,
    // Touch response times
    TOUCH_RESPONSE_TIME: 100,
    GESTURE_RESPONSE_TIME: 16
};
const MARKER_STYLE_CONFIG = {
    // Touch target size (44px minimum per Apple HIG)
    touchTargetSize: 44,
    // Visual sizes
    small: 32,
    medium: 40,
    large: 48,
    // Z-index layers for proper visual hierarchy
    layers: {
        base: 100,
        markers: 200,
        clusters: 300,
        selected: 400,
        userLocation: 500,
        popups: 600,
        controls: 700
    }
};
const BOUNDS_UTILS = {
    // Check if coordinates are within original Southern California bounds
    isInSouthernCalifornia: (lat, lng)=>{
        return lat >= SOUTHERN_CALIFORNIA_BOUNDS.south && lat <= SOUTHERN_CALIFORNIA_BOUNDS.north && lng >= SOUTHERN_CALIFORNIA_BOUNDS.west && lng <= SOUTHERN_CALIFORNIA_BOUNDS.east;
    },
    // Check if coordinates are within expanded bounds (for local development)
    isInExpandedBounds: (lat, lng)=>{
        return lat >= EXPANDED_BOUNDS.south && lat <= EXPANDED_BOUNDS.north && lng >= EXPANDED_BOUNDS.west && lng <= EXPANDED_BOUNDS.east;
    },
    // Clamp coordinates to expanded bounds (for local development)
    clampToExpandedBounds: (lat, lng)=>{
        return [
            Math.max(EXPANDED_BOUNDS.west, Math.min(EXPANDED_BOUNDS.east, lng)),
            Math.max(EXPANDED_BOUNDS.south, Math.min(EXPANDED_BOUNDS.north, lat))
        ];
    },
    // Clamp coordinates to Southern California bounds (original restrictive behavior)
    clampToSouthernCalifornia: (lat, lng)=>{
        return [
            Math.max(SOUTHERN_CALIFORNIA_BOUNDS.west, Math.min(SOUTHERN_CALIFORNIA_BOUNDS.east, lng)),
            Math.max(SOUTHERN_CALIFORNIA_BOUNDS.south, Math.min(SOUTHERN_CALIFORNIA_BOUNDS.north, lat))
        ];
    },
    // Calculate center point of expanded bounds (for local development)
    getExpandedBoundsCenter: ()=>{
        return [
            (EXPANDED_BOUNDS.west + EXPANDED_BOUNDS.east) / 2,
            (EXPANDED_BOUNDS.south + EXPANDED_BOUNDS.north) / 2
        ];
    },
    // Calculate center point of Southern California (original)
    getSouthernCaliforniaCenter: ()=>{
        return [
            (SOUTHERN_CALIFORNIA_BOUNDS.west + SOUTHERN_CALIFORNIA_BOUNDS.east) / 2,
            (SOUTHERN_CALIFORNIA_BOUNDS.south + SOUTHERN_CALIFORNIA_BOUNDS.north) / 2
        ];
    }
};
function validateMapEnvironment() {
    // OpenStreetMap tiles are free and don't require any API tokens
    // No validation needed for free tile sources
    if ("TURBOPACK compile-time truthy", 1) {
        console.log('✅ Using OpenStreetMap tiles - Completely free with no API tokens required!\n' + '🗺️  Tile sources: OpenStreetMap, CartoDB, Stamen Design\n' + '📍  Coverage: Worldwide\n' + '🔄  Max Zoom: 19-20 depending on style\n' + '💰  Cost: FREE');
    }
}
function getOptimizedConfig() {
    // Check for mobile device
    const isMobile = "undefined" !== 'undefined' && 'ontouchstart' in window && window.innerWidth <= 768;
    // Check for low-end device
    const isLowEnd = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 || navigator.deviceMemory && navigator.deviceMemory <= 2);
    const config = {};
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (isLowEnd) {
        // Low-end device optimizations
        Object.assign(config, {
            maxTileCacheSize: 25,
            fadeDuration: 0,
            renderWorldCopies: false
        });
    }
    return config;
}
}),
"[project]/src/store/mapStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Map state management using Zustand
 * Optimized for mobile performance and React 19 concurrency
 */ __turbopack_context__.s([
    "useMapActions",
    ()=>useMapActions,
    "useMapEffect",
    ()=>useMapEffect,
    "useMapInteractionState",
    ()=>useMapInteractionState,
    "useMapLoadingState",
    ()=>useMapLoadingState,
    "useMapPerformanceMonitor",
    ()=>useMapPerformanceMonitor,
    "useMapPerformanceState",
    ()=>useMapPerformanceState,
    "useMapStore",
    ()=>useMapStore,
    "useMapViewState",
    ()=>useMapViewState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/map/config.ts [app-ssr] (ecmascript)");
;
;
;
;
const useMapStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeWithSelector"])((set, get)=>({
        // View state
        viewState: null,
        setViewState: (viewState)=>set({
                viewState
            }),
        // Map style and theme
        mapStyle: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OPENSTREETMAP_STYLES"].osm_standard,
        mapTheme: 'day',
        setMapStyle: (mapStyle)=>set({
                mapStyle
            }),
        setMapTheme: (mapTheme)=>{
            set({
                mapTheme,
                mapStyle: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GTA_MAP_STYLES"][mapTheme]
            });
        },
        // Boundaries
        boundaries: null,
        updateBoundaries: (boundaries)=>set({
                boundaries
            }),
        // Map instance
        map: null,
        setMap: (map)=>set({
                map
            }),
        // UI state
        isFullscreen: false,
        setIsFullscreen: (isFullscreen)=>set({
                isFullscreen
            }),
        // Interaction state
        isDragging: false,
        isZooming: false,
        isRotating: false,
        setIsDragging: (isDragging)=>set({
                isDragging
            }),
        setIsZooming: (isZooming)=>set({
                isZooming
            }),
        setIsRotating: (isRotating)=>set({
                isRotating
            }),
        // Performance
        performanceMode: false,
        performanceConfig: {
            enablePerformanceMode: false,
            maxTileCacheSize: 50,
            enableCollisionDetection: true,
            enableTerrain: false,
            enable3D: false,
            antialias: false,
            fadeDuration: 300
        },
        setPerformanceMode: (performanceMode)=>set({
                performanceMode
            }),
        setPerformanceConfig: (configUpdate)=>set((state)=>({
                    performanceConfig: {
                        ...state.performanceConfig,
                        ...configUpdate
                    }
                })),
        // Loading states
        isLoading: true,
        isStyleLoaded: false,
        isSourceLoaded: false,
        setLoading: (isLoading)=>set({
                isLoading
            }),
        setStyleLoaded: (isStyleLoaded)=>set({
                isStyleLoaded
            }),
        setSourceLoaded: (isSourceLoaded)=>set({
                isSourceLoaded
            }),
        // Error handling
        error: null,
        setError: (error)=>set({
                error
            }),
        // Animation state
        isAnimating: false,
        setIsAnimating: (isAnimating)=>set({
                isAnimating
            }),
        // Mobile-specific state
        touchEnabled: true,
        gesturesEnabled: true,
        setTouchEnabled: (touchEnabled)=>set({
                touchEnabled
            }),
        setGesturesEnabled: (gesturesEnabled)=>set({
                gesturesEnabled
            }),
        // Cache management
        tileCache: new Map(),
        clearTileCache: ()=>set({
                tileCache: new Map()
            }),
        addToTileCache: (key, data)=>{
            const { tileCache } = get();
            const newCache = new Map(tileCache);
            newCache.set(key, data);
            set({
                tileCache: newCache
            });
        },
        // Viewport tracking
        viewport: null,
        setViewport: (viewport)=>set({
                viewport
            })
    })), {
    name: 'map-store'
}));
const useMapViewState = ()=>useMapStore((state)=>state.viewState);
const useMapLoadingState = ()=>useMapStore((state)=>({
            isLoading: state.isLoading,
            isStyleLoaded: state.isStyleLoaded,
            isSourceLoaded: state.isSourceLoaded,
            error: state.error
        }));
const useMapInteractionState = ()=>useMapStore((state)=>({
            isDragging: state.isDragging,
            isZooming: state.isZooming,
            isRotating: state.isRotating,
            isAnimating: state.isAnimating
        }));
const useMapPerformanceState = ()=>useMapStore((state)=>({
            performanceMode: state.performanceMode,
            performanceConfig: state.performanceConfig
        }));
const useMapActions = ()=>useMapStore((state)=>({
            // Animate to new location
            flyTo: (coordinates, zoom)=>{
                const { map } = state;
                if (!map) return;
                map.flyTo({
                    center: coordinates,
                    zoom: zoom || map.getZoom(),
                    duration: 1000,
                    essential: true
                });
            },
            // Ease to new location
            easeTo: (coordinates, zoom)=>{
                const { map } = state;
                if (!map) return;
                map.easeTo({
                    center: coordinates,
                    zoom: zoom || map.getZoom(),
                    duration: 500,
                    essential: true
                });
            },
            // Jump to new location (no animation)
            jumpTo: (coordinates, zoom)=>{
                const { map } = state;
                if (!map) return;
                map.jumpTo({
                    center: coordinates,
                    zoom: zoom || map.getZoom()
                });
            },
            // Reset map to initial view
            resetView: ()=>{
                const { map } = state;
                if (!map) return;
                map.flyTo({
                    center: [
                        -118.2437,
                        34.0522
                    ],
                    zoom: 11,
                    bearing: 0,
                    pitch: 0,
                    duration: 1500
                });
            },
            // Toggle fullscreen mode
            toggleFullscreen: ()=>{
                const { isFullscreen, setIsFullscreen, map } = state;
                if (!map) return;
                if (isFullscreen) {
                    // Exit fullscreen
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                } else {
                    // Enter fullscreen
                    const mapContainer = map.getContainer();
                    if (mapContainer.requestFullscreen) {
                        mapContainer.requestFullscreen();
                    }
                }
                setIsFullscreen(!isFullscreen);
            },
            // Optimize performance for mobile
            optimizeForMobile: ()=>{
                const { setPerformanceMode, setPerformanceConfig } = state;
                setPerformanceMode(true);
                setPerformanceConfig({
                    maxTileCacheSize: 25,
                    fadeDuration: 0,
                    antialias: false,
                    enableTerrain: false,
                    enable3D: false
                });
            },
            // Restore normal performance settings
            restorePerformance: ()=>{
                const { setPerformanceMode, setPerformanceConfig } = state;
                setPerformanceMode(false);
                setPerformanceConfig({
                    maxTileCacheSize: 50,
                    fadeDuration: 300,
                    antialias: false,
                    enableTerrain: false,
                    enable3D: false
                });
            }
        }));
const useMapEffect = (effect, deps)=>{
    const map = useMapStore((state)=>state.map);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (map) {
            return effect(map);
        }
    }, [
        map,
        ...deps || []
    ]);
};
const useMapPerformanceMonitor = ()=>{
    const { map, performanceMode, setPerformanceMode } = useMapStore();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (!map) return;
        let frameCount = 0;
        let lastTime = performance.now();
        let fpsTimeout;
        const measureFPS = ()=>{
            frameCount++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / deltaTime);
                // Auto-enable performance mode if FPS is too low
                if (fps < 30 && !performanceMode) {
                    console.warn(`Low FPS detected: ${fps}, enabling performance mode`);
                    setPerformanceMode(true);
                }
                frameCount = 0;
                lastTime = currentTime;
            }
            fpsTimeout = requestAnimationFrame(measureFPS);
        };
        fpsTimeout = requestAnimationFrame(measureFPS);
        return ()=>{
            cancelAnimationFrame(fpsTimeout);
        };
    }, [
        map,
        performanceMode,
        setPerformanceMode
    ]);
};
}),
"[project]/src/hooks/useIsMobile.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mobile Detection Hook - Drive SoCal POV
 * Optimized mobile device detection following official documentation
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getDeviceType",
    ()=>getDeviceType,
    "isMobileBrowser",
    ()=>isMobileBrowser,
    "useIsMobile",
    ()=>useIsMobile,
    "useMobileDeviceInfo",
    ()=>useMobileDeviceInfo,
    "useMobilePerformance",
    ()=>useMobilePerformance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useIsMobile() {
    const [deviceInfo, setDeviceInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isMobile: false,
        isTablet: false,
        isTouchDevice: false,
        devicePixelRatio: 1,
        screenWidth: 1920,
        screenHeight: 1080,
        orientation: 'landscape',
        isLowEndDevice: false,
        connectionType: 'unknown',
        memoryInfo: {}
    });
    // Update device information
    const updateDeviceInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        // Mobile detection based on screen size and touch capabilities
        const isMobile = width <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        // Tablet detection (larger touch devices)
        const isTablet = !isMobile && (width >= 768 && width <= 1024 || height >= 768 && height <= 1024) && 'ontouchstart' in window;
        // Touch device detection
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        // Orientation detection
        const orientation = width > height ? 'landscape' : 'portrait';
        // Low-end device detection
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const deviceMemory = navigator.deviceMemory || 4;
        const connection = navigator.connection;
        const isLowEndDevice = hardwareConcurrency <= 4 || deviceMemory <= 2 || connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData === true);
        // Connection type
        const connectionType = connection?.effectiveType || 'unknown';
        const newDeviceInfo = {
            isMobile,
            isTablet,
            isTouchDevice,
            devicePixelRatio: pixelRatio,
            screenWidth: width,
            screenHeight: height,
            orientation,
            isLowEndDevice,
            connectionType,
            memoryInfo: {
                deviceMemory,
                hardwareConcurrency
            }
        };
        setDeviceInfo(newDeviceInfo);
    }, []);
    // Initial detection and event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        updateDeviceInfo();
        // Handle resize events
        const handleResize = ()=>{
            updateDeviceInfo();
        };
        // Handle orientation changes
        const handleOrientationChange = ()=>{
            // Small delay to get accurate dimensions after orientation change
            setTimeout(updateDeviceInfo, 100);
        };
        // Handle connection changes
        const handleConnectionChange = ()=>{
            updateDeviceInfo();
        };
        // Add event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);
        // Connection change listener (if available)
        const connection = navigator.connection;
        if (connection) {
            connection.addEventListener('change', handleConnectionChange);
        }
        // Cleanup
        return ()=>{
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
            if (connection) {
                connection.removeEventListener('change', handleConnectionChange);
            }
        };
    }, [
        updateDeviceInfo
    ]);
    // Debug logging in development
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('Mobile device info:', deviceInfo);
        }
    }, [
        deviceInfo
    ]);
    // Return just the boolean for simple cases
    return deviceInfo.isMobile;
}
function useMobileDeviceInfo() {
    const [deviceInfo, setDeviceInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isMobile: false,
        isTablet: false,
        isTouchDevice: false,
        devicePixelRatio: 1,
        screenWidth: 1920,
        screenHeight: 1080,
        orientation: 'landscape',
        isLowEndDevice: false,
        connectionType: 'unknown',
        memoryInfo: {}
    });
    const updateDeviceInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        // Enhanced mobile detection
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isSmallScreen = width <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobile = isMobileUA || isSmallScreen || isTouchDevice;
        // Tablet detection with better accuracy
        const isTablet = !isMobile && (width >= 768 && width <= 1024 || height >= 768 && height <= 1024) && isTouchDevice && (/ipad|tablet/i.test(userAgent) || isSmallScreen);
        // Device-specific detection
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const isAndroid = /android/i.test(userAgent);
        const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
        const isChrome = /chrome/i.test(userAgent);
        // Performance capabilities
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const deviceMemory = navigator.deviceMemory || 4;
        const connection = navigator.connection;
        const isLowEndDevice = hardwareConcurrency <= 4 || deviceMemory <= 2 || connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData === true);
        // Enhanced connection info
        const connectionInfo = connection ? {
            type: connection.effectiveType || 'unknown',
            downlink: connection.downlink || 'unknown',
            rtt: connection.rtt || 'unknown',
            saveData: connection.saveData || false
        } : {
            type: 'unknown',
            downlink: 'unknown',
            rtt: 'unknown',
            saveData: false
        };
        const newDeviceInfo = {
            isMobile,
            isTablet,
            isTouchDevice,
            devicePixelRatio: pixelRatio,
            screenWidth: width,
            screenHeight: height,
            orientation: width > height ? 'landscape' : 'portrait',
            isLowEndDevice,
            connectionType: connectionInfo.type,
            memoryInfo: {
                deviceMemory,
                hardwareConcurrency
            }
        };
        setDeviceInfo(newDeviceInfo);
        // Store additional info for debugging
        if ("TURBOPACK compile-time truthy", 1) {
            window.__deviceInfo = {
                ...newDeviceInfo,
                userAgent,
                isIOS,
                isAndroid,
                isSafari,
                isChrome,
                connectionInfo
            };
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        updateDeviceInfo();
        const handleResize = ()=>updateDeviceInfo();
        const handleOrientationChange = ()=>setTimeout(updateDeviceInfo, 100);
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);
        const connection = navigator.connection;
        if (connection) {
            connection.addEventListener('change', updateDeviceInfo);
        }
        return ()=>{
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
            if (connection) {
                connection.removeEventListener('change', updateDeviceInfo);
            }
        };
    }, [
        updateDeviceInfo
    ]);
    return deviceInfo;
}
function useMobilePerformance() {
    const deviceInfo = useMobileDeviceInfo();
    const shouldReduceAnimations = deviceInfo.isLowEndDevice || deviceInfo.connectionType === 'slow-2g' || deviceInfo.connectionType === '2g' || deviceInfo.connectionType === '3g' && deviceInfo.isMobile;
    const shouldReduceQuality = deviceInfo.isLowEndDevice || deviceInfo.connectionType === 'slow-2g' || deviceInfo.connectionType === '2g';
    // Determine max concurrent requests based on connection
    let maxConcurrentRequests = 6 // Default
    ;
    switch(deviceInfo.connectionType){
        case 'slow-2g':
        case '2g':
            maxConcurrentRequests = 2;
            break;
        case '3g':
            maxConcurrentRequests = 4;
            break;
        case '4g':
            maxConcurrentRequests = 6;
            break;
        default:
            maxConcurrentRequests = deviceInfo.isMobile ? 4 : 6;
    }
    return {
        isMobile: deviceInfo.isMobile,
        isLowEnd: deviceInfo.isLowEndDevice,
        shouldReduceAnimations,
        shouldReduceQuality,
        maxConcurrentRequests
    };
}
function isMobileBrowser() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const userAgent = undefined;
    const mobileKeywords = undefined;
}
function getDeviceType() {
    if ("TURBOPACK compile-time truthy", 1) return 'desktop';
    //TURBOPACK unreachable
    ;
    const width = undefined;
    const isTouchDevice = undefined;
}
const __TURBOPACK__default__export__ = useIsMobile;
}),
"[project]/src/components/map/MapProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Map Provider Component - Drive SoCal POV
 * Mobile-optimized MapLibre GL integration following official documentation
 * Updated for @vis.gl/react-maplibre v8
 */ __turbopack_context__.s([
    "MapProvider",
    ()=>MapProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "withMapProvider",
    ()=>withMapProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vis$2e$gl$2f$react$2d$maplibre$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@vis.gl/react-maplibre/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/map/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/mapStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useIsMobile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useIsMobile.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function MapProvider({ children, className = '', onMapLoad, onMapError, enablePerformanceMode: enablePerfMode = true }) {
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useIsMobile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIsMobile"])();
    const { setMap, mapStyle, setLoading, setStyleLoaded, setError, setPerformanceMode, setViewport } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"])();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const performanceTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // const [mapLoading, setMapLoading] = useState(true)
    // Mobile-optimized configuration
    const mapConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const baseConfig = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAP_CONFIG"],
            mapStyle: mapStyle || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAP_CONFIG"].mapStyle,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOBILE_PERFORMANCE_CONFIG"]
        };
        // Apply device-specific optimizations
        const deviceConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOptimizedConfig"])();
        const optimizedConfig = {
            ...baseConfig,
            ...deviceConfig
        };
        // Additional mobile-specific settings
        if (isMobile) {
            return {
                ...optimizedConfig,
                // Enhanced mobile touch settings (per official docs)
                touchZoomRotate: true,
                touchPitch: false,
                dragRotate: false,
                // Disable double-click zoom on mobile (use pinch instead)
                doubleClickZoom: false,
                // Optimize tile loading for mobile
                maxTileCacheSize: enablePerfMode ? 25 : 50,
                // Reduce animation complexity on mobile
                transitionDuration: enablePerfMode ? 0 : 200,
                // Better gesture handling
                cooperativeGestures: true
            };
        }
        return optimizedConfig;
    }, [
        isMobile,
        mapStyle,
        enablePerfMode
    ]);
    // Map load handler with mobile optimizations
    const handleMapLoad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const map = event.target;
        mapRef.current = map;
        // Set map instance in store
        setMap(map);
        // setMapLoading(false)
        setLoading(false);
        setStyleLoaded(true);
        // Set maxBounds for ALL users to enforce boundaries
        map.setMaxBounds(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAP_CONFIG"].maxBounds);
        map.setRenderWorldCopies(false);
        // Mobile-specific optimizations
        if (isMobile) {
            // Enable touch gestures
            map.touchZoomRotate.enable();
            map.dragPan.enable();
            map.dragRotate.disable();
            map.touchPitch.disable();
            // Optimize for mobile rendering
            const canvas = map.getCanvas();
            if (canvas) {
                const devicePixelRatio = window.devicePixelRatio;
                if (devicePixelRatio > 2) {
                    // Reduce rendering quality on high-DPI devices for performance
                    canvas.style.imageRendering = 'optimizeSpeed';
                }
                // Enable hardware acceleration
                canvas.style.transform = 'translateZ(0)';
            }
            // Optimize font rendering for mobile
            if (map.style && map.style.glyphs) {
                // Force better font rendering on mobile
                canvas.style.fontSmooth = 'always';
                canvas.style.webkitFontSmoothing = 'antialiased';
            }
        }
        // Performance mode setup
        if (enablePerfMode) {
            setPerformanceMode(true);
            // Reduce tile requests on slower connections
            const connection = navigator.connection;
            if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
                map.setMaxTileCacheSize(25);
            }
            // Monitor performance
            setupPerformanceMonitoring(map);
        }
        // Set viewport information
        setViewport({
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio
        });
        // Custom load callback
        if (onMapLoad) {
            onMapLoad(map);
        }
        console.log('Map loaded successfully:', {
            isMobile,
            performanceMode: enablePerfMode,
            config: mapConfig
        });
    }, [
        isMobile,
        setMap,
        setLoading,
        setStyleLoaded,
        setPerformanceMode,
        setViewport,
        onMapLoad,
        enablePerfMode,
        mapConfig
    ]);
    // Error handling with fallback strategies
    const handleError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((error)=>{
        console.error('Map loading error:', error);
        // Set error state
        setError(error);
        // Try to recover from common errors
        if (error.error?.message) {
            const errorMessage = error.error.message.toLowerCase();
            // Style loading error - try fallback style
            if (errorMessage.includes('style') || errorMessage.includes('tile')) {
                console.log('Attempting fallback map style...');
                // Reset to basic OpenStreetMap style (free fallback)
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAP_CONFIG"].mapStyle = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OPENSTREETMAP_STYLES"].osm_standard;
            }
            // Authentication error
            if (errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
                console.error('Map authentication error. Check your API token.');
            }
            // Network error
            if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                console.log('Network error detected. Retrying in 5 seconds...');
                setTimeout(()=>{
                    window.location.reload();
                }, 5000);
            }
        }
        // Custom error callback
        if (onMapError) {
            onMapError(error);
        }
    }, [
        setError,
        onMapError
    ]);
    // Performance monitoring setup
    const setupPerformanceMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((map)=>{
        let frameCount = 0;
        let lastTime = performance.now();
        const measurePerformance = ()=>{
            frameCount++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / deltaTime);
                // Adjust performance based on FPS
                if (fps < 30) {
                    console.warn(`Low FPS detected: ${fps}, enabling performance optimizations`);
                    // Reduce tile requests
                    map.setMaxTileCacheSize(25);
                    // Disable animations
                    if (map.setPaintProperty) {
                        map.setPaintProperty('background', 'background-color', '#1a1a1a');
                    }
                    // Enable performance mode if not already enabled
                    setPerformanceMode(true);
                }
                frameCount = 0;
                lastTime = currentTime;
            }
            if (mapRef.current) {
                performanceTimerRef.current = requestAnimationFrame(measurePerformance);
            }
        };
        performanceTimerRef.current = requestAnimationFrame(measurePerformance);
    }, [
        setPerformanceMode
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (performanceTimerRef.current) {
                cancelAnimationFrame(performanceTimerRef.current);
            }
        };
    }, []);
    // Handle window resize
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleResize = ()=>{
            if (mapRef.current) {
                setViewport({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    pixelRatio: window.devicePixelRatio
                });
                mapRef.current.resize();
            }
        };
        window.addEventListener('resize', handleResize);
        return ()=>window.removeEventListener('resize', handleResize);
    }, [
        setViewport
    ]);
    // Handle visibility change (performance optimization)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleVisibilityChange = ()=>{
            if (mapRef.current) {
                if (document.hidden) {
                // Pause rendering when tab is not visible
                // Note: MapLibre GL doesn't have built-in pause/resume like some other libraries
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return ()=>document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `map-provider ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vis$2e$gl$2f$react$2d$maplibre$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
            ...mapConfig,
            ref: mapRef,
            onLoad: handleMapLoad,
            onError: handleError,
            attributionControl: false,
            // Event handlers for debugging
            onClick: (e)=>{
                // Log clicks for debugging
                if ("TURBOPACK compile-time truthy", 1) {
                    console.log('Map clicked:', e.lngLat);
                }
            },
            onMove: ()=>{
                // Update view state in store and enforce bounds strictly
                if (mapRef.current) {
                    const center = mapRef.current.getCenter();
                    const zoom = mapRef.current.getZoom();
                    const bearing = mapRef.current.getBearing();
                    const pitch = mapRef.current.getPitch();
                    // Check if center is within bounds
                    const bounds = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAP_CONFIG"].maxBounds;
                    const [[west, south], [east, north]] = bounds;
                    // If outside bounds, immediately snap back to bounds
                    const clampedLng = Math.max(west, Math.min(east, center.lng));
                    const clampedLat = Math.max(south, Math.min(north, center.lat));
                    // Strict bounds enforcement - if outside bounds, immediately return
                    if (clampedLng !== center.lng || clampedLat !== center.lat) {
                        // Immediately jump back to bounds without animation
                        mapRef.current.jumpTo({
                            center: [
                                clampedLng,
                                clampedLat
                            ],
                            zoom: zoom,
                            bearing: bearing,
                            pitch: pitch
                        });
                        // Update view state with clamped coordinates
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"].getState().setViewState({
                            longitude: clampedLng,
                            latitude: clampedLat,
                            zoom,
                            bearing,
                            pitch,
                            padding: {
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0
                            }
                        });
                        return;
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"].getState().setViewState({
                        longitude: center.lng,
                        latitude: center.lat,
                        zoom,
                        bearing,
                        pitch,
                        padding: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                        }
                    });
                }
            },
            onMoveStart: ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"].getState().setIsDragging(true);
            },
            onMoveEnd: ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"].getState().setIsDragging(false);
            },
            onZoomStart: ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"].getState().setIsZooming(true);
            },
            onZoomEnd: ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"].getState().setIsZooming(false);
                // Enforce zoom bounds
                if (mapRef.current) {
                    const zoom = mapRef.current.getZoom();
                    const minZoom = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAP_CONFIG"].minZoom || 8;
                    const maxZoom = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAP_CONFIG"].maxZoom || 18;
                    if (zoom < minZoom) {
                        mapRef.current.setZoom(minZoom);
                    } else if (zoom > maxZoom) {
                        mapRef.current.setZoom(maxZoom);
                    }
                }
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/map/MapProvider.tsx",
            lineNumber: 287,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/map/MapProvider.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
function withMapProvider(Component) {
    return function WrappedComponent({ mapProviderProps, ...props }) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MapProvider, {
            ...mapProviderProps || {},
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/map/MapProvider.tsx",
                lineNumber: 387,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/map/MapProvider.tsx",
            lineNumber: 386,
            columnNumber: 7
        }, this);
    };
}
const __TURBOPACK__default__export__ = MapProvider;
}),
"[project]/src/hooks/useMobilePerformance.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mobile Performance Hook - Drive SoCal POV
 * Monitors and optimizes performance for mobile devices
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useMapPerformance",
    ()=>useMapPerformance,
    "useMobilePerformance",
    ()=>useMobilePerformance,
    "usePerformanceAnimation",
    ()=>usePerformanceAnimation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useMobilePerformance() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        metrics: {
            fps: 60,
            renderTime: 0,
            tileCount: 0,
            deviceLoad: 0
        },
        isLowEndDevice: false,
        shouldReduceAnimations: false,
        shouldReduceQuality: false,
        maxConcurrentRequests: 6,
        isPerformanceMode: false
    });
    const frameCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(performance.now());
    const observersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    // Detect device capabilities
    const detectDeviceCapabilities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const deviceMemory = navigator.deviceMemory || 4;
        const connection = navigator.connection;
        // Determine if low-end device
        const isLowEndDevice = hardwareConcurrency <= 4 || deviceMemory <= 2 || connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData === true);
        // Determine performance settings
        const shouldReduceAnimations = isLowEndDevice || connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g');
        const shouldReduceQuality = isLowEndDevice || connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        // Determine max concurrent requests
        let maxConcurrentRequests = 6;
        if (connection) {
            switch(connection.effectiveType){
                case 'slow-2g':
                case '2g':
                    maxConcurrentRequests = 2;
                    break;
                case '3g':
                    maxConcurrentRequests = 4;
                    break;
                case '4g':
                    maxConcurrentRequests = 6;
                    break;
                default:
                    maxConcurrentRequests = isLowEndDevice ? 4 : 6;
            }
        }
        return {
            isLowEndDevice,
            shouldReduceAnimations,
            shouldReduceQuality,
            maxConcurrentRequests,
            connectionType: connection?.effectiveType || 'unknown'
        };
    }, []);
    // FPS monitoring
    const startFPSMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        let animationId;
        const measureFPS = ()=>{
            frameCountRef.current++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTimeRef.current;
            if (deltaTime >= 1000) {
                const fps = Math.round(frameCountRef.current * 1000 / deltaTime);
                setState((prevState)=>({
                        ...prevState,
                        metrics: {
                            ...prevState.metrics,
                            fps
                        }
                    }));
                // Auto-enable performance mode if FPS is too low
                if (fps < 30 && !state.isPerformanceMode) {
                    console.warn(`Low FPS detected: ${fps}, enabling performance mode`);
                    setState((prevState)=>({
                            ...prevState,
                            isPerformanceMode: true,
                            shouldReduceAnimations: true,
                            shouldReduceQuality: prevState.shouldReduceQuality || fps < 20
                        }));
                }
                frameCountRef.current = 0;
                lastTimeRef.current = currentTime;
            }
            animationId = requestAnimationFrame(measureFPS);
        };
        animationId = requestAnimationFrame(measureFPS);
        return ()=>{
            cancelAnimationFrame(animationId);
        };
    }, [
        state.isPerformanceMode
    ]);
    // Memory monitoring
    const startMemoryMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const checkMemory = ()=>{
            if (performance.memory) {
                const memory = performance.memory;
                const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
                setState((prevState)=>({
                        ...prevState,
                        metrics: {
                            ...prevState.metrics,
                            memoryUsage
                        }
                    }));
                // Warn about high memory usage
                if (memoryUsage > 0.8) {
                    console.warn('High memory usage detected:', memoryUsage);
                }
            }
        };
        const interval = setInterval(checkMemory, 5000);
        return ()=>clearInterval(interval);
    }, []);
    // Network performance monitoring
    const startNetworkMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const observer = new PerformanceObserver((list)=>{
            list.getEntries().forEach((entry)=>{
                if (entry.entryType === 'resource') {
                    const resource = entry;
                    // Update network latency metric
                    if (resource.responseStart > 0) {
                        const latency = resource.responseStart - resource.requestStart;
                        setState((prevState)=>({
                                ...prevState,
                                metrics: {
                                    ...prevState.metrics,
                                    networkLatency: latency
                                }
                            }));
                    }
                }
            });
        });
        observer.observe({
            entryTypes: [
                'resource'
            ]
        });
        observersRef.current.push(observer);
        return ()=>{
            observer.disconnect();
        };
    }, []);
    // Device load monitoring (CPU usage approximation)
    const startDeviceLoadMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const checkDeviceLoad = ()=>{
            // Approximate CPU load based on frame time and memory usage
            const frameTime = 1000 / state.metrics.fps;
            const memoryLoad = state.metrics.memoryUsage || 0;
            const deviceLoad = Math.min(1, frameTime / 16.67 * 0.6 + memoryLoad * 0.4);
            setState((prevState)=>({
                    ...prevState,
                    metrics: {
                        ...prevState.metrics,
                        deviceLoad
                    }
                }));
        };
        const interval = setInterval(checkDeviceLoad, 2000);
        return ()=>clearInterval(interval);
    }, [
        state.metrics.fps,
        state.metrics.memoryUsage
    ]);
    // Initialize performance monitoring
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const deviceCapabilities = detectDeviceCapabilities();
        setState((prevState)=>({
                ...prevState,
                ...deviceCapabilities,
                isPerformanceMode: deviceCapabilities.isLowEndDevice
            }));
        // Start monitoring
        const cleanupFPS = startFPSMonitoring();
        const cleanupMemory = startMemoryMonitoring();
        const cleanupNetwork = startNetworkMonitoring();
        const cleanupDeviceLoad = startDeviceLoadMonitoring();
        return ()=>{
            cleanupFPS();
            cleanupMemory();
            cleanupNetwork();
            cleanupDeviceLoad();
            observersRef.current.forEach((observer)=>observer.disconnect());
        };
    }, [
        detectDeviceCapabilities,
        startFPSMonitoring,
        startMemoryMonitoring,
        startNetworkMonitoring,
        startDeviceLoadMonitoring
    ]);
    // Performance optimization functions
    const optimizePerformance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((aggressive = false)=>{
        setState((prevState)=>({
                ...prevState,
                isPerformanceMode: true,
                shouldReduceAnimations: true,
                shouldReduceQuality: prevState.shouldReduceQuality || aggressive,
                maxConcurrentRequests: aggressive ? 2 : Math.max(2, prevState.maxConcurrentRequests - 2)
            }));
    }, []);
    const restorePerformance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const deviceCapabilities = detectDeviceCapabilities();
        setState((prevState)=>({
                ...prevState,
                isPerformanceMode: false,
                ...deviceCapabilities
            }));
    }, [
        detectDeviceCapabilities
    ]);
    // Get performance recommendations
    const getRecommendations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const { metrics, isLowEndDevice, isPerformanceMode } = state;
        const recommendations = [];
        if (metrics.fps < 30) {
            recommendations.push('Enable performance mode');
        }
        if (metrics.memoryUsage && metrics.memoryUsage > 0.8) {
            recommendations.push('Reduce memory usage');
        }
        if (metrics.networkLatency && metrics.networkLatency > 1000) {
            recommendations.push('Optimize network requests');
        }
        if (isLowEndDevice && !isPerformanceMode) {
            recommendations.push('Enable performance optimizations');
        }
        return recommendations;
    }, [
        state
    ]);
    // Log performance metrics in development
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('Performance metrics:', state.metrics);
            const recommendations = getRecommendations();
            if (recommendations.length > 0) {
                console.warn('Performance recommendations:', recommendations);
            }
        }
    }, [
        state.metrics,
        getRecommendations
    ]);
    return {
        ...state,
        optimizePerformance,
        restorePerformance,
        getRecommendations
    };
}
function useMapPerformance() {
    const performanceState = useMobilePerformance();
    const [mapMetrics, setMapMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        tileCount: 0,
        markersLoaded: 0,
        lastRenderTime: 0
    });
    // Monitor map-specific metrics
    const updateMapMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        setMapMetrics((prev)=>({
                ...prev,
                ...updates
            }));
    }, []);
    return {
        ...performanceState,
        mapMetrics,
        updateMapMetrics
    };
}
function usePerformanceAnimation() {
    const { shouldReduceAnimations, metrics } = useMobilePerformance();
    const getAnimationDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((baseDuration)=>{
        if (shouldReduceAnimations) {
            return 0;
        }
        // Reduce duration based on performance
        if (metrics.fps < 45) {
            return baseDuration * 0.5;
        } else if (metrics.fps < 30) {
            return baseDuration * 0.25;
        }
        return baseDuration;
    }, [
        shouldReduceAnimations,
        metrics.fps
    ]);
    const shouldAnimate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return !shouldReduceAnimations && metrics.fps >= 30;
    }, [
        shouldReduceAnimations,
        metrics.fps
    ]);
    return {
        getAnimationDuration,
        shouldAnimate,
        animationEnabled: !shouldReduceAnimations
    };
}
const __TURBOPACK__default__export__ = useMobilePerformance;
}),
"[project]/src/components/map/MapContainer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Map Container Component - Drive SoCal POV
 * Main map container with performance monitoring and mobile optimization
 */ __turbopack_context__.s([
    "MapContainer",
    ()=>MapContainer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$MapProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/map/MapProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/mapStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useMobilePerformance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useMobilePerformance.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function MapContainer({ className = '', children, showControls = true, enablePerformanceMode: enablePerfMode = true }) {
    const { isLowEndDevice, shouldReduceAnimations, shouldReduceQuality } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useMobilePerformance$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMobilePerformance"])();
    const { error, isLoading, performanceMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$mapStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMapStore"])();
    // Handle map load
    const handleMapLoad = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((map)=>{
        console.log('Map loaded successfully:', {
            bounds: map.getBounds(),
            center: map.getCenter(),
            zoom: map.getZoom()
        });
        // Add performance monitoring
        if ("TURBOPACK compile-time truthy", 1) {
            ;
            window.__debugMap = map;
        }
    }, []);
    // Handle map error
    const handleMapError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback((error)=>{
        console.error('Map error:', error);
    }, []);
    // Performance mode indicator (development only)
    const PerformanceIndicator = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded z-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        "Mode: ",
                        performanceMode ? 'Performance' : 'Normal'
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        "Low-end: ",
                        isLowEndDevice ? 'Yes' : 'No'
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        "Reduce Anim: ",
                        shouldReduceAnimations ? 'Yes' : 'No'
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        "Reduce Quality: ",
                        shouldReduceQuality ? 'Yes' : 'No'
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/map/MapContainer.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    };
    // Loading overlay
    const LoadingOverlay = ()=>{
        if (!isLoading) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapContainer.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-sm",
                        children: "Loading map..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapContainer.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/MapContainer.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/map/MapContainer.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    };
    // Error overlay
    const ErrorOverlay = ()=>{
        if (!error) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 bg-red-50 bg-opacity-90 flex items-center justify-center z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-red-600 text-lg font-semibold mb-2",
                        children: "Map Error"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapContainer.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-sm mb-4",
                        children: "Unable to load the map. Please check your connection and try again."
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapContainer.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700",
                        children: "Retry"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapContainer.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/MapContainer.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/map/MapContainer.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative w-full h-full overflow-hidden ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$MapProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MapProvider"], {
            onMapLoad: handleMapLoad,
            onMapError: handleMapError,
            enablePerformanceMode: enablePerfMode,
            children: [
                children,
                showControls && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-4 right-4 z-10"
                }, void 0, false, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 110,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PerformanceIndicator, {}, void 0, false, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingOverlay, {}, void 0, false, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorOverlay, {}, void 0, false, {
                    fileName: "[project]/src/components/map/MapContainer.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/map/MapContainer.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/map/MapContainer.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = MapContainer;
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Drive SoCal POV - Home Page
 * Mobile-first travel guide with interactive map
 */ __turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$MapContainer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/map/MapContainer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/map/config.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Home() {
    // Validate OpenStreetMap environment on app load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$map$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateMapEnvironment"])();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-screen relative bg-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "absolute top-0 left-0 right-0 z-50 bg-white shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 py-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-xl font-bold text-gray-900",
                            children: "Drive SoCal POV"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600",
                            children: "Discover Southern California"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "w-full h-full pt-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2f$MapContainer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    className: "w-full h-full",
                    showControls: true,
                    enablePerformanceMode: true
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 py-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-around",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2 text-blue-600",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-6 h-6",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 45,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 44,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2 text-gray-600",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-6 h-6",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 50,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2 text-gray-600",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-6 h-6",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "p-2 text-gray-600",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-6 h-6",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 60,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4a52d7bf._.js.map
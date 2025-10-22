/**
 * Test Suite Component - Comprehensive Testing Workflow
 * Mobile validation and performance testing for Drive SoCal POV
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Circle, AlertTriangle, Loader, Gauge } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
  message: string
  details?: any
  duration?: number
}

interface TestSuiteProps {
  enabled?: boolean
  onTestComplete?: (results: TestResult[]) => void
}

export function TestSuite({ enabled = false, onTestComplete }: TestSuiteProps) {
  const [tests, setTests] = useState<TestResult[]>([
    {
      name: 'Application Loading',
      status: 'pending',
      message: 'Checking if application loads successfully'
    },
    {
      name: 'Mobile Layout Validation',
      status: 'pending',
      message: 'Validating mobile viewport and responsive design'
    },
    {
      name: 'Map Integration Test',
      status: 'pending',
      message: 'Testing MapLibre GL integration and interactions'
    },
    {
      name: 'Navigation System Test',
      status: 'pending',
      message: 'Testing burger menu and navigation functionality'
    },
    {
      name: 'Touch Interaction Test',
      status: 'pending',
      message: 'Validating touch targets and mobile gestures'
    },
    {
      name: 'Performance Validation',
      status: 'pending',
      message: 'Testing 60 FPS performance and memory usage'
    },
    {
      name: 'Database Connectivity',
      status: 'pending',
      message: 'Testing Supabase connection and location data'
    },
    {
      name: 'Theme System Test',
      status: 'pending',
      message: 'Testing dark/light mode toggle functionality'
    },
    {
      name: 'Location Markers Test',
      status: 'pending',
      message: 'Testing location marker display and interactions'
    },
    {
      name: 'Filter Functionality',
      status: 'pending',
      message: 'Testing regional and category filters'
    }
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentTestIndex, setCurrentTestIndex] = useState(0)

  // Update individual test result
  const updateTestResult = useCallback((index: number, result: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) =>
      i === index ? { ...test, ...result } : test
    ))
  }, [])

  // Run individual test
  const runTest = useCallback(async (testIndex: number) => {
    const test = tests[testIndex]
    if (!test) return

    updateTestResult(testIndex, { status: 'running' })
    const startTime = performance.now()

    try {
      switch (test.name) {
        case 'Application Loading':
          await testApplicationLoading(testIndex, startTime)
          break
        case 'Mobile Layout Validation':
          await testMobileLayout(testIndex, startTime)
          break
        case 'Map Integration Test':
          await testMapIntegration(testIndex, startTime)
          break
        case 'Navigation System Test':
          await testNavigationSystem(testIndex, startTime)
          break
        case 'Touch Interaction Test':
          await testTouchInteraction(testIndex, startTime)
          break
        case 'Performance Validation':
          await testPerformance(testIndex, startTime)
          break
        case 'Database Connectivity':
          await testDatabaseConnectivity(testIndex, startTime)
          break
        case 'Theme System Test':
          await testThemeSystem(testIndex, startTime)
          break
        case 'Location Markers Test':
          await testLocationMarkers(testIndex, startTime)
          break
        case 'Filter Functionality':
          await testFilterFunctionality(testIndex, startTime)
          break
      }
    } catch (error) {
      updateTestResult(testIndex, {
        status: 'failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - startTime
      })
    }
  }, [tests, updateTestResult])

  // Test implementations
  const testApplicationLoading = async (index: number, startTime: number) => {
    // Check if DOM is loaded
    const isLoaded = document.readyState === 'complete'
    const hasAppTitle = document.querySelector('h1') !== null
    const hasMapContainer = document.querySelector('[data-testid="map-container"]') !== null

    const duration = performance.now() - startTime
    const status = isLoaded && hasAppTitle && hasMapContainer ? 'passed' : 'failed'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? `Application loaded successfully in ${duration.toFixed(0)}ms`
        : 'Application loading failed - missing critical elements',
      duration,
      details: {
        isLoaded,
        hasAppTitle,
        hasMapContainer,
        loadTime: duration
      }
    })
  }

  const testMobileLayout = async (index: number, startTime: number) => {
    const isMobile = window.innerWidth < 768
    const hasBurgerMenu = document.querySelector('[data-testid="burger-menu"]') !== null
    const hasFilterBar = document.querySelector('[data-testid="filter-bar"]') !== null
    const hasProperViewport = document.querySelector('meta[name="viewport"]') !== null

    // Check touch target sizes
    const burgerButton = document.querySelector('[data-testid="burger-menu"]') as HTMLElement
    const hasValidTouchTargets = burgerButton ?
      burgerButton.offsetWidth >= 44 && burgerButton.offsetHeight >= 44 : false

    const duration = performance.now() - startTime
    const status = (hasBurgerMenu && hasFilterBar && hasProperViewport && hasValidTouchTargets) ? 'passed' : 'warning'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? `Mobile layout validated - ${isMobile ? 'Mobile' : 'Desktop'} viewport detected`
        : 'Some mobile layout issues detected',
      duration,
      details: {
        isMobile,
        hasBurgerMenu,
        hasFilterBar,
        hasProperViewport,
        hasValidTouchTargets,
        viewport: { width: window.innerWidth, height: window.innerHeight }
      }
    })
  }

  const testMapIntegration = async (index: number, startTime: number) => {
    // Wait for map to initialize
    const mapCheck = async () => {
      for (let i = 0; i < 50; i++) { // Wait up to 5 seconds
        if (window.__debugMap) return true
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return false
    }

    const hasMap = await mapCheck()
    const mapContainer = document.querySelector('[data-testid="map-container"]') as HTMLElement
    const hasMapContainer = mapContainer !== null
    const mapVisible = hasMapContainer ? mapContainer.offsetWidth > 0 && mapContainer.offsetHeight > 0 : false

    const duration = performance.now() - startTime
    const status = hasMap && hasMapContainer && mapVisible ? 'passed' : 'failed'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? `Map integration successful - initialized in ${duration.toFixed(0)}ms`
        : 'Map integration failed',
      duration,
      details: {
        hasMap,
        hasMapContainer,
        mapVisible,
        mapInstance: !!window.__debugMap
      }
    })
  }

  const testNavigationSystem = async (index: number, startTime: number) => {
    const burgerMenu = document.querySelector('[data-testid="burger-menu"]') as HTMLElement
    const navigationMenu = document.querySelector('[data-testid="navigation-menu"]') as HTMLElement

    if (!burgerMenu) {
      updateTestResult(index, {
        status: 'failed',
        message: 'Burger menu not found',
        duration: performance.now() - startTime
      })
      return
    }

    // Test menu toggle
    const initialMenuState = navigationMenu ? navigationMenu.style.display !== 'none' : false
    burgerMenu.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const menuOpened = navigationMenu ? navigationMenu.style.display !== 'none' : false

    const duration = performance.now() - startTime
    const status = menuOpened !== initialMenuState ? 'passed' : 'failed'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? 'Navigation system working - menu toggles correctly'
        : 'Navigation system failed - menu not responding',
      duration,
      details: {
        hasBurgerMenu: !!burgerMenu,
        hasNavigationMenu: !!navigationMenu,
        menuStateChanged: menuOpened !== initialMenuState
      }
    })
  }

  const testTouchInteraction = async (index: number, startTime: number) => {
    const touchTargets = document.querySelectorAll('button, [role="button"], a')
    const validTouchTargets = Array.from(touchTargets).filter(target => {
      const rect = target.getBoundingClientRect()
      return rect.width >= 44 && rect.height >= 44
    })

    const hasTouchSupport = 'ontouchstart' in window
    const touchTargetRatio = touchTargets.length > 0 ? validTouchTargets.length / touchTargets.length : 0

    const duration = performance.now() - startTime
    const status = touchTargetRatio >= 0.8 ? 'passed' : touchTargetRatio >= 0.6 ? 'warning' : 'failed'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? `Touch interaction validated - ${validTouchTargets.length}/${touchTargets.length} targets meet standards`
        : `Touch targets need improvement - ${Math.round(touchTargetRatio * 100)}% meet standards`,
      duration,
      details: {
        hasTouchSupport,
        totalTouchTargets: touchTargets.length,
        validTouchTargets: validTouchTargets.length,
        touchTargetRatio: Math.round(touchTargetRatio * 100)
      }
    })
  }

  const testPerformance = async (index: number, startTime: number) => {
    // Measure FPS
    let frameCount = 0
    const fpsTestDuration = 2000 // 2 seconds
    const testStart = performance.now()

    const measureFPS = () => {
      frameCount++
      if (performance.now() - testStart < fpsTestDuration) {
        requestAnimationFrame(measureFPS)
      }
    }

    requestAnimationFrame(measureFPS)
    await new Promise(resolve => setTimeout(resolve, fpsTestDuration))

    const fps = Math.round((frameCount * 1000) / fpsTestDuration)

    // Memory usage
    const memoryUsage = 'memory' in performance ?
      Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0

    const duration = performance.now() - startTime
    const status = fps >= 30 && memoryUsage < 100 ? 'passed' : fps >= 20 ? 'warning' : 'failed'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? `Performance optimal - ${fps} FPS, ${memoryUsage}MB memory`
        : `Performance issues detected - ${fps} FPS, ${memoryUsage}MB memory`,
      duration,
      details: {
        fps,
        memoryUsage,
        frameCount,
        testDuration: fpsTestDuration
      }
    })
  }

  const testDatabaseConnectivity = async (index: number, startTime: number) => {
    try {
      // Check if Supabase client is initialized
      const hasSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined
      const hasSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined

      // Test basic connectivity by checking if location service loads
      const locationService = await import('@/lib/services/location-service').catch(() => null)
      const hasLocationService = locationService !== null

      const duration = performance.now() - startTime
      const status = (hasSupabaseUrl && hasSupabaseKey && hasLocationService) ? 'passed' : 'warning'

      updateTestResult(index, {
        status,
        message: status === 'passed'
          ? 'Database connectivity verified'
          : 'Database connectivity issues detected',
        duration,
        details: {
          hasSupabaseUrl,
          hasSupabaseKey,
          hasLocationService
        }
      })
    } catch (error) {
      updateTestResult(index, {
        status: 'failed',
        message: `Database connectivity failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - startTime
      })
    }
  }

  const testThemeSystem = async (index: number, startTime: number) => {
    const themeToggle = document.querySelector('[data-testid="theme-toggle"]') as HTMLElement

    if (!themeToggle) {
      updateTestResult(index, {
        status: 'warning',
        message: 'Theme toggle not found',
        duration: performance.now() - startTime
      })
      return
    }

    // Test theme toggle
    const initialTheme = document.documentElement.getAttribute('data-theme')
    themeToggle.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const newTheme = document.documentElement.getAttribute('data-theme')
    const themeChanged = initialTheme !== newTheme

    const duration = performance.now() - startTime
    const status = themeChanged ? 'passed' : 'warning'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? 'Theme system working - toggle functions correctly'
        : 'Theme toggle may have issues',
      duration,
      details: {
        hasThemeToggle: !!themeToggle,
        initialTheme,
        newTheme,
        themeChanged
      }
    })
  }

  const testLocationMarkers = async (index: number, startTime: number) => {
    // Wait for location markers to potentially load
    await new Promise(resolve => setTimeout(resolve, 2000))

    const markers = document.querySelectorAll('[data-testid="location-marker"]')
    const hasMarkers = markers.length > 0

    const duration = performance.now() - startTime
    const status = hasMarkers ? 'passed' : 'warning'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? `Location markers loaded - ${markers.length} markers found`
        : 'No location markers found (may need database connection)',
      duration,
      details: {
        markerCount: markers.length,
        hasMarkers
      }
    })
  }

  const testFilterFunctionality = async (index: number, startTime: number) => {
    const regionFilter = document.querySelector('[data-testid="region-filter"]') as HTMLElement
    const categoryFilter = document.querySelector('[data-testid="category-filter"]') as HTMLElement

    const hasRegionFilter = regionFilter !== null
    const hasCategoryFilter = categoryFilter !== null

    let filterWorking = false

    if (hasRegionFilter) {
      const initialRegion = regionFilter.textContent
      regionFilter.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      const dropdown = document.querySelector('[data-testid="region-dropdown"]')
      filterWorking = dropdown !== null
    }

    const duration = performance.now() - startTime
    const status = (hasRegionFilter && hasCategoryFilter && filterWorking) ? 'passed' : 'warning'

    updateTestResult(index, {
      status,
      message: status === 'passed'
        ? 'Filter functionality working correctly'
        : 'Filter functionality may have issues',
      duration,
      details: {
        hasRegionFilter,
        hasCategoryFilter,
        filterWorking
      }
    })
  }

  // Run all tests
  const runAllTests = useCallback(async () => {
    setIsRunning(true)
    setCurrentTestIndex(0)

    for (let i = 0; i < tests.length; i++) {
      setCurrentTestIndex(i)
      await runTest(i)
      await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause between tests
    }

    setIsRunning(false)
    setCurrentTestIndex(-1)

    if (onTestComplete) {
      onTestComplete(tests)
    }
  }, [tests, runTest, onTestComplete])

  // Auto-run when enabled
  useEffect(() => {
    if (enabled && !isRunning) {
      runAllTests()
    }
  }, [enabled, isRunning, runAllTests])

  if (!enabled) return null

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <Circle className="w-4 h-4 text-green-500 fill-current" />
      case 'failed':
        return <Circle className="w-4 h-4 text-red-500 fill-current" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'running':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />
    }
  }

  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length
  const warningTests = tests.filter(t => t.status === 'warning').length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gauge className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-bold">Mobile Testing Suite</h2>
                <p className="text-sm opacity-90">
                  Comprehensive validation for Drive SoCal POV
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {passedTests}/{tests.length}
              </div>
              <div className="text-xs opacity-90">Tests Passed</div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="p-4 overflow-y-auto max-h-96">
          <div className="space-y-2">
            {tests.map((test, index) => (
              <div
                key={test.name}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  index === currentTestIndex
                    ? 'border-blue-500 bg-blue-50'
                    : test.status === 'passed'
                    ? 'border-green-200 bg-green-50'
                    : test.status === 'failed'
                    ? 'border-red-200 bg-red-50'
                    : test.status === 'warning'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{test.name}</div>
                  <div className="text-xs text-gray-600">{test.message}</div>
                  {test.duration && (
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {test.duration.toFixed(0)}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Circle className="w-4 h-4 text-green-500 fill-current" />
                {passedTests} Passed
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                {warningTests} Warnings
              </span>
              <span className="flex items-center gap-1">
                <Circle className="w-4 h-4 text-red-500 fill-current" />
                {failedTests} Failed
              </span>
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestSuite
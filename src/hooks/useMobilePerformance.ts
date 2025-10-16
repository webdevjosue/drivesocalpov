/**
 * Mobile Performance Hook - Drive SoCal POV
 * Monitors and optimizes performance for mobile devices
 */

'use client'

import { useEffect, useCallback, useState, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
  tileCount: number
  networkLatency?: number
  deviceLoad: number
}

interface PerformanceState {
  metrics: PerformanceMetrics
  isLowEndDevice: boolean
  shouldReduceAnimations: boolean
  shouldReduceQuality: boolean
  maxConcurrentRequests: number
  isPerformanceMode: boolean
}

export function useMobilePerformance(): PerformanceState & {
  optimizePerformance: (aggressive?: boolean) => void
  restorePerformance: () => void
  getRecommendations: () => string[]
} {
  const [state, setState] = useState<PerformanceState>({
    metrics: {
      fps: 60,
      renderTime: 0,
      tileCount: 0,
      deviceLoad: 0,
    },
    isLowEndDevice: false,
    shouldReduceAnimations: false,
    shouldReduceQuality: false,
    maxConcurrentRequests: 6,
    isPerformanceMode: false,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const observersRef = useRef<PerformanceObserver[]>([])

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    const deviceMemory = (navigator as any).deviceMemory || 4
    const connection = (navigator as any).connection

    // Determine if low-end device
    const isLowEndDevice =
      hardwareConcurrency <= 4 ||
      deviceMemory <= 2 ||
      (connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData === true
      ))

    // Determine performance settings
    const shouldReduceAnimations = isLowEndDevice ||
      (connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g'
      ))

    const shouldReduceQuality = isLowEndDevice ||
      (connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g'
      ))

    // Determine max concurrent requests
    let maxConcurrentRequests = 6
    if (connection) {
      switch (connection.effectiveType) {
        case 'slow-2g':
        case '2g':
          maxConcurrentRequests = 2
          break
        case '3g':
          maxConcurrentRequests = 4
          break
        case '4g':
          maxConcurrentRequests = 6
          break
        default:
          maxConcurrentRequests = isLowEndDevice ? 4 : 6
      }
    }

    return {
      isLowEndDevice,
      shouldReduceAnimations,
      shouldReduceQuality,
      maxConcurrentRequests,
      connectionType: connection?.effectiveType || 'unknown',
    }
  }, [])

  // FPS monitoring
  const startFPSMonitoring = useCallback(() => {
    let animationId: number

    const measureFPS = () => {
      frameCountRef.current++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTimeRef.current

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime)

        setState(prevState => ({
          ...prevState,
          metrics: {
            ...prevState.metrics,
            fps,
          },
        }))

        // Auto-enable performance mode if FPS is too low
        if (fps < 30 && !state.isPerformanceMode) {
          console.warn(`Low FPS detected: ${fps}, enabling performance mode`)
          setState(prevState => ({
            ...prevState,
            isPerformanceMode: true,
            shouldReduceAnimations: true,
            shouldReduceQuality: prevState.shouldReduceQuality || fps < 20,
          }))
        }

        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [state.isPerformanceMode])

  // Memory monitoring
  const startMemoryMonitoring = useCallback(() => {
    const checkMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory
        const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize

        setState(prevState => ({
          ...prevState,
          metrics: {
            ...prevState.metrics,
            memoryUsage,
          },
        }))

        // Warn about high memory usage
        if (memoryUsage > 0.8) {
          console.warn('High memory usage detected:', memoryUsage)
        }
      }
    }

    const interval = setInterval(checkMemory, 5000)
    return () => clearInterval(interval)
  }, [])

  // Network performance monitoring
  const startNetworkMonitoring = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming

          // Update network latency metric
          if (resource.responseStart > 0) {
            const latency = resource.responseStart - resource.requestStart

            setState(prevState => ({
              ...prevState,
              metrics: {
                ...prevState.metrics,
                networkLatency: latency,
              },
            }))
          }
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
    observersRef.current.push(observer)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Device load monitoring (CPU usage approximation)
  const startDeviceLoadMonitoring = useCallback(() => {
    const checkDeviceLoad = () => {
      // Approximate CPU load based on frame time and memory usage
      const frameTime = 1000 / state.metrics.fps
      const memoryLoad = state.metrics.memoryUsage || 0
      const deviceLoad = Math.min(1, (frameTime / 16.67) * 0.6 + memoryLoad * 0.4)

      setState(prevState => ({
        ...prevState,
        metrics: {
          ...prevState.metrics,
          deviceLoad,
        },
      }))
    }

    const interval = setInterval(checkDeviceLoad, 2000)
    return () => clearInterval(interval)
  }, [state.metrics.fps, state.metrics.memoryUsage])

  // Initialize performance monitoring
  useEffect(() => {
    const deviceCapabilities = detectDeviceCapabilities()

    setState(prevState => ({
      ...prevState,
      ...deviceCapabilities,
      isPerformanceMode: deviceCapabilities.isLowEndDevice,
    }))

    // Start monitoring
    const cleanupFPS = startFPSMonitoring()
    const cleanupMemory = startMemoryMonitoring()
    const cleanupNetwork = startNetworkMonitoring()
    const cleanupDeviceLoad = startDeviceLoadMonitoring()

    return () => {
      cleanupFPS()
      cleanupMemory()
      cleanupNetwork()
      cleanupDeviceLoad()
      // Fix memory leak: capture observersRef.current at cleanup time
      const currentObservers = observersRef.current
      currentObservers.forEach(observer => observer.disconnect())
    }
  }, [detectDeviceCapabilities, startFPSMonitoring, startMemoryMonitoring, startNetworkMonitoring, startDeviceLoadMonitoring])

  // Performance optimization functions
  const optimizePerformance = useCallback((aggressive: boolean = false) => {
    setState(prevState => ({
      ...prevState,
      isPerformanceMode: true,
      shouldReduceAnimations: true,
      shouldReduceQuality: prevState.shouldReduceQuality || aggressive,
      maxConcurrentRequests: aggressive ? 2 : Math.max(2, prevState.maxConcurrentRequests - 2),
    }))
  }, [])

  const restorePerformance = useCallback(() => {
    const deviceCapabilities = detectDeviceCapabilities()

    setState(prevState => ({
      ...prevState,
      isPerformanceMode: false,
      ...deviceCapabilities,
    }))
  }, [detectDeviceCapabilities])

  // Get performance recommendations
  const getRecommendations = useCallback(() => {
    const { metrics, isLowEndDevice, isPerformanceMode } = state

    const recommendations = []

    if (metrics.fps < 30) {
      recommendations.push('Enable performance mode')
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 0.8) {
      recommendations.push('Reduce memory usage')
    }

    if (metrics.networkLatency && metrics.networkLatency > 1000) {
      recommendations.push('Optimize network requests')
    }

    if (isLowEndDevice && !isPerformanceMode) {
      recommendations.push('Enable performance optimizations')
    }

    return recommendations
  }, [state])

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metrics:', state.metrics)

      const recommendations = getRecommendations()
      if (recommendations.length > 0) {
        console.warn('Performance recommendations:', recommendations)
      }
    }
  }, [state.metrics, getRecommendations])

  return {
    ...state,
    optimizePerformance,
    restorePerformance,
    getRecommendations,
  }
}

// Hook for map-specific performance monitoring
export function useMapPerformance() {
  const performanceState = useMobilePerformance()
  const [mapMetrics, setMapMetrics] = useState({
    tileCount: 0,
    markersLoaded: 0,
    lastRenderTime: 0,
  })

  // Monitor map-specific metrics
  const updateMapMetrics = useCallback((updates: Partial<typeof mapMetrics>) => {
    setMapMetrics(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    ...performanceState,
    mapMetrics,
    updateMapMetrics,
  }
}

// Hook for performance-aware animations
export function usePerformanceAnimation() {
  const { shouldReduceAnimations, metrics } = useMobilePerformance()

  const getAnimationDuration = useCallback((baseDuration: number) => {
    if (shouldReduceAnimations) {
      return 0
    }

    // Reduce duration based on performance
    if (metrics.fps < 45) {
      return baseDuration * 0.5
    } else if (metrics.fps < 30) {
      return baseDuration * 0.25
    }

    return baseDuration
  }, [shouldReduceAnimations, metrics.fps])

  const shouldAnimate = useCallback(() => {
    return !shouldReduceAnimations && metrics.fps >= 30
  }, [shouldReduceAnimations, metrics.fps])

  return {
    getAnimationDuration,
    shouldAnimate,
    animationEnabled: !shouldReduceAnimations,
  }
}

export default useMobilePerformance
/**
 * Production-optimized Performance Monitor Component
 * Simplified version without debug overhead for production deployment
 */

'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  renderTime: number
  networkRequests: number
  errorCount: number
}

interface PerformanceMonitorProps {
  enabled?: boolean
  onUpdate?: (metrics: PerformanceMetrics) => void
  showDetails?: boolean
}

export function PerformanceMonitor({
  enabled = false, // Disabled in production
  onUpdate,
  showDetails = false
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    networkRequests: 0,
    errorCount: 0
  })

  const [isPerformant, setIsPerformant] = useState(true)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafIdRef = useRef<number | undefined>()
  const errorsRef = useRef(0)
  const fpsValuesRef = useRef<number[]>([])

  // FPS calculation
  const calculateFPS = useCallback(() => {
    frameCountRef.current++
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTimeRef.current

    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
      fpsValuesRef.current.push(fps)

      if (fpsValuesRef.current.length > 10) {
        fpsValuesRef.current.shift()
      }

      frameCountRef.current = 0
      lastTimeRef.current = currentTime
      return fps
    }

    return null
  }, [])

  // Memory usage calculation
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return Math.round((memory.usedJSHeapSize / 1048576) * 100) / 100
    }
    return 0
  }, [])

  // Network monitoring
  const networkRequestsRef = useRef(0)
  useEffect(() => {
    if (!enabled) return

    const originalFetch = window.fetch
    window.fetch = (...args) => {
      networkRequestsRef.current++
      return originalFetch(...args)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [enabled])

  // Error monitoring
  useEffect(() => {
    if (!enabled) return

    const handleError = () => {
      errorsRef.current++
    }

    const handleUnhandledRejection = () => {
      errorsRef.current++
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [enabled])

  // Performance monitoring loop
  const updateMetrics = useCallback(() => {
    if (!enabled) return

    const fps = calculateFPS()
    const memoryUsage = getMemoryUsage()

    const newMetrics: PerformanceMetrics = {
      fps: fps || metrics.fps,
      memoryUsage,
      renderTime: performance.now() - lastTimeRef.current,
      networkRequests: networkRequestsRef.current,
      errorCount: errorsRef.current
    }

    setMetrics(newMetrics)
    setIsPerformant((newMetrics.fps >= 55) && (newMetrics.memoryUsage < 100))

    if (onUpdate) {
      onUpdate(newMetrics)
    }

    rafIdRef.current = requestAnimationFrame(() => {
      updateMetrics()
    })
  }, [enabled, calculateFPS, getMemoryUsage, metrics.fps, onUpdate])

  useEffect(() => {
    if (enabled) {
      rafIdRef.current = requestAnimationFrame(() => {
        updateMetrics()
      })
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [enabled, updateMetrics])

  // Touch performance measurement
  const measureTouchPerformance = useCallback((event: React.TouchEvent) => {
    if (!enabled) return

    const touch = event.touches[0]
    const startTime = performance.now()

    requestAnimationFrame(() => {
      const responseTime = performance.now() - startTime

      if (responseTime > 100) {
        console.warn(`Slow touch response: ${responseTime}ms`)
      }
    })
  }, [enabled])

  if (!enabled || !showDetails) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
      <div className="space-y-1">
        <div className={`flex justify-between ${isPerformant ? 'text-green-400' : 'text-red-400'}`}>
          <span>FPS:</span>
          <span>{metrics.fps}</span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span>{metrics.memoryUsage}MB</span>
        </div>
        <div className="flex justify-between">
          <span>Errors:</span>
          <span>{metrics.errorCount}</span>
        </div>
      </div>
    </div>
  )
}
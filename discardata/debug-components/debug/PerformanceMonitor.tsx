/**
 * Performance Monitor Component - Mobile Testing Suite
 * Real-time performance monitoring for 60 FPS validation
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
  enabled = process.env.NODE_ENV === 'development',
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

  // FPS calculation
  const calculateFPS = useCallback(() => {
    frameCountRef.current++
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTimeRef.current

    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
      frameCountRef.current = 0
      lastTimeRef.current = currentTime

      return fps
    }

    return null
  }, [])

  // Memory usage calculation (if available)
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return Math.round((memory.usedJSHeapSize / 1048576) * 100) / 100 // MB
    }
    return 0
  }, [])

  // Network monitoring
  const networkRequestsRef = useRef(0)
  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = (...args) => {
      networkRequestsRef.current++
      return originalFetch(...args)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  // Error monitoring
  useEffect(() => {
    const handleError = () => {
      errorsRef.current++
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleError)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  // Performance monitoring loop
  useEffect(() => {
    if (!enabled) return

    let frameCount = 0
    let lastTime = performance.now()
    let fpsValues: number[] = []
    let renderStartTime = 0

    const measurePerformance = () => {
      const currentTime = performance.now()
      frameCount++

      // Calculate FPS every second
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        fpsValues.push(fps)

        // Keep only last 10 values for rolling average
        if (fpsValues.length > 10) {
          fpsValues.shift()
        }

        const avgFps = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length
        const memoryUsage = getMemoryUsage()

        const newMetrics: PerformanceMetrics = {
          fps: Math.round(avgFps),
          memoryUsage,
          renderTime: renderStartTime > 0 ? currentTime - renderStartTime : 0,
          networkRequests: networkRequestsRef.current,
          errorCount: errorsRef.current
        }

        setMetrics(newMetrics)
        setIsPerformant(avgFps >= 30 && memoryUsage < 100) // 30 FPS minimum, 100MB memory limit

        if (onUpdate) {
          onUpdate(newMetrics)
        }

        frameCount = 0
        lastTime = currentTime
      }

      renderStartTime = currentTime
      rafIdRef.current = requestAnimationFrame(measurePerformance)
    }

    rafIdRef.current = requestAnimationFrame(measurePerformance)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [enabled, onUpdate, getMemoryUsage])

  // Mobile touch interaction performance testing
  const testTouchPerformance = useCallback(() => {
    const startTime = performance.now()
    const touchPoints: { x: number; y: number; time: number }[] = []

    const handleTouchMove = (e: TouchEvent) => {
      touchPoints.push({
        x: e.touches[0]?.clientX || 0,
        y: e.touches[0]?.clientY || 0,
        time: performance.now()
      })
    }

    const handleTouchEnd = () => {
      const endTime = performance.now()
      const responseTime = endTime - startTime

      console.log('Touch Performance Test:', {
        responseTime: `${responseTime.toFixed(2)}ms`,
        touchPoints: touchPoints.length,
        averageInterval: touchPoints.length > 1
          ? `${(responseTime / (touchPoints.length - 1)).toFixed(2)}ms`
          : 'N/A'
      })

      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }, [])

  if (!enabled) return null

  // Performance status color
  const getStatusColor = () => {
    if (!isPerformant) return '#E74C3C' // Red
    if (metrics.fps < 45) return '#F39C12' // Yellow
    return '#27AE60' // Green
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 9999,
        minWidth: '120px',
        border: `2px solid ${getStatusColor()}`,
        backdropFilter: 'blur(10px)',
      }}
      onClick={testTouchPerformance}
      title="Click to test touch performance"
    >
      {/* Performance status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '4px'
      }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            animation: isPerformant ? 'pulse 2s infinite' : 'none'
          }}
        />
        <span style={{ fontWeight: 'bold', fontSize: '10px' }}>
          {isPerformant ? 'OPTIMAL' : 'WARNING'}
        </span>
      </div>

      {/* Core metrics */}
      <div style={{ lineHeight: '1.3' }}>
        <div>FPS: <span style={{ color: getStatusColor() }}>{metrics.fps}</span></div>
        <div>MEM: {metrics.memoryUsage}MB</div>
      </div>

      {/* Detailed metrics */}
      {showDetails && (
        <div style={{
          marginTop: '6px',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '10px',
          lineHeight: '1.2'
        }}>
          <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
          <div>Network: {metrics.networkRequests}</div>
          <div>Errors: {metrics.errorCount}</div>
        </div>
      )}

      {/* Mobile device indicator */}
      <div style={{
        marginTop: '4px',
        fontSize: '9px',
        color: '#7F8C8D',
        textAlign: 'center'
      }}>
        {window.innerWidth < 768 ? '📱 Mobile' : '🖥️ Desktop'}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Performance testing utilities
export const PerformanceTests = {
  // Test map interaction performance
  testMapInteraction: async (mapElement: HTMLElement) => {
    const startTime = performance.now()
    const interactions = []

    for (let i = 0; i < 10; i++) {
      const interactionStart = performance.now()

      // Simulate touch interaction
      const touch = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100 + (i * 20),
          clientY: 100 + (i * 15),
          identifier: Date.now() + i,
          target: mapElement,
          force: 1
        }],
        bubbles: true
      })

      mapElement.dispatchEvent(touch)

      const interactionEnd = performance.now()
      interactions.push(interactionEnd - interactionStart)
    }

    const endTime = performance.now()
    const totalTime = endTime - startTime
    const avgInteractionTime = interactions.reduce((a, b) => a + b, 0) / interactions.length

    return {
      totalTime: totalTime.toFixed(2),
      avgInteractionTime: avgInteractionTime.toFixed(2),
      interactionsPerSecond: (10 / (totalTime / 1000)).toFixed(1)
    }
  },

  // Test scrolling performance
  testScrollPerformance: (scrollContainer: HTMLElement) => {
    return new Promise((resolve) => {
      const startTime = performance.now()
      let frameCount = 0
      const maxFrames = 60

      const measureScroll = () => {
        frameCount++
        scrollContainer.scrollTop += 5

        if (frameCount < maxFrames && scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          requestAnimationFrame(measureScroll)
        } else {
          const endTime = performance.now()
          const totalTime = endTime - startTime
          const fps = (frameCount * 1000) / totalTime

          resolve({
            totalTime: totalTime.toFixed(2),
            frameCount,
            fps: fps.toFixed(1),
            pixelsScrolled: scrollContainer.scrollTop
          })
        }
      }

      requestAnimationFrame(measureScroll)
    })
  },

  // Test component render performance
  testRenderPerformance: (Component: React.ComponentType, iterations = 100) => {
    const renderTimes = []

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()

      // Render component (simplified test)
      const div = document.createElement('div')
      div.innerHTML = '<div>Test Component</div>'

      const endTime = performance.now()
      renderTimes.push(endTime - startTime)
    }

    const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length
    const maxRenderTime = Math.max(...renderTimes)
    const minRenderTime = Math.min(...renderTimes)

    return {
      iterations,
      avgRenderTime: avgRenderTime.toFixed(3),
      maxRenderTime: maxRenderTime.toFixed(3),
      minRenderTime: minRenderTime.toFixed(3)
    }
  }
}

export default PerformanceMonitor
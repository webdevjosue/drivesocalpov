/**
 * Performance Metrics API Endpoint
 * Real-time performance monitoring for production
 */

import { NextRequest, NextResponse } from 'next/server'

interface PerformanceMetric {
  timestamp: string
  path: string
  loadTime: number
  renderTime: number
  memoryUsage: number
  userAgent: string
  viewport: {
    width: number
    height: number
  }
  location?: {
    latitude: number
    longitude: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const metric: PerformanceMetric = await request.json()

    // Validate required fields
    if (!metric.path || !metric.loadTime) {
      return NextResponse.json({
        error: 'Missing required fields: path, loadTime'
      }, { status: 400 })
    }

    // Add server timestamp
    metric.timestamp = new Date().toISOString()

    // Log metrics (in production, this would go to a monitoring service)
    console.log('Performance metric received:', {
      path: metric.path,
      loadTime: metric.loadTime,
      memoryUsage: metric.memoryUsage,
      viewport: metric.viewport,
    })

    // Store metrics in memory cache for real-time monitoring
    // In a real production app, this would go to a database or monitoring service
    const metricsCache = global.performanceMetrics || []
    metricsCache.push(metric)

    // Keep only last 100 metrics
    if (metricsCache.length > 100) {
      metricsCache.shift()
    }

    global.performanceMetrics = metricsCache

    // Calculate current performance stats
    const recentMetrics = metricsCache.slice(-10)
    const avgLoadTime = recentMetrics.reduce((sum, m) => sum + m.loadTime, 0) / recentMetrics.length
    const avgMemoryUsage = recentMetrics.reduce((sum, m) => sum + (m.memoryUsage || 0), 0) / recentMetrics.length

    return NextResponse.json({
      success: true,
      received: metric,
      stats: {
        recentMetrics: recentMetrics.length,
        avgLoadTime: Math.round(avgLoadTime),
        avgMemoryUsage: Math.round(avgMemoryUsage),
        totalMetrics: metricsCache.length,
      }
    })

  } catch (error) {
    console.error('Failed to process performance metric:', error)

    return NextResponse.json({
      error: 'Failed to process metric',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const metricsCache = global.performanceMetrics || []

    // Return current performance statistics
    const stats = {
      totalMetrics: metricsCache.length,
      timestamp: new Date().toISOString(),
      recentMetrics: metricsCache.slice(-10),
      performance: {
        avgLoadTime: metricsCache.length > 0
          ? Math.round(metricsCache.reduce((sum, m) => sum + m.loadTime, 0) / metricsCache.length)
          : 0,
        avgMemoryUsage: metricsCache.length > 0
          ? Math.round(metricsCache.reduce((sum, m) => sum + (m.memoryUsage || 0), 0) / metricsCache.length)
          : 0,
        slowestPage: metricsCache.length > 0
          ? metricsCache.reduce((slowest, current) => current.loadTime > slowest.loadTime ? current : slowest)
          : null,
        fastestPage: metricsCache.length > 0
          ? metricsCache.reduce((fastest, current) => current.loadTime < fastest.loadTime ? current : fastest)
          : null,
      }
    }

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

  } catch (error) {
    console.error('Failed to retrieve performance metrics:', error)

    return NextResponse.json({
      error: 'Failed to retrieve metrics',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
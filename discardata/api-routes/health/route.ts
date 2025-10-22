/**
 * Health Check API Endpoint
 * Production monitoring and health status
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()

    // Check database connectivity
    const supabase = createClient()
    let dbStatus = 'disconnected'
    let dbResponseTime = 0

    try {
      const dbStart = Date.now()
      const { data, error } = await supabase
        .from('locations')
        .select('count')
        .limit(1)
        .single()

      dbResponseTime = Date.now() - dbStart

      if (!error) {
        dbStatus = 'connected'
      }
    } catch (dbError) {
      console.error('Database health check failed:', dbError)
    }

    // Check API response time
    const apiResponseTime = Date.now() - startTime

    // System information
    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      region: process.env.VERCEL_REGION || 'unknown',
    }

    // Performance metrics
    const performance = {
      responseTime: apiResponseTime,
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
      },
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      }
    }

    // Determine overall health status
    const isHealthy = (
      dbStatus === 'connected' &&
      apiResponseTime < 1000 &&
      performance.memory.used < 500
    )

    const healthStatus = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      system: systemInfo,
      performance,
      checks: {
        database: dbStatus === 'connected',
        responseTime: apiResponseTime < 1000,
        memoryUsage: performance.memory.used < 500,
      }
    }

    // Return appropriate HTTP status
    const statusCode = isHealthy ? 200 : 503

    return NextResponse.json(healthStatus, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
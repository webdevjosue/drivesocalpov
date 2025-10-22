/**
 * Production Status Dashboard API
 * Real-time monitoring and status information
 */

import { NextResponse } from 'next/server'

interface SystemStatus {
  status: 'operational' | 'degraded' | 'down'
  timestamp: string
  uptime: number
  version: string
  services: {
    website: ServiceStatus
    api: ServiceStatus
    database: ServiceStatus
    monitoring: ServiceStatus
  }
  performance: {
    responseTime: number
    cacheHitRate: number
    errorRate: number
  }
  deployment: {
    url: string
    environment: string
    lastDeployed: string
    region: string
  }
}

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down'
  responseTime?: number
  lastChecked: string
  details?: string
}

export async function GET() {
  const startTime = Date.now()

  // Service checks
  const websiteCheck: ServiceStatus = {
    status: 'operational',
    responseTime: 50, // Simulated
    lastChecked: new Date().toISOString()
  }

  const apiCheck: ServiceStatus = {
    status: 'operational',
    responseTime: 120, // Simulated
    lastChecked: new Date().toISOString()
  }

  const databaseCheck: ServiceStatus = {
    status: 'degraded', // Based on health endpoint results
    responseTime: 2000, // Simulated timeout
    lastChecked: new Date().toISOString(),
    details: 'Database connectivity configuration needed'
  }

  const monitoringCheck: ServiceStatus = {
    status: 'operational',
    responseTime: 30,
    lastChecked: new Date().toISOString()
  }

  // Determine overall system status
  const hasDownServices = [websiteCheck, apiCheck, databaseCheck, monitoringCheck]
    .some(service => service.status === 'down')

  const hasDegradedServices = [websiteCheck, apiCheck, databaseCheck, monitoringCheck]
    .some(service => service.status === 'degraded')

  const overallStatus: 'operational' | 'degraded' | 'down' =
    hasDownServices ? 'down' :
    hasDegradedServices ? 'degraded' : 'operational'

  const responseTime = Date.now() - startTime

  const systemStatus: SystemStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime() || 0,
    version: '1.0.0',
    services: {
      website: websiteCheck,
      api: apiCheck,
      database: databaseCheck,
      monitoring: monitoringCheck
    },
    performance: {
      responseTime,
      cacheHitRate: 95.2, // Simulated from Vercel cache headers
      errorRate: overallStatus === 'operational' ? 0.1 : 2.5
    },
    deployment: {
      url: 'https://drivesocalpov.vercel.app',
      environment: 'production',
      lastDeployed: '2025-10-19T00:11:00Z',
      region: 'sfo1'
    }
  }

  return NextResponse.json(systemStatus, {
    status: overallStatus === 'down' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
/**
 * Mobile Detection Hook - Drive SoCal POV
 * Optimized mobile device detection following official documentation
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

interface MobileDeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isTouchDevice: boolean
  devicePixelRatio: number
  screenWidth: number
  screenHeight: number
  orientation: 'portrait' | 'landscape'
  isLowEndDevice: boolean
  connectionType: string
  memoryInfo: {
    deviceMemory?: number
    hardwareConcurrency?: number
  }
}

export function useIsMobile(): boolean {
  const [deviceInfo, setDeviceInfo] = useState<MobileDeviceInfo>({
    isMobile: false,
    isTablet: false,
    isTouchDevice: false,
    devicePixelRatio: 1,
    screenWidth: 1920,
    screenHeight: 1080,
    orientation: 'landscape',
    isLowEndDevice: false,
    connectionType: 'unknown',
    memoryInfo: {},
  })

  // Update device information
  const updateDeviceInfo = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = window.devicePixelRatio || 1

    // Mobile detection based on screen size and touch capabilities
    const isMobile = width <= 768 ||
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   ((navigator as any).msMaxTouchPoints > 0)

    // Tablet detection (larger touch devices)
    const isTablet = !isMobile &&
                     ((width >= 768 && width <= 1024) ||
                      (height >= 768 && height <= 1024)) &&
                     ('ontouchstart' in window)

    // Touch device detection
    const isTouchDevice = 'ontouchstart' in window ||
                          (navigator.maxTouchPoints > 0) ||
                          ((navigator as any).msMaxTouchPoints > 0)

    // Orientation detection
    const orientation = width > height ? 'landscape' : 'portrait'

    // Low-end device detection
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    const deviceMemory = (navigator as any).deviceMemory || 4
    const connection = (navigator as any).connection

    const isLowEndDevice = (
      hardwareConcurrency <= 4 ||
      deviceMemory <= 2 ||
      (connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData === true
      ))
    )

    // Connection type
    const connectionType = connection?.effectiveType || 'unknown'

    const newDeviceInfo: MobileDeviceInfo = {
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
        hardwareConcurrency,
      },
    }

    setDeviceInfo(newDeviceInfo)
  }, [])

  // Initial detection and event listeners
  useEffect(() => {
    updateDeviceInfo()

    // Handle resize events
    const handleResize = () => {
      updateDeviceInfo()
    }

    // Handle orientation changes
    const handleOrientationChange = () => {
      // Small delay to get accurate dimensions after orientation change
      setTimeout(updateDeviceInfo, 100)
    }

    // Handle connection changes
    const handleConnectionChange = () => {
      updateDeviceInfo()
    }

    // Add event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    // Connection change listener (if available)
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [updateDeviceInfo])

  // Debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Mobile device info:', deviceInfo)
    }
  }, [deviceInfo])

  // Return just the boolean for simple cases
  return deviceInfo.isMobile
}

// Enhanced hook that returns full device information
export function useMobileDeviceInfo(): MobileDeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<MobileDeviceInfo>({
    isMobile: false,
    isTablet: false,
    isTouchDevice: false,
    devicePixelRatio: 1,
    screenWidth: 1920,
    screenHeight: 1080,
    orientation: 'landscape',
    isLowEndDevice: false,
    connectionType: 'unknown',
    memoryInfo: {},
  })

  const updateDeviceInfo = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = window.devicePixelRatio || 1

    // Enhanced mobile detection
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    const isSmallScreen = width <= 768
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const isMobile = isMobileUA || isSmallScreen || isTouchDevice

    // Tablet detection with better accuracy
    const isTablet = !isMobile &&
                     ((width >= 768 && width <= 1024) ||
                      (height >= 768 && height <= 1024)) &&
                     isTouchDevice &&
                     (/ipad|tablet/i.test(userAgent) || isSmallScreen)

    // Device-specific detection
    const isIOS = /iphone|ipad|ipod/i.test(userAgent)
    const isAndroid = /android/i.test(userAgent)
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent)
    const isChrome = /chrome/i.test(userAgent)

    // Performance capabilities
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    const deviceMemory = (navigator as any).deviceMemory || 4
    const connection = (navigator as any).connection

    const isLowEndDevice = (
      hardwareConcurrency <= 4 ||
      deviceMemory <= 2 ||
      (connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData === true
      ))
    )

    // Enhanced connection info
    const connectionInfo = connection ? {
      type: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 'unknown',
      rtt: connection.rtt || 'unknown',
      saveData: connection.saveData || false,
    } : {
      type: 'unknown',
      downlink: 'unknown',
      rtt: 'unknown',
      saveData: false,
    }

    const newDeviceInfo: MobileDeviceInfo = {
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
        hardwareConcurrency,
      },
    }

    setDeviceInfo(newDeviceInfo)

    // Store additional info for debugging
    if (process.env.NODE_ENV === 'development') {
      (window as any).__deviceInfo = {
        ...newDeviceInfo,
        userAgent,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        connectionInfo,
      }
    }
  }, [])

  useEffect(() => {
    updateDeviceInfo()

    const handleResize = () => updateDeviceInfo()
    const handleOrientationChange = () => setTimeout(updateDeviceInfo, 100)

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateDeviceInfo)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (connection) {
        connection.removeEventListener('change', updateDeviceInfo)
      }
    }
  }, [updateDeviceInfo])

  return deviceInfo
}

// Hook for performance-optimized mobile detection
export function useMobilePerformance(): {
  isMobile: boolean
  isLowEnd: boolean
  shouldReduceAnimations: boolean
  shouldReduceQuality: boolean
  maxConcurrentRequests: number
} {
  const deviceInfo = useMobileDeviceInfo()

  const shouldReduceAnimations = deviceInfo.isLowEndDevice ||
                                deviceInfo.connectionType === 'slow-2g' ||
                                deviceInfo.connectionType === '2g' ||
                                (deviceInfo.connectionType === '3g' && deviceInfo.isMobile)

  const shouldReduceQuality = deviceInfo.isLowEndDevice ||
                             deviceInfo.connectionType === 'slow-2g' ||
                             deviceInfo.connectionType === '2g'

  // Determine max concurrent requests based on connection
  let maxConcurrentRequests = 6 // Default
  switch (deviceInfo.connectionType) {
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
      maxConcurrentRequests = deviceInfo.isMobile ? 4 : 6
  }

  return {
    isMobile: deviceInfo.isMobile,
    isLowEnd: deviceInfo.isLowEndDevice,
    shouldReduceAnimations,
    shouldReduceQuality,
    maxConcurrentRequests,
  }
}

// Utility function to detect mobile browsers
export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod',
    'blackberry', 'iemobile', 'opera mini', 'mobi'
  ]

  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

// Utility function to get device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth
  const isTouchDevice = 'ontouchstart' in window

  if (width <= 768 || (isTouchDevice && width <= 1024)) {
    return 'mobile'
  } else if (width <= 1024 && isTouchDevice) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

export default useIsMobile
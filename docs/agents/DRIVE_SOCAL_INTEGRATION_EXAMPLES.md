# Drive SoCal POV - Integration Examples & Patterns

## 🎯 Overview

This document provides practical, Drive SoCal POV-specific integration examples and patterns for implementing agent automation. Each example is tailored to the mobile-first travel guide requirements and demonstrates real-world implementation scenarios.

---

## 🚀 Priority 1: Mobile Performance Guardian

### **Implementation: Real-time Performance Monitoring Hook**

```typescript
// File: src/hooks/usePerformanceAutomation.ts
interface PerformanceAutomationHook {
  setupMonitoring: () => void
  triggerPerformanceAnalysis: (metrics: PerformanceMetrics) => Promise<void>
  enablePerformanceMode: () => void
}

export const usePerformanceAutomation = (): PerformanceAutomationHook => {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)

  // Trigger automated performance analysis
  const triggerPerformanceAnalysis = useCallback(async (metrics: PerformanceMetrics) => {
    if (metrics.fps < 30 || metrics.deviceLoad > 0.8) {
      // Launch Performance Analysis Agent
      const analysisResult = await Task({
        subagent_type: "feature-dev:code-reviewer",
        description: "Analyze mobile performance issues",
        prompt: `
          Analyze the following mobile performance metrics for Drive SoCal POV:
          - FPS: ${metrics.fps}
          - Memory Usage: ${metrics.memoryUsage}
          - Device Load: ${metrics.deviceLoad}
          - Network Type: ${metrics.connectionType}

          Focus on:
          1. MapLibre GL performance bottlenecks
          2. Mobile-specific rendering issues
          3. Memory optimization opportunities
          4. Network request optimization

          Provide specific code recommendations for:
          - src/components/map/MapContainer.tsx
          - src/hooks/useMobilePerformance.ts
          - src/lib/map/config.ts
        `
      })

      // Implement optimization suggestions
      if (analysisResult.recommendations.length > 0) {
        await implementPerformanceOptimizations(analysisResult.recommendations)
      }
    }
  }, [])

  // Automated performance optimization implementation
  const implementPerformanceOptimizations = useCallback(async (recommendations: string[]) => {
    for (const recommendation of recommendations) {
      if (recommendation.includes("reduce animations")) {
        setPerformanceMode(true)
        // Update CSS classes for performance mode
        document.body.classList.add("performance-mode")
      }

      if (recommendation.includes("map quality")) {
        // Implement map quality reduction
        await Task({
          subagent_type: "general-purpose",
          description: "Reduce map quality for performance",
          prompt: `
            Update the map configuration in src/lib/map/config.ts to:
            1. Reduce tile resolution for mobile devices
            2. Disable unnecessary map layers
            3. Optimize marker clustering
            4. Reduce update frequency
          `
        })
      }
    }
  }, [])

  return {
    setupMonitoring: () => setIsMonitoring(true),
    triggerPerformanceAnalysis,
    enablePerformanceMode: () => setPerformanceMode(true)
  }
}
```

### **Integration with Existing Performance Hook**

```typescript
// Enhanced src/hooks/useMobilePerformance.ts
import { usePerformanceAutomation } from './usePerformanceAutomation'

export function useMobilePerformance() {
  const existingLogic = useExistingMobilePerformance()
  const { triggerPerformanceAnalysis } = usePerformanceAutomation()

  // Add automated analysis trigger
  useEffect(() => {
    if (existingLogic.metrics.fps < 30 || existingLogic.metrics.deviceLoad > 0.8) {
      triggerPerformanceAnalysis(existingLogic.metrics)
    }
  }, [existingLogic.metrics, triggerPerformanceAnalysis])

  return {
    ...existingLogic,
    automatedOptimizations: true
  }
}
```

---

## 🔍 Priority 2: Code Quality Sentinel

### **Implementation: Automated Code Review Integration**

```typescript
// File: .claude/hooks/pre-commit-hook.json
{
  "event": "git:pre-commit",
  "conditions": {
    "file_patterns": ["src/**/*.{ts,tsx}", "src/**/*.css"]
  },
  "actions": [
    {
      "type": "agent",
      "agent": "pr-review-toolkit:code-reviewer",
      "parameters": {
        "focus_areas": [
          "mobile-first-responsive-design",
          "typescript-type-safety",
          "maplibre-gl-performance-patterns",
          "touch-interaction-handling",
          "accessibility-compliance"
        ],
        "custom_rules": [
          "Check touch target sizes (minimum 44px)",
          "Validate safe area handling",
          "Ensure map gesture optimization",
          "Check memory leak patterns",
          "Validate error boundaries"
        ]
      }
    },
    {
      "type": "tool",
      "tool": "mcp__chrome-devtools__take_screenshot",
      "parameters": {
        "device_emulation": "mobile",
        "full_page": true,
        "compare_with_baseline": true
      }
    }
  ]
}
```

### **Custom Code Review Rules for Drive SoCal POV**

```typescript
// File: scripts/drive-socal-review-rules.ts
export const driveSocalReviewRules = {
  mobileFirst: {
    rules: [
      {
        name: "touch_target_size",
        pattern: /<(button|a|div).*onClick/,
        validator: (node: ASTNode) => {
          // Check if touch targets meet minimum 44px requirement
          const styles = extractStyles(node)
          return styles.minWidth >= 44 && styles.minHeight >= 44
        },
        message: "Touch targets must be at least 44x44px for mobile accessibility"
      },
      {
        name: "safe_area_handling",
        pattern: /padding.*env\(safe-area-inset/,
        validator: (file: string) => {
          // Ensure safe area insets are used in mobile layouts
          return file.includes('env(safe-area-inset') ||
                 !file.includes('MobileLayout')
        },
        message: "Mobile layouts must use safe area insets for iPhone X+ devices"
      }
    ]
  },
  mapPerformance: {
    rules: [
      {
        name: "map_render_optimization",
        pattern: /MapContainer|useMap/,
        validator: (code: string) => {
          // Check for performance optimization patterns
          return code.includes('useMemo') ||
                 code.includes('useCallback') ||
                 code.includes('performance_mode')
        },
        message: "Map components should use React optimization patterns"
      },
      {
        name: "memory_cleanup",
        pattern: /useEffect.*map/,
        validator: (code: string) => {
          // Ensure proper cleanup in map effects
          return code.includes('return () =>') ||
                 code.includes('cleanup')
        },
        message: "Map effects must include cleanup functions to prevent memory leaks"
      }
    ]
  },
  locationData: {
    rules: [
      {
        name: "coordinate_validation",
        pattern: /latitude|longitude|coordinates/,
        validator: (code: string) => {
          // Ensure coordinate validation exists
          return code.includes('validateCoordinates') ||
                 code.includes('isValidCoordinate') ||
                 code.includes('bounds checking')
        },
        message: "Location data must include coordinate validation"
      }
    ]
  }
}
```

---

## 🚀 Priority 3: Build & Deploy Commander

### **Implementation: Automated Deployment Pipeline**

```typescript
// File: scripts/deployment-automation.ts
interface DeploymentPipeline {
  trigger: (triggerInfo: TriggerInfo) => Promise<void>
  rollback: (deploymentId: string) => Promise<void>
  getStatus: (deploymentId: string) => Promise<DeploymentStatus>
}

export const DriveSoCalDeploymentPipeline: DeploymentPipeline = {
  trigger: async (triggerInfo) => {
    try {
      // Step 1: Code Quality Validation
      console.log("🔍 Running code quality validation...")
      const qualityCheck = await Task({
        subagent_type: "pr-review-toolkit:code-reviewer",
        description: "Pre-deployment quality check",
        prompt: `
          Perform comprehensive pre-deployment validation for Drive SoCal POV:

          1. Validate TypeScript types are correct
          2. Check mobile responsiveness across device profiles
          3. Verify MapLibre GL integration
          4. Test Supabase connectivity
          5. Validate environment variables
          6. Check bundle size implications

          Report any blocking issues that must be resolved before deployment.
        `
      })

      if (qualityCheck.blockingIssues.length > 0) {
        throw new Error(`Blocking issues found: ${qualityCheck.blockingIssues.join(', ')}`)
      }

      // Step 2: Build Application
      console.log("🔨 Building application...")
      const buildResult = await Bash({
        command: "npm run build",
        description: "Build Drive SoCal POV for production"
      })

      if (buildResult.exitCode !== 0) {
        throw new Error("Build failed")
      }

      // Step 3: Deploy to Vercel
      console.log("🚀 Deploying to Vercel...")
      const deployment = await mcp__vercel__deploy_to_vercel()

      // Step 4: Post-Deployment Validation
      console.log("✅ Running post-deployment validation...")
      await validateDeployment(deployment.url)

      // Step 5: Performance Testing
      console.log("📊 Running performance tests...")
      await runPerformanceTests(deployment.url)

      return deployment

    } catch (error) {
      console.error("❌ Deployment failed:", error)
      await triggerRollback()
      throw error
    }
  },

  rollback: async (deploymentId) => {
    console.log("🔄 Initiating rollback...")

    // Get previous successful deployment
    const deployments = await mcp__vercel__list_deployments({
      teamId: process.env.VERCEL_TEAM_ID,
      projectId: process.env.VERCEL_PROJECT_ID
    })

    const previousDeployment = deployments.find(d =>
      d.state === "READY" && d.id !== deploymentId
    )

    if (previousDeployment) {
      await Bash({
        command: `vercel promote ${previousDeployment.id} --scope ${process.env.VERCEL_TEAM_ID}`,
        description: "Rollback to previous deployment"
      })

      console.log(`✅ Rolled back to deployment ${previousDeployment.id}`)
    }
  }
}

// Post-deployment validation
async function validateDeployment(deploymentUrl: string) {
  const validationTasks = await Promise.all([
    // Test mobile landing page
    mcp__chrome_devtools__navigate_page({ url: deploymentUrl }),
    mcp__chrome_devtools__emulate_network({ throttlingOption: "Slow 4G" }),
    mcp__chrome_devtools__wait_for({ text: "Drive SoCal POV" }),

    // Test map functionality
    mcp__chrome_devtools__evaluate_script({
      function: "() => window.mapLoaded"
    }),

    // Test Supabase connectivity
    mcp__chrome_devtools__evaluate_script({
      function: "() => window.supabaseConnected"
    })
  ])

  return validationTasks.every(result => result.success)
}

// Performance testing automation
async function runPerformanceTests(deploymentUrl: string) {
  console.log("Running mobile performance tests...")

  const performanceTest = await Task({
    subagent_type: "feature-dev:code-reviewer",
    description: "Mobile performance testing",
    prompt: `
      Test the mobile performance of ${deploymentUrl}:

      1. Test on low-end mobile device emulation
      2. Measure First Contentful Paint (FCP)
      3. Measure Largest Contentful Paint (LCP)
      4. Test map interaction performance
      5. Test memory usage
      6. Test network performance on 3G

      Provide performance scores and recommendations for improvement.
    `
  })

  if (performanceTest.scores.mobile < 80) {
    console.warn("⚠️ Mobile performance score below threshold:", performanceTest.scores.mobile)
  }
}
```

### **Git Hook Integration**

```json
// File: .git/hooks/post-push
{
  "name": "automated-deployment",
  "script": "node scripts/deployment-automation.js",
  "conditions": {
    "branch": "main",
    "changed_files": ["src/**/*", "package.json"]
  },
  "environment": {
    "NODE_ENV": "production",
    "DEPLOYMENT_TRIGGER": "git_push"
  }
}
```

---

## 🧪 Priority 4: Mobile Test Automation Suite

### **Implementation: Comprehensive Mobile Testing**

```typescript
// File: scripts/mobile-test-automation.ts
interface MobileTestSuite {
  runDeviceTests: () => Promise<TestResults[]>
  runNetworkTests: () => Promise<NetworkTestResults[]>
  runGestureTests: () => Promise<GestureTestResults[]>
}

export const DriveSoCalMobileTestSuite: MobileTestSuite = {
  runDeviceTests: async () => {
    const deviceProfiles = [
      {
        name: "Low-end Mobile",
        viewport: { width: 375, height: 667 },
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
        cpuThrottling: 4
      },
      {
        name: "High-end Mobile",
        viewport: { width: 390, height: 844 },
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
        cpuThrottling: 1
      },
      {
        name: "Tablet",
        viewport: { width: 768, height: 1024 },
        userAgent: "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)",
        cpuThrottling: 2
      }
    ]

    const testResults = []

    for (const device of deviceProfiles) {
      console.log(`📱 Testing on ${device.name}...`)

      // Setup device emulation
      await mcp__chrome_devtools__resize_page(device.viewport)
      await mcp__chrome_devtools__emulate_cpu({ throttlingRate: device.cpuThrottling })

      // Navigate to application
      await mcp__chrome_devtools__navigate_page({ url: "http://localhost:3000" })

      // Run performance tests
      const performanceResult = await runPerformanceTests(device)

      // Run functionality tests
      const functionalityResult = await runFunctionalityTests(device)

      // Run visual regression tests
      const visualResult = await runVisualTests(device)

      testResults.push({
        device: device.name,
        performance: performanceResult,
        functionality: functionalityResult,
        visual: visualResult
      })
    }

    return testResults
  },

  runNetworkTests: async () => {
    const networkConditions = [
      { name: "Slow 3G", option: "Slow 3G" },
      { name: "Fast 3G", option: "Fast 3G" },
      { name: "4G", option: "4G" },
      { name: "WiFi", option: "No emulation" }
    ]

    const networkResults = []

    for (const condition of networkConditions) {
      console.log(`🌐 Testing on ${condition.name}...`)

      await mcp__chrome_devtools__emulate_network({ throttlingOption: condition.option })

      // Test map loading performance
      const mapLoadTime = await measureMapLoadTime()

      // Test location search performance
      const searchTime = await measureSearchPerformance()

      // Test navigation responsiveness
      const navigationTime = await measureNavigationPerformance()

      networkResults.push({
        network: condition.name,
        mapLoadTime,
        searchTime,
        navigationTime
      })
    }

    return networkResults
  },

  runGestureTests: async () => {
    const gestures = [
      { name: "Pan", action: "pan", coordinates: [{x: 200, y: 400}, {x: 300, y: 400}] },
      { name: "Zoom In", action: "pinch-in", coordinates: [{x: 200, y: 300}, {x: 250, y: 350}] },
      { name: "Zoom Out", action: "pinch-out", coordinates: [{x: 200, y: 300}, {x: 150, y: 250}] },
      { name: "Tap Marker", action: "tap", coordinates: [{x: 300, y: 400}] }
    ]

    const gestureResults = []

    for (const gesture of gestures) {
      console.log(`👆 Testing ${gesture.name} gesture...`)

      // Execute gesture
      await executeGesture(gesture)

      // Measure response time
      const responseTime = await measureGestureResponse(gesture)

      // Validate gesture result
      const gestureValid = await validateGestureResult(gesture)

      gestureResults.push({
        gesture: gesture.name,
        responseTime,
        valid: gestureValid
      })
    }

    return gestureResults
  }
}

// Test execution functions
async function runPerformanceTests(device: DeviceProfile) {
  await mcp__chrome_devtools__performance_start_trace({ reload: true, autoStop: true })

  // Wait for page to fully load
  await mcp__chrome_devtools__wait_for({ text: "Explore Southern California" })

  // Get performance metrics
  const performanceMetrics = await mcp__chrome_devtools__evaluate_script({
    function: "() => ({ fps: window.currentFPS, memory: performance.memory?.usedJSHeapSize })"
  })

  return {
    fps: performanceMetrics.fps,
    memoryUsage: performanceMetrics.memory,
    deviceLoad: calculateDeviceLoad(performanceMetrics)
  }
}

async function runFunctionalityTests(device: DeviceProfile) {
  const tests = [
    {
      name: "Map Loads",
      test: async () => {
        await mcp__chrome_devtools__wait_for({ text: "Map loaded successfully", timeout: 10000 })
        return true
      }
    },
    {
      name: "Location Search Works",
      test: async () => {
        await mcp__chrome_devtools__fill({
          uid: "search-input",
          value: "San Diego"
        })
        await mcp__chrome_devtools__click({ uid: "search-button" })
        await mcp__chrome_devtools__wait_for({ text: "San Diego" })
        return true
      }
    },
    {
      name: "Mobile Menu Opens",
      test: async () => {
        await mcp__chrome_devtools__click({ uid: "mobile-menu-button" })
        await mcp__chrome_devtools__wait_for({ text: "My Itinerary" })
        return true
      }
    }
  ]

  const results = {}

  for (const test of tests) {
    try {
      results[test.name] = await test.test()
    } catch (error) {
      results[test.name] = false
      console.error(`Test ${test.name} failed:`, error)
    }
  }

  return results
}

async function runVisualTests(device: DeviceProfile) {
  // Take screenshot for visual comparison
  const screenshot = await mcp__chrome_devtools__take_screenshot({
    format: "png",
    quality: 90,
    fullPage: true,
    filePath: `test-results/screenshots/${device.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`
  })

  // Compare with baseline
  const visualDiff = await compareWithBaseline(screenshot, device.name)

  return {
    screenshotPath: screenshot,
    visualDifference: visualDiff,
    passed: visualDiff < 0.05 // 5% threshold
  }
}
```

---

## 📊 Priority 5: Silent Failure Hunter

### **Implementation: Error Detection Automation**

```typescript
// File: scripts/silent-failure-hunter.ts
interface SilentFailureHunter {
  huntForFailures: () => Promise<FailureReport[]>
  validateErrorHandling: () => Promise<ValidationReport[]>
  testExceptionScenarios: () => Promise<ExceptionTestResults[]>
}

export const DriveSoCalSilentFailureHunter: SilentFailureHunter = {
  huntForFailures: async () => {
    const failurePatterns = [
      {
        name: "Swallowed Promises",
        pattern: /\.then\([^)]*\)[^;]*;(?!\s*catch)/,
        description: "Promise chains without catch blocks",
        severity: "high"
      },
      {
        name: "Missing Error Boundaries",
        pattern: /React\.createElement|jsx/,
        description: "Components without error boundaries",
        severity: "medium"
      },
      {
        name: "Unhandled Map Events",
        pattern: /map\.on\(|addEventListener/,
        description: "Map event listeners without error handling",
        severity: "high"
      },
      {
        name: "Async Function Without Try-Catch",
        pattern: /async\s+\w+\s*\([^)]*\)\s*=>\s*{(?![^}]*try)/,
        description: "Async functions without error handling",
        severity: "high"
      }
    ]

    const failureReports = []

    for (const pattern of failurePatterns) {
      const analysis = await Task({
        subagent_type: "pr-review-toolkit:silent-failure-hunter",
        description: `Hunt for ${pattern.name}`,
        prompt: `
          Search for ${pattern.name} in the Drive SoCal POV codebase:

          Pattern: ${pattern.pattern}
          Description: ${pattern.description}
          Severity: ${pattern.severity}

          Focus on these files:
          - src/components/map/
          - src/hooks/
          - src/services/
          - src/app/

          For each finding, provide:
          1. File path and line number
          2. Code snippet
          3. Potential impact
          4. Recommended fix
          5. Severity assessment
        `
      })

      failureReports.push({
        pattern: pattern.name,
        findings: analysis.findings,
        severity: pattern.severity,
        recommendations: analysis.recommendations
      })
    }

    return failureReports
  },

  validateErrorHandling: async () => {
    const validationResults = []

    // Test network failure scenarios
    const networkFailureTest = await testNetworkFailures()
    validationResults.push(networkFailureTest)

    // Test GPS failure scenarios
    const gpsFailureTest = await testGPSFailures()
    validationResults.push(gpsFailureTest)

    // Test map loading failures
    const mapFailureTest = await testMapFailures()
    validationResults.push(mapFailureTest)

    // Test authentication failures
    const authFailureTest = await testAuthFailures()
    validationResults.push(authFailureTest)

    return validationResults
  }
}

// Specific failure scenario tests
async function testNetworkFailures() {
  console.log("🌐 Testing network failure scenarios...")

  // Simulate network disconnection
  await mcp__chrome_devtools__emulate_network({ throttlingOption: "Offline" })

  // Test location search failure
  await mcp__chrome_devtools__fill({ uid: "search-input", value: "Los Angeles" })
  await mcp__chrome_devtools__click({ uid: "search-button" })

  // Check if error is handled gracefully
  const errorMessage = await mcp__chrome_devtools__evaluate_script({
    function: () => {
      return document.querySelector('[data-testid="error-message"]')?.textContent ||
             document.querySelector('.error')?.textContent ||
             'No error message found'
    }
  })

  // Test if app remains functional
  const appStillFunctional = await mcp__chrome_devtools__evaluate_script({
    function: () => {
      return document.querySelector('[data-testid="map-container"]') !== null
    }
  })

  // Restore network
  await mcp__chrome_devtools__emulate_network({ throttlingOption: "No emulation" })

  return {
    scenario: "Network Failure",
    errorHandled: errorMessage !== 'No error message found',
    appRemainsFunctional: appStillFunctional,
    userMessage: errorMessage,
    recommendations: errorMessage === 'No error message found' ?
      ["Add user-friendly error messages for network failures"] : []
  }
}

async function testGPSFailures() {
  console.log("📍 Testing GPS failure scenarios...")

  // Block geolocation
  await mcp__chrome_devtools__evaluate_script({
    function: () => {
      // Override geolocation to simulate failure
      navigator.geolocation = {
        getCurrentPosition: (success, error, options) => {
          setTimeout(() => error({ code: 2, message: "Location unavailable" }), 100)
        }
      }
    }
  })

  // Trigger location request
  await mcp__chrome_devtools__click({ uid: "get-location-button" })

  // Check error handling
  const locationErrorHandled = await mcp__chrome_devtools__evaluate_script({
    function: () => {
      return document.querySelector('[data-testid="location-error"]') !== null
    }
  })

  return {
    scenario: "GPS Failure",
    errorHandled: locationErrorHandled,
    fallbackAvailable: true, // Check if manual location entry is available
    recommendations: locationErrorHandled ? [] :
      ["Add graceful GPS failure handling with manual location entry"]
  }
}
```

---

## 🗺️ Priority 6: Location Content Validator

### **Implementation: Automated Content Quality Assurance**

```typescript
// File: scripts/location-content-validator.ts
interface LocationContentValidator {
  validateNewContent: (content: LocationContent) => Promise<ValidationResult>
  validateExistingContent: () => Promise<BatchValidationResult>
  checkDataIntegrity: () => Promise<IntegrityReport>
}

export const DriveSoCalLocationValidator: LocationContentValidator = {
  validateNewContent: async (content) => {
    const validationTasks = [
      validateCoordinates(content.coordinates),
      validateCompleteness(content),
      validateAccuracy(content),
      checkDuplicates(content)
    ]

    const results = await Promise.all(validationTasks)

    return {
      valid: results.every(r => r.valid),
      errors: results.flatMap(r => r.errors),
      warnings: results.flatMap(r => r.warnings),
      score: calculateValidationScore(results)
    }
  },

  validateExistingContent: async () => {
    // Get all locations from Supabase
    const locations = await mcp__supabase__execute_sql({
      query: "SELECT * FROM locations WHERE status = 'active'"
    })

    const validationResults = []

    for (const location of locations) {
      const result = await this.validateNewContent(location)
      validationResults.push({
        id: location.id,
        name: location.name,
        validation: result
      })
    }

    return {
      total: locations.length,
      valid: validationResults.filter(r => r.validation.valid).length,
      invalid: validationResults.filter(r => !r.validation.valid).length,
      details: validationResults
    }
  }
}

// Validation functions
async function validateCoordinates(coordinates: Coordinates) {
  const errors = []
  const warnings = []

  // Check if coordinates are within Southern California bounds
  const soCalBounds = {
    north: 34.6,
    south: 31.5,
    east: -113.5,
    west: -120.5
  }

  if (coordinates.lat < soCalBounds.south || coordinates.lat > soCalBounds.north) {
    errors.push(`Latitude ${coordinates.lat} is outside Southern California bounds`)
  }

  if (coordinates.lng < soCalBounds.west || coordinates.lng > soCalBounds.east) {
    errors.push(`Longitude ${coordinates.lng} is outside Southern California bounds`)
  }

  // Validate coordinate precision
  if (coordinates.lat.toFixed(4) === coordinates.lat.toFixed(6)) {
    warnings.push("Coordinate precision may be too low for accurate mapping")
  }

  // Use web search to verify location accuracy
  const locationSearch = await mcp__web_search_prime__webSearchPrime({
    search_query: `${coordinates.lat}, ${coordinates.lng} location accuracy`,
    count: 3
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    verificationData: locationSearch
  }
}

async function validateCompleteness(content: LocationContent) {
  const required = ['name', 'description', 'category', 'coordinates', 'address']
  const recommended = ['phone', 'website', 'hours', 'photos']

  const errors = []
  const warnings = []

  for (const field of required) {
    if (!content[field] || content[field].trim() === '') {
      errors.push(`Required field '${field}' is missing or empty`)
    }
  }

  for (const field of recommended) {
    if (!content[field] || content[field].trim() === '') {
      warnings.push(`Recommended field '${field}' is missing`)
    }
  }

  // Validate description quality
  if (content.description && content.description.length < 50) {
    warnings.push("Description is too short for comprehensive user information")
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

async function checkDuplicates(content: LocationContent) {
  // Check for potential duplicates in database
  const duplicateCheck = await mcp__supabase__execute_sql({
    query: `
      SELECT id, name, address,
             ST_Distance(coordinates, ST_MakePoint(${content.coordinates.lng}, ${content.coordinates.lat})) as distance
      FROM locations
      WHERE ST_Distance(coordinates, ST_MakePoint(${content.coordinates.lng}, ${content.coordinates.lat})) < 0.01
      LIMIT 5
    `
  })

  const warnings = []

  if (duplicateCheck.length > 0) {
    warnings.push(`Found ${duplicateCheck.length} potential duplicates nearby`)
    for (const duplicate of duplicateCheck) {
      warnings.push(`- ${duplicate.name} (${duplicate.address}) - ${duplicate.distance}m away`)
    }
  }

  return {
    valid: true, // Duplicates are warnings, not errors
    errors: [],
    warnings,
    potentialDuplicates: duplicateCheck
  }
}
```

---

## 🎯 Integration Configuration Examples

### **Claude Settings Configuration**

```json
// File: .claude/settings.local.json
{
  "permissions": {
    "allow": [
      "Task(feature-dev:code-reviewer)",
      "Task(pr-review-toolkit:silent-failure-hunter)",
      "Task(pr-review-toolkit:code-reviewer)",
      "Task(feature-dev:code-architect)",
      "mcp__chrome-devtools__performance_start_trace",
      "mcp__chrome-devtools__take_screenshot",
      "mcp__chrome-devtools__emulate_network",
      "mcp__chrome_devtools__emulate_cpu",
      "mcp__vercel__deploy_to_vercel",
      "mcp__supabase__execute_sql",
      "mcp__supabase__apply_migration",
      "Bash(npm run build)",
      "Bash(npm run type-check)",
      "Bash(npm run lint)",
      "Write(test-results/**/*)",
      "Edit(src/**/*.{ts,tsx})"
    ],
    "deny": [
      "Bash(rm -rf)",
      "Bash(sudo)",
      "Edit(.env*)"
    ],
    "ask": [
      "mcp__supabase__apply_migration",
      "mcp__vercel__deploy_to_vercel --prod"
    ]
  },
  "hooks": {
    "pre_commit": [
      {
        "command": "Task(pr-review-toolkit:code-reviewer)",
        "description": "Automated code review"
      },
      {
        "command": "Bash(npm run type-check)",
        "description": "Type checking"
      }
    ],
    "post_merge": [
      {
        "command": "Task(deployment-automation)",
        "description": "Automated deployment pipeline"
      }
    ]
  }
}
```

### **Package.json Scripts**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "automated-test": "node scripts/mobile-test-automation.js",
    "validate-content": "node scripts/location-content-validator.js",
    "hunt-failures": "node scripts/silent-failure-hunter.js",
    "deploy-with-validation": "npm run validate-content && npm run automated-test && node scripts/deployment-automation.js",
    "performance-audit": "Task(feature-dev:code-reviewer focus=mobile-performance)",
    "security-scan": "Task(pr-review-toolkit:silent-failure-hunter focus=security)"
  }
}
```

### **GitHub Actions Workflow**

```yaml
# File: .github/workflows/automation.yml
name: Drive SoCal POV Automation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  automated-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run type-check

      - name: Run automated tests
        run: npm run automated-test

      - name: Hunt for silent failures
        run: npm run hunt-failures

      - name: Validate content
        run: npm run validate-content

      - name: Build application
        run: npm run build

      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        run: npx vercel --scope ${{ secrets.VERCEL_TEAM_ID }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📈 Success Metrics & Monitoring

### **Dashboard Configuration**

```typescript
// File: scripts/monitoring-dashboard.ts
export const DriveSoCalMonitoringDashboard = {
  metrics: [
    {
      name: "Mobile Performance Score",
      query: "avg(mobile_performance_score)",
      threshold: { warning: 80, critical: 60 }
    },
    {
      name: "Code Review Coverage",
      query: "code_review_coverage_percentage",
      threshold: { warning: 90, critical: 80 }
    },
    {
      name: "Automated Test Pass Rate",
      query: "automated_test_success_rate",
      threshold: { warning: 95, critical: 85 }
    },
    {
      name: "Deployment Success Rate",
      query: "deployment_success_percentage",
      threshold: { warning: 95, critical: 90 }
    },
    {
      name: "Silent Failure Detection",
      query: "silent_failures_detected_per_day",
      threshold: { warning: 5, critical: 10 }
    }
  ],

  alerts: [
    {
      name: "Performance Degradation",
      condition: "mobile_performance_score < 70",
      action: "trigger_performance_optimization_agent"
    },
    {
      name: "Critical Build Failure",
      condition: "build_status == 'failed'",
      action: "notify_devops_team"
    },
    {
      name: "Silent Failures Detected",
      condition: "silent_failures_detected > 8",
      action: "trigger_comprehensive_code_review"
    }
  ]
}
```

---

**Last Updated**: 2025-10-15
**Status**: Implementation Examples
**Version**: 1.0
**Next Review**: After Agent Implementation
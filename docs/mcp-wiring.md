# MCP Server Wiring and Configuration

## OVERVIEW
Drive SoCal POV uses 6 essential MCP servers for comprehensive development automation. All servers are configured and operational.

## CONFIGURED MCP SERVERS

### ✅ Context7 MCP (Upstash)
**Purpose**: Up-to-date, version-specific documentation and code examples
**Transport**: npx
**Status**: ✅ Connected

**Tools**:
- `resolve-library-id` - Resolve library names to Context7-compatible IDs
- `get-library-docs` - Fetch latest documentation with token limits

**Configuration**:
```bash
# Automatically invoked via:
npx -y @upstash/context7-mcp
```

**Usage Examples**:
```javascript
// Resolve Next.js documentation
const libraryId = await mcp__context7__resolve-library-id("Next.js")

// Get React hooks documentation (10,000 tokens)
const docs = await mcp__context7__get_library_docss({
  context7CompatibleLibraryID: "/facebook/react",
  topic: "hooks",
  tokens: 10000
})
```

**Parameters**:
- `context7CompatibleLibraryID` (required): Exact Context7 library ID format
- `topic` (optional): Focus documentation on specific topics
- `tokens` (optional): Maximum tokens to return (default: 10000)

**Rate Limits**: Standard Upstash limits apply

### ✅ Z.AI Web Search MCP
**Purpose**: Live web search with real-time data and filtering
**Transport**: HTTP
**Status**: ✅ Connected

**Tools**:
- `webSearchPrime` - Advanced web search with multiple parameters

**Configuration**:
```bash
# Automatically invoked via:
https://api.z.ai/api/mcp/web_search_prime/mcp
```

**Usage Examples**:
```javascript
// Search for Southern California travel information
const results = await mcp__web-search-prime__webSearchPrime({
  search_query: "Southern California travel guide 2025",
  count: 10,
  search_recency_filter: "oneMonth",
  content_size: "medium"
})

// Search with location filter
const localResults = await mcp__web-search-prime__webSearchPrime({
  search_query: "San Diego best restaurants",
  count: 5,
  search_domain_filter: "sandiego.gov",
  search_recency_filter: "oneWeek"
})
```

**Parameters**:
- `search_query` (required): Search query (max 70 characters)
- `count` (optional): Number of results (1-50, default: 10)
- `search_recency_filter` (optional): oneDay, oneWeek, oneMonth, oneYear, noLimit
- `search_domain_filter` (optional): Limit to specific domains
- `content_size` (optional): medium (default), high
- `location` (optional): cn (China), us (non-China)

**Rate Limits**: Standard Z.AI API limits

### ✅ Z.AI Vision MCP
**Purpose**: Image and video analysis with AI vision capabilities
**Transport**: npx
**Status**: ✅ Connected

**Tools**:
- `analyze_image` - Analyze images with advanced AI vision
- `analyze_video` - Analyze video content

**Configuration**:
```bash
# Automatically invoked via:
npx -y @z_ai/mcp-server
```

**Usage Examples**:
```javascript
// Analyze mobile app screenshot for UI/UX
const uiAnalysis = await mcp__zai-mcp-server__analyze_image({
  image_source: "screenshot.png",
  prompt: "Analyze this mobile app UI for usability, accessibility, and design patterns. Focus on touch interaction areas and navigation clarity."
})

// Analyze map interface
const mapAnalysis = await mcp__zai-mcp-server__analyze_image({
  image_source: "map-interface.jpg",
  prompt: "Describe in detail the layout structure, color style, main components, and interactive elements of this map interface to facilitate subsequent code generation."
})

// Analyze video content
const videoAnalysis = await mcp__zai-mcp-server__analyze_video({
  video_source: "demo-video.mp4",
  prompt: "Analyze this mobile app demonstration for user interaction patterns and usability issues."
})
```

**Parameters**:
- `image_source` (required): Local file path or remote URL (PNG, JPG, JPEG, max 5MB)
- `video_source` (required): Local file path or remote URL (MP4, MOV, M4V, max 8MB)
- `prompt` (required): Detailed analysis instructions

**Rate Limits**: Standard Z.AI API limits

### ✅ Chrome DevTools MCP
**Purpose**: Live browser inspection, automation, and debugging
**Transport**: npx
**Status**: ✅ Connected

**Tools**:
- Page Management: `list_pages`, `select_page`, `new_page`, `close_page`, `navigate_page`
- Interaction: `click`, `fill`, `fill_form`, `hover`, `drag`, `upload_file`
- Analysis: `take_snapshot`, `take_screenshot`, `evaluate_script`, `list_console_messages`
- Performance: `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight`
- Network: `list_network_requests`, `get_network_request`
- System: `resize_page`, `emulate_network`, `emulate_cpu`, `wait_for`

**Configuration**:
```bash
# Automatically invoked via:
npx chrome-devtools-mcp@latest
```

**Usage Examples**:
```javascript
// Browser automation for testing
await mcp__chrome-devtools__new_page("https://drivesocalpov.vercel.app")
await mcp__chrome-devtools__wait_for("map-container", 10000)
await mcp__chrome-devtools__take_screenshot({
  format: "png",
  fullPage: true,
  filePath: "screenshots/mobile-view.png"
})

// Mobile testing
await mcp__chrome-devtools__resize_page(375, 667) // iPhone SE
await mcp__chrome-devtools__emulate_network("Slow 3G")

// Performance analysis
await mcp__chrome-devtools__performance_start_trace({ reload: true, autoStop: true })
// ... interact with page ...
await mcp__chrome-devtools__performance_analyze_insight("DocumentLatency")

// Mobile interaction testing
const snapshot = await mcp__chrome-devtools__take_snapshot()
const burgerMenu = snapshot.elements.find(el => el.uid.includes('burger-menu'))
await mcp__chrome-devtools__click(burgerMenu.uid)
```

**Parameters**: Varies by tool, all well-documented with schemas

**Rate Limits**: Limited by Chrome DevTools Protocol and local browser performance

### ✅ Vercel MCP
**Purpose**: Vercel project management, deployment, and monitoring
**Transport**: HTTP
**Status**: ✅ Connected

**Tools**:
- Project Management: `list_projects`, `get_project`
- Deployment: `deploy_to_vercel`, `list_deployments`, `get_deployment`
- Logs & Debugging: `get_deployment_build_logs`, `list_teams`
- Domains: `check_domain_availability_and_price`
- Access: `get_access_to_vercel_url`, `web_fetch_vercel_url`

**Configuration**:
```bash
# Automatically invoked via:
https://mcp.vercel.com
```

**Usage Examples**:
```javascript
// Deploy to Vercel
const deployment = await mcp__vercel__deploy_to_vercel()

// List recent deployments
const deployments = await mcp__vercel__list_deployments({
  projectId: "prj_abc123",
  teamId: "team_xyz789",
  since: Date.now() - 7 * 24 * 60 * 60 * 1000 // Last week
})

// Get deployment build logs for debugging
const logs = await mcp__vercel__get_deployment_build_logs({
  idOrUrl: "https://drivesocalpov-abc123.vercel.app",
  teamId: "team_xyz789",
  limit: 50
})

// Access protected deployment
const shareableUrl = await mcp__vercel__get_access_to_vercel_url({
  url: "https://drivesocalpov.vercel.app"
})
```

**Parameters**:
- `projectId` (required for most operations): Vercel project ID
- `teamId` (required for team projects): Vercel team ID
- Various optional parameters for filtering and pagination

**Rate Limits**: Vercel API rate limits apply

### ✅ Supabase MCP
**Purpose**: Supabase database operations, authentication, and edge functions
**Transport**: HTTP
**Status**: ✅ Connected

**Tools**:
- Database: `apply_migration`, `execute_sql`, `list_tables`, `list_extensions`, `list_migrations`
- Types: `generate_typescript_types`
- Branching: `list_branches`, `create_branch`, `delete_branch`, `merge_branch`, `reset_branch`, `rebase_branch`
- Edge Functions: `list_edge_functions`, `get_edge_function`, `deploy_edge_function`
- Observability: `get_logs`, `get_advisors`, `get_project_url`, `get_anon_key`
- Documentation: `search_docs`

**Configuration**:
```bash
# Automatically invoked via:
https://mcp.supabase.com/mcp?project_ref=rlaunllhzkjxigxjgivv
```

**Usage Examples**:
```javascript
// Apply database migration
await mcp__supabase__apply_migration({
  name: "add_locations_table",
  query: `
    CREATE TABLE locations (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      latitude DECIMAL(10, 8) NOT NULL,
      longitude DECIMAL(11, 8) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Locations are viewable by everyone"
    ON locations FOR SELECT USING (true);
  `
})

// Generate TypeScript types
const types = await mcp__supabase__generate_typescript_types()

// Execute SQL queries
const result = await mcp__supabase__execute_sql({
  query: "SELECT COUNT(*) as total_locations FROM locations;"
})

// Create development branch
const branch = await mcp__supabase__create_branch({
  name: "feature-new-map",
  confirm_cost_id: "cost_confirmation_123"
})

// Deploy Edge Function
await mcp__supabase__deploy_edge_function({
  name: "location-search",
  files: [
    {
      name: "index.ts",
      content: `
        import "jsr:@supabase/functions-js/edge-runtime.d.ts"

        Deno.serve(async (req: Request) => {
          const { method } = req

          if (method === 'GET') {
            const data = { message: "Location search API" }
            return new Response(JSON.stringify(data), {
              headers: { 'Content-Type': 'application/json' }
            })
          }

          return new Response('Method not allowed', { status: 405 })
        })
      `
    }
  ]
})
```

**Parameters**:
- Most database operations work on the currently connected project
- Branch operations require `confirm_cost_id` from cost confirmation
- Edge Functions require file content and proper TypeScript syntax

**Rate Limits**: Supabase API rate limits apply

## MCP SERVER STATUS MONITORING

### Health Check Command
```bash
/mcp --status
# Shows connection status for all configured servers
```

### Individual Server Testing
```bash
/mcp context7 --test
/mcp web-search-prime --test
/mcp zai-mcp-server --test
/mcp chrome-devtools --test
/mcp vercel --test
/mcp supabase --test
```

## MCP INTEGRATION EXAMPLES

### Research and Documentation Workflow
```javascript
// 1. Research latest Next.js best practices
const nextjsId = await mcp__context7__resolve-library-id("Next.js")
const nextjsDocs = await mcp__context7__get_library_docss({
  context7CompatibleLibraryID: nextjsId,
  topic: "app router",
  tokens: 5000
})

// 2. Search for current mobile development trends
const trends = await mcp__web-search-prime__webSearchPrime({
  search_query: "mobile-first web development 2025 best practices",
  count: 10,
  search_recency_filter: "oneMonth"
})

// 3. Analyze competitor mobile app
const analysis = await mcp__zai-mcp-server__analyze_image({
  image_source: "competitor-app.png",
  prompt: "Analyze this mobile travel app for UX patterns and feature ideas"
})
```

### Testing and Deployment Workflow
```javascript
// 1. Deploy preview environment
const deployment = await mcp__vercel__deploy_to_vercel()

// 2. Test deployment with Chrome DevTools
await mcp__chrome-devtools__new_page(deployment.url)
await mcp__chrome-devtools__wait_for("map-container", 10000)

// 3. Run performance analysis
await mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})

// 4. Verify database connectivity
const dbHealth = await mcp__supabase__execute_sql({
  query: "SELECT 1 as health_check;"
})
```

## MCP SERVER CONFIGURATION FILES

All MCP servers are automatically configured through `.claude/settings.json`. No additional configuration files needed.

## TROUBLESHOOTING

### Common Issues
1. **Server Connection Failed**: Check network connectivity and server status
2. **Authentication Errors**: Verify API keys and permissions
3. **Rate Limiting**: Wait for rate limit reset or reduce request frequency
4. **Timeout Issues**: Increase timeout values or reduce request complexity

### Debug Commands
```bash
/mcp --list                    # List all servers
/mcp context7 --schema         # Show tool schemas
/mcp supabase --examples       # Show usage examples
```

## BEST PRACTICES

1. **Use Context7 First**: Always try Context7 for library documentation before web search
2. **Batch Operations**: Group related operations to reduce API calls
3. **Error Handling**: Always wrap MCP calls in try-catch blocks
4. **Rate Limiting**: Implement exponential backoff for failed requests
5. **Caching**: Cache results when appropriate to reduce API usage
6. **Validation**: Validate parameters before making MCP calls
7. **Logging**: Log MCP operations for debugging and monitoring

## NEXT STEPS

All required MCP servers are configured and operational. The development environment is ready for:
- Automated documentation research
- Live web searches for current information
- Image and video analysis
- Browser automation and testing
- Vercel deployment management
- Supabase database operations
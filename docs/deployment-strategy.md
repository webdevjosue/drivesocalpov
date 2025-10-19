# Supabase + Vercel Deployment Strategy

## ENVIRONMENT STRATEGY

### Environment Separation
- **Local Development**: `.env.local` with local Supabase instance
- **Preview Environment**: Every non-main branch → Preview deploy + matching Supabase branch
- **Production Environment**: main branch + production Supabase project/branch

### Environment Mapping
```
Git Branch          → Vercel Environment      → Supabase Branch
─────────────────────────────────────────────────────────────
main                → Production             → main
feature/*           → Preview                → feature-[branch-name]
hotfix/*            → Preview                → hotfix-[branch-name]
develop             → Preview                → develop
```

## PROJECT CONFIGURATION

### Current Setup Status
- ✅ **Vercel Project**: Available at drivesocalpov.vercel.app
- ✅ **Supabase Project**: Connected (project_ref: rlaunllhzkjxigxjgivv)
- ✅ **MCP Integration**: Both Vercel and Supabase MCP servers operational
- ❌ **Vercel CLI**: Not linked locally
- ❌ **Supabase CLI**: Not configured locally

### Required Configuration
1. **Vercel CLI Linking**: `vercel link` to connect local repo to Vercel project
2. **Supabase CLI Setup**: Configure local Supabase development environment
3. **Environment Variables**: Set up proper environment separation
4. **Database Branching**: Configure preview database branches

## DEPLOYMENT WORKFLOW

### Preview Deployment Process
```bash
# 1. Create feature branch
git checkout -b feature/new-location-filters

# 2. Make changes and commit
git add .
git commit -m "feat: add new location filtering options"

# 3. Push to remote
git push origin feature/new-location-filters

# 4. Create Supabase branch (automated via MCP)
mcp__supabase__create_branch({
  name: "feature-new-location-filters",
  confirm_cost_id: "cost_id_from_approval"
})

# 5. Deploy to preview (automated via MCP)
mcp__vercel__deploy_to_vercel()

# 6. Run post-deployment checks
npm run health-check -- --url=https://feature-new-location-filters.drivesocalpov.vercel.app
```

### Production Deployment Process
```bash
# 1. Ensure on main branch
git checkout main
git pull origin main

# 2. Run full test suite
npm run test:unit
npm run test:e2e
npm run test:accessibility

# 3. Type checking and build
npm run type-check
npm run build

# 4. Deploy to production (automated via MCP)
mcp__vercel__deploy_to_vercel()

# 5. Merge Supabase changes to main
mcp__supabase__merge_branch({
  branch_id: "feature-branch-id"
})

# 6. Production health checks
npm run health-check -- --url=https://drivesocalpov.vercel.app
```

## ENVIRONMENT VARIABLES CONFIGURATION

### Required Environment Variables

#### Local Development (.env.local)
```bash
# Supabase Local Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_key

# Development Flags
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true

# Map Configuration
NEXT_PUBLIC_MAP_STYLE=standard
```

#### Preview Environment
```bash
# Supabase Preview Branch Configuration
NEXT_PUBLIC_SUPABASE_URL=https://feature-branch-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=preview_branch_anon_key
SUPABASE_SERVICE_ROLE_KEY=preview_branch_service_key

# Environment Identification
NEXT_PUBLIC_ENVIRONMENT=preview
NEXT_PUBLIC_BRANCH_NAME=feature-branch-name

# Feature Flags
NEXT_PUBLIC_FEATURE_FLAGS={"new_features": true, "experimental_ui": true}
```

#### Production Environment
```bash
# Supabase Production Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rlaunllhzkjxigxjgivv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production_anon_key
SUPABASE_SERVICE_ROLE_KEY=production_service_key

# Production Configuration
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false

# Feature Flags
NEXT_PUBLIC_FEATURE_FLAGS={"new_features": false, "stability_mode": true}

# Analytics and Monitoring
NEXT_PUBLIC_SENTRY_DSN=production_sentry_dsn
NEXT_PUBLIC_ANALYTICS_ID=production_analytics_id
```

## DATABASE BRANCHING STRATEGY

### Branch Creation Workflow
```javascript
// Automated branch creation via MCP
const createPreviewBranch = async (branchName) => {
  // 1. Create Supabase branch
  const branch = await mcp__supabase__create_branch({
    name: branchName,
    confirm_cost_id: await getCostConfirmation()
  })

  // 2. Switch to branch context
  await mcp__supabase__switchBranch(branch.id)

  // 3. Run migrations on new branch
  await mcp__supabase__apply_migration({
    name: "initial_setup",
    query: getMigrationSQL()
  })

  // 4. Seed test data
  await mcp__supabase__execute_sql({
    query: getSeedDataSQL()
  })

  // 5. Generate branch-specific types
  await mcp__supabase__generate_typescript_types()

  return branch
}
```

### Branch Merge Workflow
```javascript
// Automated branch merging via MCP
const mergeToProduction = async (branchId) => {
  // 1. Validate branch is ready for merge
  const validation = await validateBranchForMerge(branchId)
  if (!validation.valid) {
    throw new Error(`Branch not ready: ${validation.errors.join(', ')}`)
  }

  // 2. Create backup of production
  await createProductionBackup()

  // 3. Merge branch to production
  await mcp__supabase__merge_branch({ branchId })

  // 4. Update production types
  await mcp__supabase__generate_typescript_types()

  // 5. Run post-merge health checks
  await runPostMergeHealthChecks()

  return { success: true, mergedAt: new Date() }
}
```

## ROLLBACK PROCEDURES

### Application Rollback
```bash
# Quick rollback to previous deployment
mcp__vercel__get_deployment({
  idOrUrl: "https://previous-deployment.vercel.app"
})

# Or using rollback command
vercel rollback https://previous-deployment.vercel.app
```

### Database Rollback
```javascript
// Database rollback via MCP
const rollbackDatabase = async (migrationVersion) => {
  // 1. Create backup before rollback
  await mcp__supabase__execute_sql({
    query: "CREATE TABLE backup_locations AS SELECT * FROM locations;"
  })

  // 2. Reset database to specific migration
  await mcp__supabase__reset_branch({
    branch_id: "main",
    migration_version: migrationVersion
  })

  // 3. Restore critical data if needed
  await mcp__supabase__execute_sql({
    query: `
      INSERT INTO locations (name, description, latitude, longitude)
      SELECT name, description, latitude, longitude
      FROM backup_locations
      WHERE created_at > NOW() - INTERVAL '1 hour';
    `
  })

  return { success: true, rollbackAt: new Date() }
}
```

## MONITORING AND OBSERVABILITY

### Deployment Monitoring
- **Pre-deployment**: Code quality checks, test validation, build verification
- **During Deployment**: Real-time progress tracking, error monitoring
- **Post-deployment**: Health checks, performance monitoring, accessibility testing

### Environment Health Monitoring
```javascript
// Comprehensive health check via MCP tools
const monitorEnvironmentHealth = async (environment) => {
  const results = {}

  // Application Health
  results.app = await checkApplicationHealth(environment)

  // Database Health
  results.database = await mcp__supabase__execute_sql({
    query: "SELECT 1 as health_check, NOW() as timestamp;"
  })

  // API Health
  results.api = await checkAPIHealth(environment)

  // Performance Health
  results.performance = await checkPerformanceHealth(environment)

  return results
}
```

## SECURITY CONSIDERATIONS

### Environment Isolation
- **Strict Separation**: No shared secrets between preview and production
- **Access Control**: Different authentication keys per environment
- **Network Security**: SSL/TLS enforced for all environments
- **Data Protection**: Sensitive data never committed to version control

### Secret Management
```bash
# Local development (git-ignored)
.env.local

# Preview environment (Vercel encrypted)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

# Production environment (Vercel encrypted)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

## CONFIGURATION COMMANDS

### Setup Commands
```bash
# Link to Vercel project
vercel link

# Configure environment variables
vercel env pull .env.local

# Set up preview environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

# Set up production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Initialize Supabase CLI
supabase init

# Link to Supabase project
supabase link --project-ref rlaunllhzkjxigxjgivv

# Start local Supabase
supabase start
```

### Deployment Commands
```bash
# Deploy to preview
/deploy preview

# Deploy to production
/deploy production

# Sync environments
/env sync preview
/env sync production

# Database operations
/db migrate --env=preview
/db seed --data=socal-locations --env=production
/db types
```

## NEXT STEPS FOR CONFIGURATION

1. **Run Vercel Setup**: `vercel link` to connect local environment
2. **Configure Supabase CLI**: Set up local development environment
3. **Set Environment Variables**: Configure preview and production environments
4. **Test Deployment Flow**: Verify preview deployment process
5. **Validate Rollback**: Test rollback procedures
6. **Document Access**: Ensure team has proper access and documentation

## VALIDATION CHECKLIST

- [ ] Vercel CLI linked to project
- [ ] Supabase CLI configured locally
- [ ] Environment variables configured for all environments
- [ ] Preview deployment tested and working
- [ ] Production deployment process validated
- [ ] Rollback procedures tested
- [ ] Monitoring and alerting configured
- [ ] Security measures validated
- [ ] Team access and documentation complete
- [ ] CI/CD pipeline integration tested
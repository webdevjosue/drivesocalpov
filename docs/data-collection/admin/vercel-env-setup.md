# Vercel Environment Variables Configuration

## Overview
Configuration guide for setting up secure environment variables in Vercel for the Drive SoCal POV project. This ensures secret keys are never committed to version control and are properly secured in production.

## Required Environment Variables

### Supabase Configuration (Critical)
```bash
# Database Connection
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional API Keys (for future enhancements)
```bash
# Additional APIs (optional for enhanced features)
GOOGLE_PLACES_API_KEY=your_google_places_key
YELP_API_KEY=your_yelp_api_key
OPENWEATHER_API_KEY=your_weather_key
```

### Development Configuration
```bash
# Environment Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://drivesocalpov.vercel.app
```

## Setup Instructions

### 1. Get Supabase Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configure Vercel Environment Variables

#### Method A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Optional: Add API keys
vercel env add GOOGLE_PLACES_API_KEY
vercel env add YELP_API_KEY
```

#### Method B: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `drive-socal-pov` project
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable with appropriate scope:
   - **Production** (for live deployment)
   - **Preview** (for preview deployments)
   - **Development** (for local development)

### 3. Local Development Setup

#### Create `.env.local` file
```bash
# Create local environment file
touch .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_local_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_key
```

#### Add to `.gitignore`
```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Security Best Practices

### ✅ Recommended Practices
- **Never commit** `.env.local` or `.env` files to version control
- **Use different keys** for development, staging, and production
- **Rotate keys regularly** (every 3-6 months)
- **Limit key permissions** to minimum required access
- **Monitor key usage** in Supabase dashboard
- **Use Vercel's encrypted storage** for production keys

### ❌ Security Risks to Avoid
- **Never hardcode** keys in source code
- **Don't share** environment variables publicly
- **Avoid using** the same keys across multiple environments
- **Never commit** `.env` files to Git
- **Don't log** sensitive information to console

## Environment Variable Validation

### Supabase Connection Test
```javascript
// Test Supabase connection in development
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('categories').select('count')
    if (error) throw error
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return false
  }
}
```

## Deployment Verification

### Pre-Deployment Checklist
- [ ] All required environment variables are set in Vercel
- [ ] Supabase connection works in development
- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded secrets in source code
- [ ] API keys have appropriate permissions

### Post-Deployment Verification
- [ ] Application loads successfully
- [ ] Database connection works
- [ ] Data can be retrieved from Supabase
- [ ] No console errors related to missing environment variables
- [ ] MapLibre GL integration works properly

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
```bash
# Check Vercel CLI is properly configured
vercel whoami

# Verify environment variables are set
vercel env ls

# Restart development server
npm run dev
```

#### 2. Supabase Connection Errors
- Verify Supabase project URL is correct
- Check API key permissions
- Ensure network connectivity
- Verify CORS settings in Supabase

#### 3. Build Deployment Issues
```bash
# Check build logs for missing variables
vercel logs --limit 50

# Redeploy with latest environment variables
vercel --prod
```

## Monitoring and Maintenance

### Key Rotation Schedule
- **Every 3 months**: Review and rotate API keys
- **Immediately**: If keys are compromised
- **Quarterly**: Audit environment variable usage

### Access Monitoring
- Monitor Vercel deployment logs
- Check Supabase API usage dashboard
- Set up alerts for unusual activity
- Review access logs regularly

## Support Resources

### Documentation Links
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api/auth/learn-api-keys)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### Emergency Contacts
- **Vercel Support**: support@vercel.com
- **Supabase Support**: support@supabase.io
- **Project Maintainer**: josue@drivesocalpov.com

---

## Quick Setup Script

```bash
#!/bin/bash
# Quick Vercel setup script

echo "🚀 Setting up Vercel environment variables for Drive SoCal POV..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Login to Vercel
echo "🔐 Logging into Vercel..."
vercel login

# Add Supabase variables
echo "📝 Adding Supabase environment variables..."
echo "Enter your Supabase Project URL:"
vercel env add NEXT_PUBLIC_SUPABASE_URL

echo "Enter your Supabase Anonymous Key:"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

echo "Enter your Supabase Service Role Key (admin access):"
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Create local .env.local file
echo "📁 Creating local .env.local file..."
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
EOF

echo "✅ Setup complete! Please edit .env.local with your actual Supabase credentials."
echo "🚀 You can now deploy to Vercel with 'vercel --prod'"
```

Save this script as `setup-vercel.sh` and run it to quickly configure your environment variables.
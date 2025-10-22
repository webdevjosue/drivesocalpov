# Production Deployment Configuration Guide

## Critical Environment Variables Setup

The application has been updated with new Supabase configuration. **You must configure these environment variables in Vercel Dashboard** for the production API to work.

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select the `drivesocalpov` project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

#### Required Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://pbbzeiuknpunaceybjpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiYnplaXVrbnB1bmFjZXlianB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NjMyOTAsImV4cCI6MjA3NjIzOTI5MH0.RmzP4tKB_pMc3tHNPBhyM455KcFux9TL26vJQnryGmM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiYnplaXVrbnB1bmFjZXlianB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDY2MzI5MCwiZXhwIjoyMDc2MjM5MjkwfQ.lPwfgrrNerH4K7PQViwEyBXhqyHojB_qSKy5VtgxpSs
SUPABASE_URL=https://pbbzeiuknpunaceybjpu.supabase.co
SUPABASE_JWT_SECRET=0/Kdb5i08pbdsu5k0s7xpok475Tuxbf7GJe9fhoSWvafWFQekX+XqKrS5y+RdKnPJ7joBaAZxT27dXjOKBuADw==
```

#### Application Configuration
```
NEXT_PUBLIC_SITE_URL=https://drivesocalpov.vercel.app
NEXT_PUBLIC_APP_NAME=Drive SoCal POV
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
NEXT_PUBLIC_DEV_MODE=false
```

### Step 2: Configure Vercel Authentication (if enabled)

If you have Vercel Authentication enabled, you need to either:

1. **Disable Vercel Authentication** for API routes (recommended for public APIs)
2. **Add authentication bypass** for `/api/*` routes

### Step 3: Deploy Application

1. Push changes to main branch for production deployment:
   ```bash
   git checkout main
   git merge preview
   git push origin main
   ```

2. Or deploy preview branch directly to production from Vercel Dashboard

### Step 4: Verify API Functionality

After deployment, test these endpoints:

- **Locations API**: `https://drivesocalpov.vercel.app/api/locations`
- **Categories API**: `https://drivesocalpov.vercel.app/api/categories`

Expected response should include 35 Southern California locations with proper coordinates.

## Database Status

### Current Configuration
- **Database**: Supabase (pbbzeiuknpunaceybjpu.supabase.co)
- **Locations**: 35 total with computed longitude/latitude columns
- **Schema**: Public access enabled for published locations
- **RLS Policy**: Anonymous users can access all published locations

### Data Summary
- San Diego County: Multiple locations with proper coordinates
- Los Angeles County: Tourist attractions and landmarks
- Inland Empire: Riverside and San Bernardino locations
- All locations have extracted coordinates for proper map display

## Troubleshooting

### Issue: API Returns 500 Error
**Cause**: Missing environment variables in production
**Solution**: Verify all Supabase variables are configured in Vercel Dashboard

### Issue: API Returns 403 Forbidden
**Cause**: Vercel Authentication blocking API access
**Solution**: Disable Vercel Authentication or add bypass for API routes

### Issue: Still Shows "Loading locations..."
**Cause**: Database connection or RLS policy issue
**Solution**: Check Supabase dashboard for RLS policies and API configuration

### Issue: Missing Coordinates
**Cause**: Database view or computed columns not working
**Solution**: Verify longitude/latitude columns exist in locations table

## Security Notes

✅ **Implemented Security Features:**
- Rate limiting (100 requests/minute per IP)
- Row Level Security (RLS) policies
- Secure API endpoints replacing direct database access
- Input validation and sanitization

⚠️ **Production Security Checklist:**
- [ ] Environment variables configured in Vercel Dashboard
- [ ] RLS policies verified in Supabase Dashboard
- [ ] API routes tested and functional
- [ ] Error monitoring configured
- [ ] SSL certificates active (automatic with Vercel)

## Development vs Production

### Development (Local)
- Uses `.env.local` file
- Direct database access available
- Debug mode enabled

### Production (Vercel)
- Uses Vercel Environment Variables
- API-only database access
- Production optimizations enabled

## Next Steps After Deployment

1. **Monitor API Performance**: Check Vercel logs for any errors
2. **Test Map Functionality**: Verify all 35 locations display correctly
3. **Performance Testing**: Use Chrome DevTools to verify loading times
4. **User Testing**: Test mobile interactions and map gestures

## Support

If you encounter issues:
1. Check Vercel Function Logs
2. Verify Supabase RLS policies
3. Test environment variables locally
4. Review API responses in browser DevTools

---

**Status**: Ready for production deployment once environment variables are configured.
**Last Updated**: 2025-10-22
**Version**: 1.0.0
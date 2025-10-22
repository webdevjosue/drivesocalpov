import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (using public schema)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting (simple in-memory for now)
const rateLimiter = new Map();
const RATE_LIMIT = 100; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];

  // Remove old requests outside the window
  const validRequests = requests.filter((time: number) => now - time < WINDOW_MS);

  if (validRequests.length >= RATE_LIMIT) {
    return false;
  }

  validRequests.push(now);
  rateLimiter.set(ip, validRequests);
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const isFree = searchParams.get('is_free');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100

    // Build secure query - use public schema with computed coordinate columns
    let query = supabase
      .from('locations')
      .select(`
        id,
        name,
        summary,
        city,
        region,
        is_free,
        rating,
        review_count,
        photos,
        tags,
        category_id,
        created_at,
        longitude,
        latitude
      `)
      .eq('is_published', true)
      .order('rating', { ascending: false })
      .limit(limit);

    // Apply filters
    if (region) {
      query = query.eq('region', region);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (isFree === 'true') {
      query = query.eq('is_free', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Return safe data
    return NextResponse.json({
      data: data || [],
      count: data?.length || 0,
      filters: { region, category, isFree }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Require authentication for POST operations
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // TODO: Implement proper authentication logic
  return NextResponse.json(
    { error: 'Not implemented' },
    { status: 501 }
  );
}
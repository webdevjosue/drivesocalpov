# Phase 5: Freemium Features & Gamification - Drive SoCal POV

## Phase Overview

Phase 5 focuses on implementing a comprehensive freemium model and gamification system that drives user engagement and monetization for the Drive SoCal POV travel guide app. This phase builds upon the solid foundation from Phases 1-4 to deliver a sustainable business model with engaging user experiences, social features, and premium content access.

**Estimated Duration:** 8-10 days
**Priority:** High - Business model foundation and user engagement system
**Dependencies:** Phase 1, Phase 2, Phase 3, and Phase 4 completion required

## Phase 5 Scope

### Core Deliverables
- **Freemium Model Implementation**: Tiered access system with free and premium features
- **Gamification System**: Points, badges, achievements, and progress tracking
- **User Engagement Features**: Streaks, challenges, leaderboards, and social sharing
- **Premium Feature Gates**: Seamless upgrade flow with compelling value propositions
- **Achievement System**: Location discovery and exploration rewards
- **Progress Tracking**: User statistics, travel history, and milestone celebrations
- **Social Features Integration**: Friend systems, sharing capabilities, and community engagement
- **Reward Mechanisms**: Unlockable content, exclusive features, and special privileges

### Technical Requirements
- **Revenue Generation**: Sustainable freemium model with compelling premium features
- **User Retention**: Gamification elements that encourage regular app usage
- **Social Integration**: Sharing and community features that drive organic growth
- **Mobile-Optimized**: Premium upgrade flow and gamification UI optimized for mobile
- **Scalable Architecture**: Support for future feature expansion and user growth
- **Analytics Integration**: Comprehensive tracking of user behavior and conversion metrics

## Business Model Architecture

### Freemium Tier Structure

#### Free Tier Features
- Basic map browsing with essential location information
- Public attractions and popular tourist spots
- Simple search with basic filtering
- Limited itinerary creation (3 itineraries max)
- Basic location favorites (50 locations max)
- Community achievements and public leaderboards
- Limited social features (view only)

#### Premium Tier Features ($4.99/month or $49.99/year)
- Detailed itineraries with AI-powered recommendations
- Hidden gems and exclusive local insights
- Advanced filtering and search capabilities
- Offline maps and downloadable content
- Unlimited itinerary creation and favorites
- Premium achievements and exclusive badges
- Advanced social features (private groups, enhanced sharing)
- Ad-free experience
- Priority customer support
- Early access to new features

### Gamification Strategy

#### Core Gamification Loops
1. **Discovery Loop**: Explore locations → Earn points → Unlock achievements → Get rewards
2. **Social Loop**: Share experiences → Get likes/comments → Earn social points → Unlock social features
3. **Retention Loop**: Daily check-ins → Maintain streaks → Earn streak bonuses → Stay engaged
4. **Conversion Loop**: Use premium features in trial → Experience value → Convert to paying user

#### Psychological Triggers
- **FOMO (Fear of Missing Out)**: Limited-time challenges and exclusive content
- **Social Proof**: Leaderboards, friend activity, and community achievements
- **Progress & Mastery**: Level progression, skill development, and completion rates
- **Anticipation**: Daily rewards, upcoming events, and feature teasers
- **Achievement**: Badges, milestones, and recognition systems

## Detailed Implementation Architecture

### 1. User Tier Management System (Priority: Critical)

#### 1.1 Subscription Management Schema
**File:** `migrations/007_create_subscriptions_table.sql`

```sql
-- Create subscriptions table for freemium model
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),

  -- Billing information
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly', 'lifetime')),
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',

  -- Dates
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancelled_at TIMESTAMPTZ,

  -- Payment processing
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,

  -- Usage tracking
  api_calls_used INTEGER DEFAULT 0,
  api_calls_limit INTEGER DEFAULT 100, -- Free tier limit

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription events table for audit trail
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'updated', 'cancelled', 'renewed', 'trial_started', 'trial_ended')),
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage subscriptions" ON subscriptions
  FOR ALL USING (
    auth.jwt()->>''role'' = 'service_role' OR
    auth.uid() = user_id
  );
```

#### 1.2 Subscription Service
**File:** `src/lib/subscription/subscription-service.ts`

```typescript
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database/types'
import { UserTier, SubscriptionPlan, SubscriptionStatus } from '@/lib/types/subscription'

export interface SubscriptionService {
  getCurrentTier(userId: string): Promise<UserTier>
  upgradeToPremium(userId: string, plan: SubscriptionPlan): Promise<void>
  downgradeToFree(userId: string): Promise<void>
  checkFeatureAccess(userId: string, feature: string): Promise<boolean>
  trackUsage(userId: string, usage: { type: string; amount: number }): Promise<void>
  getSubscriptionDetails(userId: string): Promise<SubscriptionDetails | null>
}

export interface SubscriptionDetails {
  tier: UserTier
  status: SubscriptionStatus
  planType: SubscriptionPlan
  currentPeriodStart: Date
  currentPeriodEnd: Date
  trialEndsAt?: Date
  apiCallsUsed: number
  apiCallsLimit: number
  features: string[]
}

export class SubscriptionServiceImpl implements SubscriptionService {
  private supabase = createClient()

  async getCurrentTier(userId: string): Promise<UserTier> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('tier, status, current_period_end, trial_ends_at')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return 'free'
    }

    // Check if subscription has expired
    const now = new Date()
    const endDate = new Date(data.current_period_end)
    const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null

    if (endDate < now || (trialEndsAt && trialEndsAt < now)) {
      await this.downgradeToFree(userId)
      return 'free'
    }

    return data.tier as UserTier
  }

  async upgradeToPremium(userId: string, plan: SubscriptionPlan): Promise<void> {
    const { data: userData, error: userError } = await this.supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const isUpgrade = userData.subscription_tier === 'free'
    const now = new Date()
    const endDate = this.calculateEndDate(now, plan)

    // Create or update subscription
    const { error } = await this.supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier: 'premium',
        status: 'active',
        plan_type: plan,
        price: plan === 'monthly' ? 4.99 : 49.99,
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        api_calls_limit: 10000, -- Premium limit
        updated_at: now.toISOString()
      })
      .eq('user_id', userId)

    if (error) throw error

    // Update user profile
    await this.supabase
      .from('profiles')
      .update({
        subscription_tier: 'premium',
        subscription_expires_at: endDate.toISOString()
      })
      .eq('id', userId)

    // Log subscription event
    await this.logSubscriptionEvent(userId, isUpgrade ? 'upgraded' : 'renewed', {
      plan,
      previousTier: userData.subscription_tier
    })

    // Send notification
    await this.sendSubscriptionNotification(userId, isUpgrade ? 'upgrade_success' : 'renewal_success')
  }

  async downgradeToFree(userId: string): Promise<void> {
    const now = new Date()

    // Update subscription
    await this.supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'active')

    // Update user profile
    await this.supabase
      .from('profiles')
      .update({
        subscription_tier: 'free',
        subscription_expires_at: null
      })
      .eq('id', userId)

    // Log subscription event
    await this.logSubscriptionEvent(userId, 'downgraded', {
      previousTier: 'premium'
    })
  }

  async checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
    const tier = await this.getCurrentTier(userId)

    const featureMatrix = {
      free: [
        'basic_map', 'public_locations', 'basic_search', 'limited_itineraries',
        'limited_favorites', 'community_achievements', 'basic_social'
      ],
      premium: [
        'detailed_itineraries', 'hidden_gems', 'advanced_search', 'unlimited_itineraries',
        'offline_maps', 'premium_achievements', 'advanced_social', 'ad_free',
        'priority_support', 'early_access'
      ]
    }

    return featureMatrix[tier as keyof typeof featureMatrix].includes(feature)
  }

  async trackUsage(userId: string, usage: { type: string; amount: number }): Promise<void> {
    const { data: subscription } = await this.supabase
      .from('subscriptions')
      .select('api_calls_used, api_calls_limit')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subscription && usage.type === 'api_call') {
      const newUsage = subscription.api_calls_used + usage.amount

      if (newUsage > subscription.api_calls_limit) {
        // User has exceeded their limit
        await this.handleUsageLimitExceeded(userId, newUsage, subscription.api_calls_limit)
      } else {
        // Update usage
        await this.supabase
          .from('subscriptions')
          .update({ api_calls_used: newUsage })
          .eq('user_id', userId)
      }
    }
  }

  async getSubscriptionDetails(userId: string): Promise<SubscriptionDetails | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return null
    }

    return {
      tier: data.tier as UserTier,
      status: data.status as SubscriptionStatus,
      planType: data.plan_type as SubscriptionPlan,
      currentPeriodStart: new Date(data.current_period_start),
      currentPeriodEnd: new Date(data.current_period_end),
      trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
      apiCallsUsed: data.api_calls_used,
      apiCallsLimit: data.api_calls_limit,
      features: this.getFeaturesForTier(data.tier as UserTier)
    }
  }

  private calculateEndDate(startDate: Date, plan: SubscriptionPlan): Date {
    const endDate = new Date(startDate)

    switch (plan) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1)
        break
      case 'lifetime':
        endDate.setFullYear(endDate.getFullYear() + 100)
        break
    }

    return endDate
  }

  private getFeaturesForTier(tier: UserTier): string[] {
    const features = {
      free: [
        'basic_map', 'public_locations', 'basic_search', 'limited_itineraries',
        'limited_favorites', 'community_achievements', 'basic_social'
      ],
      premium: [
        'detailed_itineraries', 'hidden_gems', 'advanced_search', 'unlimited_itineraries',
        'offline_maps', 'premium_achievements', 'advanced_social', 'ad_free',
        'priority_support', 'early_access', 'ai_recommendations', 'exclusive_content'
      ]
    }

    return features[tier] || []
  }

  private async logSubscriptionEvent(userId: string, eventType: string, eventData: any): Promise<void> {
    await this.supabase
      .from('subscription_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData
      })
  }

  private async sendSubscriptionNotification(userId: string, type: string): Promise<void> {
    // TODO: Implement notification system
    console.log(`Sending ${type} notification to user ${userId}`)
  }

  private async handleUsageLimitExceeded(userId: string, usage: number, limit: number): Promise<void> {
    // TODO: Implement usage limit handling
    console.log(`User ${userId} exceeded usage limit: ${usage}/${limit}`)
  }
}

export const subscriptionService = new SubscriptionServiceImpl()
```

#### 1.3 Feature Flag System
**File:** `src/lib/feature-flags/feature-flags.ts`

```typescript
import { subscriptionService } from '@/lib/subscription/subscription-service'
import { UserTier } from '@/lib/types/subscription'

export interface FeatureFlag {
  key: string
  description: string
  requiredTier: UserTier
  defaultValue: boolean
  metadata?: Record<string, any>
}

export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  // Map Features
  'map.offline_access': {
    key: 'map.offline_access',
    description: 'Access to offline maps and downloadable content',
    requiredTier: 'premium',
    defaultValue: false
  },
  'map.advanced_filtering': {
    key: 'map.advanced_filtering',
    description: 'Advanced filtering and search capabilities',
    requiredTier: 'premium',
    defaultValue: false
  },
  'map.hidden_gems': {
    key: 'map.hidden_gems',
    description: 'Access to hidden gems and exclusive locations',
    requiredTier: 'premium',
    defaultValue: false
  },

  // Itinerary Features
  'itinerary.unlimited': {
    key: 'itinerary.unlimited',
    description: 'Unlimited itinerary creation',
    requiredTier: 'premium',
    defaultValue: false
  },
  'itinerary.ai_recommendations': {
    key: 'itinerary.ai_recommendations',
    description: 'AI-powered itinerary recommendations',
    requiredTier: 'premium',
    defaultValue: false
  },
  'itinerary.detailed_planning': {
    key: 'itinerary.detailed_planning',
    description: 'Detailed itinerary planning with time optimization',
    requiredTier: 'premium',
    defaultValue: false
  },

  // Social Features
  'social.private_groups': {
    key: 'social.private_groups',
    description: 'Create and join private travel groups',
    requiredTier: 'premium',
    defaultValue: false
  },
  'social.enhanced_sharing': {
    key: 'social.enhanced_sharing',
    description: 'Enhanced sharing with custom branding',
    requiredTier: 'premium',
    defaultValue: false
  },
  'social.collaborative_planning': {
    key: 'social.collaborative_planning',
    description: 'Collaborative itinerary planning',
    requiredTier: 'premium',
    defaultValue: false
  },

  // Achievement Features
  'achievements.premium_badges': {
    key: 'achievements.premium_badges',
    description: 'Access to premium achievement badges',
    requiredTier: 'premium',
    defaultValue: false
  },
  'achievements.exclusive_rewards': {
    key: 'achievements.exclusive_rewards',
    description: 'Exclusive rewards and recognition',
    requiredTier: 'premium',
    defaultValue: false
  },

  // App Features
  'app.ad_free': {
    key: 'app.ad_free',
    description: 'Ad-free experience',
    requiredTier: 'premium',
    defaultValue: false
  },
  'app.priority_support': {
    key: 'app.priority_support',
    description: 'Priority customer support',
    requiredTier: 'premium',
    defaultValue: false
  },
  'app.early_access': {
    key: 'app.early_access',
    description: 'Early access to new features',
    requiredTier: 'premium',
    defaultValue: false
  }
}

export class FeatureFlagService {
  private userCache = new Map<string, Set<string>>()
  private cacheExpiry = new Map<string, number>()

  async isEnabled(userId: string, featureKey: string): Promise<boolean> {
    // Check cache first
    const cacheKey = `${userId}_${featureKey}`
    const cachedValue = this.getCachedValue(cacheKey)
    if (cachedValue !== null) {
      return cachedValue
    }

    const feature = FEATURE_FLAGS[featureKey]
    if (!feature) {
      console.warn(`Feature flag ${featureKey} not found`)
      return false
    }

    // Get user's current tier
    const userTier = await subscriptionService.getCurrentTier(userId)

    // Check if user has access based on tier
    const hasAccess = this.hasTierAccess(userTier, feature.requiredTier)

    // Cache the result
    this.setCachedValue(cacheKey, hasAccess, 5 * 60 * 1000) // 5 minutes

    return hasAccess
  }

  async getEnabledFeatures(userId: string): Promise<string[]> {
    const userTier = await subscriptionService.getCurrentTier(userId)
    const enabledFeatures: string[] = []

    for (const [key, feature] of Object.entries(FEATURE_FLAGS)) {
      if (this.hasTierAccess(userTier, feature.requiredTier)) {
        enabledFeatures.push(key)
      }
    }

    return enabledFeatures
  }

  async canAccessFeature(userId: string, featureKey: string): Promise<{
    allowed: boolean
    tier: UserTier
    requiredTier: UserTier
    feature: FeatureFlag
  }> {
    const feature = FEATURE_FLAGS[featureKey]
    if (!feature) {
      throw new Error(`Feature flag ${featureKey} not found`)
    }

    const userTier = await subscriptionService.getCurrentTier(userId)
    const allowed = this.hasTierAccess(userTier, feature.requiredTier)

    return {
      allowed,
      tier: userTier,
      requiredTier: feature.requiredTier,
      feature
    }
  }

  private hasTierAccess(userTier: UserTier, requiredTier: UserTier): boolean {
    const tierHierarchy = {
      free: 0,
      premium: 1
    }

    return tierHierarchy[userTier] >= tierHierarchy[requiredTier]
  }

  private getCachedValue(key: string): boolean | null {
    const cached = this.userCache.get(key)
    const expiry = this.cacheExpiry.get(key)

    if (cached !== undefined && expiry && Date.now() < expiry) {
      return cached
    }

    // Expired cache entry
    this.userCache.delete(key)
    this.cacheExpiry.delete(key)
    return null
  }

  private setCachedValue(key: string, value: boolean, ttlMs: number): void {
    this.userCache.set(key, value)
    this.cacheExpiry.set(key, Date.now() + ttlMs)
  }

  clearCache(userId?: string): void {
    if (userId) {
      // Clear cache for specific user
      for (const key of this.userCache.keys()) {
        if (key.startsWith(`${userId}_`)) {
          this.userCache.delete(key)
          this.cacheExpiry.delete(key)
        }
      }
    } else {
      // Clear all cache
      this.userCache.clear()
      this.cacheExpiry.clear()
    }
  }
}

export const featureFlagService = new FeatureFlagService()

// React hook for feature flags
export function useFeatureFlag(userId: string) {
  const [enabledFeatures, setEnabledFeatures] = React.useState<Set<string>>(new Set())
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadFeatures = async () => {
      try {
        const features = await featureFlagService.getEnabledFeatures(userId)
        setEnabledFeatures(new Set(features))
      } catch (error) {
        console.error('Failed to load feature flags:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeatures()
  }, [userId])

  const isEnabled = React.useCallback((featureKey: string) => {
    return enabledFeatures.has(featureKey)
  }, [enabledFeatures])

  return { isEnabled, loading }
}
```

### 2. Achievement System (Priority: High)

#### 2.1 Achievement Schema
**File:** `migrations/008_create_achievements_tables.sql`

```sql
-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('discovery', 'social', 'engagement', 'milestone', 'premium', 'seasonal')),
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  points INTEGER NOT NULL DEFAULT 0,

  -- Achievement criteria
  criteria JSONB NOT NULL DEFAULT '{}',
  requirements JSONB NOT NULL DEFAULT '{}',

  -- Rewards
  rewards JSONB DEFAULT '{}',
  unlocks TEXT[] DEFAULT '{}',

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  is_hidden BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user achievements table (tracks user progress)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,

  -- Progress tracking
  progress JSONB DEFAULT '{}',
  current_value INTEGER DEFAULT 0,
  target_value INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,

  -- Additional data
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

-- Create achievement progress events table (for audit trail)
CREATE TABLE achievement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('started', 'progressed', 'completed', 'rewarded')),
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_tier ON achievements(tier);
CREATE INDEX idx_achievements_is_active ON achievements(is_active);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_is_completed ON user_achievements(is_completed);
CREATE INDEX idx_achievement_events_user_id ON achievement_events(user_id);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own achievements" ON user_achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievement events" ON achievement_events
  FOR ALL USING (auth.uid() = user_id);

-- Insert base achievements
INSERT INTO achievements (name, slug, description, category, tier, points, criteria, requirements, rewards, icon) VALUES
-- Discovery Achievements
('First Discovery', 'first_discovery', 'Discover your first location', 'discovery', 'bronze', 10,
 '{"type": "location_discovery", "count": 1}', '{"total_discoveries": 1}',
 '{"points": 10, "next_achievement": "explorer"}', '🗺️'),

('Explorer', 'explorer', 'Discover 10 different locations', 'discovery', 'bronze', 50,
 '{"type": "location_discovery", "count": 10}', '{"total_discoveries": 10}',
 '{"points": 50, "badge": "explorer_badge"}', '🧭'),

('Adventurer', 'adventurer', 'Discover 50 different locations', 'discovery', 'silver', 200,
 '{"type": "location_discovery", "count": 50}', '{"total_discoveries": 50}',
 '{"points": 200, "badge": "adventurer_badge", "unlock": "advanced_search"}', '🗻'),

('Master Explorer', 'master_explorer', 'Discover all featured locations in Southern California', 'discovery', 'gold', 500,
 '{"type": "percentage_discovery", "percentage": 100}', '{"featured_discovered_percentage": 100}',
 '{"points": 500, "badge": "master_explorer_badge", "unlock": "hidden_gems"}', '🏆'),

-- Social Achievements
('Social Butterfly', 'social_butterfly', 'Share your first itinerary', 'social', 'bronze', 25,
 '{"type": "itinerary_share", "count": 1}', '{"total_shares": 1}',
 '{"points": 25, "social_points": 10}', '🦋'),

('Community Leader', 'community_leader', 'Get 50 likes on your shared content', 'social', 'silver', 150,
 '{"type": "social_engagement", "likes": 50}', '{"total_likes_received": 50}',
 '{"points": 150, "social_points": 50, "badge": "leader_badge"}', '👑'),

-- Engagement Achievements
('Daily Streak', 'daily_streak', 'Use the app 7 days in a row', 'engagement', 'bronze', 35,
 '{"type": "daily_streak", "days": 7}', '{"current_streak": 7}',
 '{"points": 35, "streak_bonus": true}', '🔥'),

('Weekend Warrior', 'weekend_warrior', 'Use the app every weekend for a month', 'engagement', 'silver', 100,
 '{"type": "weekend_streak", "weekends": 4}', '{"weekend_streak": 4}',
 '{"points": 100, "weekend_bonus": true}', '🌅'),

('Power User', 'power_user', 'Log in 30 days in a month', 'engagement', 'gold', 300,
 '{"type": "monthly_usage", "days": 30}', '{"monthly_login_days": 30}',
 '{"points": 300, "power_user_status": true}', '⚡'),

-- Location-specific Achievements
('Beach Lover', 'beach_lover', 'Visit 10 different beaches', 'discovery', 'silver', 75,
 '{"type": "category_discovery", "category": "beach", "count": 10}', '{"beaches_visited": 10}',
 '{"points": 75, "badge": "beach_badge"}', '🏖️'),

('Foodie', 'foodie', 'Visit 20 different restaurants', 'discovery', 'silver', 100,
 '{"type": "category_discovery", "category": "restaurant", "count": 20}', '{"restaurants_visited": 20}',
 '{"points": 100, "badge": "foodie_badge"}', '🍽️'),

('Culture Vulture', 'culture_vulture', 'Visit 15 different attractions', 'discovery', 'silver', 125,
 '{"type": "category_discovery", "category": "attraction", "count": 15}', '{"attractions_visited": 15}',
 '{"points": 125, "badge": "culture_badge"}', '🎭'),

-- Premium Achievements
('Premium Explorer', 'premium_explorer', 'Unlock 10 premium locations', 'premium', 'gold', 250,
 '{"type": "premium_discovery", "count": 10}', '{"premium_unlocked": 10}',
 '{"points": 250, "premium_badge": true}', '💎'),

('VIP Traveler', 'vip_traveler', 'Maintain premium subscription for 6 months', 'premium', 'platinum', 1000,
 '{"type": "subscription_duration", "months": 6}', '{"premium_months": 6}',
 '{"points": 1000, "vip_status": true, "lifetime_discount": true}', '👑');
```

#### 2.2 Achievement Service
**File:** `src/lib/achievements/achievement-service.ts`

```typescript
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database/types'

export interface Achievement {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  category: 'discovery' | 'social' | 'engagement' | 'milestone' | 'premium' | 'seasonal'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  points: number
  criteria: Record<string, any>
  requirements: Record<string, any>
  rewards: Record<string, any>
  unlocks: string[]
  isActive: boolean
  isHidden: boolean
  isPremium: boolean
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  progress: Record<string, any>
  currentValue: number
  targetValue: number
  isCompleted: boolean
  completedAt?: Date
  metadata: Record<string, any>
}

export interface AchievementProgress {
  achievement: Achievement
  userAchievement?: UserAchievement
  progressPercentage: number
  isCompleted: boolean
  isLocked: boolean
}

export class AchievementService {
  private supabase = createClient()

  async getAvailableAchievements(userId?: string): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAchievementProgress(userId: string): Promise<AchievementProgress[]> {
    const [achievements, userAchievements] = await Promise.all([
      this.getAvailableAchievements(),
      this.getUserAchievements(userId)
    ])

    const userAchievementMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua])
    )

    return achievements.map(achievement => {
      const userAchievement = userAchievementMap.get(achievement.id)
      const progressPercentage = userAchievement
        ? (userAchievement.currentValue / userAchievement.targetValue) * 100
        : 0

      return {
        achievement,
        userAchievement,
        progressPercentage,
        isCompleted: userAchievement?.isCompleted || false,
        isLocked: this.isAchievementLocked(achievement, userAchievements)
      }
    })
  }

  async updateProgress(
    userId: string,
    eventType: string,
    data: Record<string, any>
  ): Promise<UserAchievement[]> {
    const relevantAchievements = await this.getRelevantAchievements(eventType)
    const updatedAchievements: UserAchievement[] = []

    for (const achievement of relevantAchievements) {
      const progress = await this.calculateProgress(userId, achievement, data)

      if (progress.shouldUpdate) {
        const updated = await this.updateUserAchievement(userId, achievement.id, progress)
        if (updated) {
          updatedAchievements.push(updated)
        }
      }
    }

    return updatedAchievements
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress: {},
        current_value: 0,
        target_value: 1,
        is_completed: true,
        completed_at: new Date().toISOString(),
        metadata: { manually_unlocked: true }
      })
      .select()
      .single()

    if (error) throw error

    // Log achievement event
    await this.logAchievementEvent(userId, achievementId, 'completed', {
      manually_unlocked: true
    })

    // Award rewards
    await this.awardAchievementRewards(userId, achievementId)

    return data
  }

  async getTotalPoints(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .select(`
        achievements!inner(points)
      `)
      .eq('user_id', userId)
      .eq('is_completed', true)

    if (error) throw error

    return data?.reduce((total, row) => total + (row.achievements?.points || 0), 0) || 0
  }

  async getUserStats(userId: string): Promise<{
    totalAchievements: number
    completedAchievements: number
    totalPoints: number
    currentStreak: number
    categoryBreakdown: Record<string, number>
  }> {
    const [achievements, userAchievements] = await Promise.all([
      this.getAvailableAchievements(),
      this.getUserAchievements(userId)
    ])

    const completedCount = userAchievements.filter(ua => ua.isCompleted).length
    const totalPoints = await this.getTotalPoints(userId)

    const categoryBreakdown = achievements.reduce((acc, achievement) => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id)
      if (userAchievement?.isCompleted) {
        acc[achievement.category] = (acc[achievement.category] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return {
      totalAchievements: achievements.length,
      completedAchievements: completedCount,
      totalPoints,
      currentStreak: await this.calculateStreak(userId),
      categoryBreakdown
    }
  }

  private async getRelevantAchievements(eventType: string): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .like('criteria', `%"type": "${eventType}"%`)

    if (error) throw error
    return data || []
  }

  private async calculateProgress(
    userId: string,
    achievement: Achievement,
    eventData: Record<string, any>
  ): Promise<{
    shouldUpdate: boolean
    newValue: number
    isCompleted: boolean
  }> {
    const criteria = achievement.criteria
    const requirements = achievement.requirements

    let currentValue = 0
    let targetValue = 1
    let shouldUpdate = false

    switch (criteria.type) {
      case 'location_discovery':
        targetValue = criteria.count || 1
        currentValue = await this.getDiscoveredLocationsCount(userId)
        shouldUpdate = true
        break

      case 'category_discovery':
        targetValue = criteria.count || 1
        currentValue = await this.getCategoryDiscoveredCount(userId, criteria.category)
        shouldUpdate = true
        break

      case 'itinerary_share':
        targetValue = criteria.count || 1
        currentValue = await this.getSharedItinerariesCount(userId)
        shouldUpdate = true
        break

      case 'social_engagement':
        targetValue = criteria.likes || criteria.shares || 1
        currentValue = await this.getSocialEngagementCount(userId, criteria)
        shouldUpdate = true
        break

      case 'daily_streak':
        targetValue = criteria.days || 7
        currentValue = await this.getCurrentStreak(userId)
        shouldUpdate = true
        break

      case 'monthly_usage':
        targetValue = criteria.days || 30
        currentValue = await this.getMonthlyUsageCount(userId)
        shouldUpdate = true
        break

      case 'premium_discovery':
        targetValue = criteria.count || 1
        currentValue = await this.getPremiumUnlockedCount(userId)
        shouldUpdate = true
        break

      case 'subscription_duration':
        targetValue = criteria.months || 1
        currentValue = await this.getSubscriptionDuration(userId)
        shouldUpdate = true
        break
    }

    const isCompleted = currentValue >= targetValue

    return {
      shouldUpdate,
      newValue: currentValue,
      isCompleted
    }
  }

  private async updateUserAchievement(
    userId: string,
    achievementId: string,
    progress: { shouldUpdate: boolean; newValue: number; isCompleted: boolean }
  ): Promise<UserAchievement | null> {
    const { data, error } = await this.supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        current_value: progress.newValue,
        target_value: progress.shouldUpdate ? progress.newValue : undefined,
        is_completed: progress.isCompleted,
        completed_at: progress.isCompleted ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Log achievement event
    if (progress.isCompleted) {
      await this.logAchievementEvent(userId, achievementId, 'completed', {
        final_value: progress.newValue
      })

      // Award rewards
      await this.awardAchievementRewards(userId, achievementId)
    } else if (progress.shouldUpdate) {
      await this.logAchievementEvent(userId, achievementId, 'progressed', {
        new_value: progress.newValue
      })
    }

    return data
  }

  private async logAchievementEvent(
    userId: string,
    achievementId: string,
    eventType: string,
    eventData: Record<string, any>
  ): Promise<void> {
    await this.supabase
      .from('achievement_events')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        event_type: eventType,
        event_data: eventData
      })
  }

  private async awardAchievementRewards(userId: string, achievementId: string): Promise<void> {
    const { data: achievement } = await this.supabase
      .from('achievements')
      .select('rewards, points')
      .eq('id', achievementId)
      .single()

    if (!achievement) return

    const rewards = achievement.rewards as Record<string, any>

    // Award points
    if (rewards.points || achievement.points) {
      await this.awardPoints(userId, rewards.points || achievement.points)
    }

    // Award social points
    if (rewards.social_points) {
      await this.awardSocialPoints(userId, rewards.social_points)
    }

    // Unlock features
    if (rewards.unlock) {
      await this.unlockFeature(userId, rewards.unlock)
    }

    // Award badges
    if (rewards.badge) {
      await this.awardBadge(userId, rewards.badge)
    }

    // Send notification
    await this.sendAchievementNotification(userId, achievementId)
  }

  private async awardPoints(userId: string, points: number): Promise<void> {
    // Update user's total points
    await this.supabase
      .from('profiles')
      .update({
        total_points: this.supabase.rpc('increment', {
          current_points: 'total_points',
          increment: points
        })
      })
      .eq('id', userId)
  }

  private async awardSocialPoints(userId: string, socialPoints: number): Promise<void> {
    // Update user's social points
    await this.supabase
      .from('profiles')
      .update({
        social_points: this.supabase.rpc('increment', {
          current_points: 'social_points',
          increment: socialPoints
        })
      })
      .eq('id', userId)
  }

  private async unlockFeature(userId: string, feature: string): Promise<void> {
    // Add feature to user's unlocked features
    await this.supabase
      .from('profiles')
      .update({
        unlocked_features: this.supabase.rpc('array_append', {
          current_array: 'unlocked_features',
          element_to_append: feature
        })
      })
      .eq('id', userId)
  }

  private async awardBadge(userId: string, badge: string): Promise<void> {
    // Add badge to user's earned badges
    await this.supabase
      .from('profiles')
      .update({
        earned_badges: this.supabase.rpc('array_append', {
          current_array: 'earned_badges',
          element_to_append: badge
        })
      })
      .eq('id', userId)
  }

  private async sendAchievementNotification(userId: string, achievementId: string): Promise<void> {
    // TODO: Implement notification system
    console.log(`Achievement ${achievementId} unlocked for user ${userId}`)
  }

  private isAchievementLocked(
    achievement: Achievement,
    userAchievements: UserAchievement[]
  ): boolean {
    if (achievement.isHidden) return true
    if (achievement.isPremium && !userAchievements.some(ua => ua.isCompleted)) {
      return true
    }
    return false
  }

  private async getDiscoveredLocationsCount(userId: string): Promise<number> {
    const { count } = await this.supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('visited', true)

    return count || 0
  }

  private async getCategoryDiscoveredCount(userId: string, category: string): Promise<number> {
    const { count } = await this.supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('visited', true)
      .in('location->>category', [category])

    return count || 0
  }

  private async getSharedItinerariesCount(userId: string): Promise<number> {
    const { count } = await this.supabase
      .from('itineraries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_public', true)

    return count || 0
  }

  private async getSocialEngagementCount(userId: string, criteria: any): Promise<number> {
    // TODO: Implement social engagement counting
    return 0
  }

  private async getCurrentStreak(userId: string): Promise<number> {
    // TODO: Implement streak calculation
    return 1
  }

  private async getMonthlyUsageCount(userId: string): Promise<number> {
    // TODO: Implement monthly usage counting
    return 1
  }

  private async getPremiumUnlockedCount(userId: string): Promise<number> {
    // TODO: Implement premium unlocked counting
    return 0
  }

  private async getSubscriptionDuration(userId: string): Promise<number> {
    // TODO: Implement subscription duration calculation
    return 0
  }

  private async calculateStreak(userId: string): Promise<number> {
    // TODO: Implement streak calculation
    return 1
  }
}

export const achievementService = new AchievementService()
```

### 3. Gamification UI Components (Priority: High)

#### 3.1 Achievement Display Component
**File:** `src/components/gamification/AchievementDisplay.tsx`

```typescript
'use client'

import React, { useState, useEffect } from 'react'
import { AchievementService, AchievementProgress } from '@/lib/achievements/achievement-service'
import { useFeatureFlag } from '@/lib/feature-flags/feature-flags'
import { cn } from '@/lib/utils'
import { TrophyIcon, StarIcon, LockIcon, CheckCircleIcon } from 'lucide-react'

interface AchievementDisplayProps {
  userId: string
  className?: string
  showLocked?: boolean
  maxDisplay?: number
}

export function AchievementDisplay({
  userId,
  className = '',
  showLocked = false,
  maxDisplay = 6
}: AchievementDisplayProps) {
  const [achievements, setAchievements] = useState<AchievementProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { isEnabled: canViewAchievements } = useFeatureFlag(userId)

  useEffect(() => {
    const loadAchievements = async () => {
      if (!canViewAchievements('achievements.view')) {
        setLoading(false)
        return
      }

      try {
        const progress = await achievementService.getAchievementProgress(userId)
        setAchievements(progress)
      } catch (error) {
        console.error('Failed to load achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAchievements()
  }, [userId, canViewAchievements])

  const filteredAchievements = React.useMemo(() => {
    let filtered = achievements

    if (selectedCategory) {
      filtered = filtered.filter(a => a.achievement.category === selectedCategory)
    }

    if (!showLocked) {
      filtered = filtered.filter(a => !a.isLocked)
    }

    return filtered.slice(0, maxDisplay)
  }, [achievements, selectedCategory, showLocked, maxDisplay])

  const categories = React.useMemo(() => {
    const cats = new Set(achievements.map(a => a.achievement.category))
    return Array.from(cats)
  }, [achievements])

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'text-amber-600 bg-amber-50',
      silver: 'text-gray-600 bg-gray-50',
      gold: 'text-yellow-600 bg-yellow-50',
      platinum: 'text-purple-600 bg-purple-50',
      diamond: 'text-blue-600 bg-blue-50'
    }
    return colors[tier as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉'
      case 'silver': return '🥈'
      case 'gold': return '🥇'
      case 'platinum': return '💎'
      case 'diamond': return '💠'
      default: return '🏆'
    }
  }

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!canViewAchievements('achievements.view')) {
    return (
      <div className={cn('text-center py-8', className)}>
        <LockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Premium Feature
        </h3>
        <p className="text-gray-600 mb-4">
          Unlock achievements and rewards with a premium subscription
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Achievements
        </h2>
        <p className="text-gray-600">
          Complete challenges and unlock rewards
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors',
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievementProgress) => (
          <div
            key={achievementProgress.achievement.id}
            className={cn(
              'relative p-4 rounded-lg border-2 transition-all duration-200',
              achievementProgress.isCompleted
                ? 'border-green-500 bg-green-50'
                : achievementProgress.isLocked
                ? 'border-gray-300 bg-gray-50 opacity-75'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
            )}
          >
            {/* Completion Badge */}
            {achievementProgress.isCompleted && (
              <div className="absolute top-2 right-2">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            )}

            {/* Lock Icon */}
            {achievementProgress.isLocked && (
              <div className="absolute top-2 right-2">
                <LockIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}

            {/* Achievement Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="text-4xl mb-2">
                {achievementProgress.achievement.icon || getTierIcon(achievementProgress.achievement.tier)}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-1">
                {achievementProgress.achievement.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {achievementProgress.achievement.description}
              </p>

              {/* Tier Badge */}
              <div className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3',
                getTierColor(achievementProgress.achievement.tier)
              )}>
                <span className="mr-1">{getTierIcon(achievementProgress.achievement.tier)}</span>
                {achievementProgress.achievement.tier.charAt(0).toUpperCase() + achievementProgress.achievement.tier.slice(1)}
              </div>

              {/* Progress Bar */}
              {!achievementProgress.isCompleted && !achievementProgress.isLocked && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{Math.round(achievementProgress.progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${achievementProgress.progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Points */}
              <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
                <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{achievementProgress.achievement.points} points</span>
              </div>

              {/* Rewards */}
              {achievementProgress.isCompleted && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-green-600 font-medium">
                    Rewards Unlocked!
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {achievements.length > maxDisplay && (
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All Achievements
          </button>
        </div>
      )}
    </div>
  )
}
```

#### 3.2 Points & Progress Tracker
**File:** `src/components/gamification/ProgressTracker.tsx`

```typescript
'use client'

import React, { useState, useEffect } from 'react'
import { achievementService } from '@/lib/achievements/achievement-service'
import { cn } from '@/lib/utils'
import { TrophyIcon, TrendingUpIcon, CalendarIcon, StarIcon } from 'lucide-react'

interface ProgressTrackerProps {
  userId: string
  className?: string
  compact?: boolean
}

interface UserStats {
  totalAchievements: number
  completedAchievements: number
  totalPoints: number
  currentStreak: number
  categoryBreakdown: Record<string, number>
}

export function ProgressTracker({
  userId,
  className = '',
  compact = false
}: ProgressTrackerProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const userStats = await achievementService.getUserStats(userId)
        setStats(userStats)
      } catch (error) {
        console.error('Failed to load user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [userId])

  const completionPercentage = stats
    ? Math.round((stats.completedAchievements / stats.totalAchievements) * 100)
    : 0

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-green-600'
    if (streak >= 14) return 'text-blue-600'
    if (streak >= 7) return 'text-purple-600'
    return 'text-gray-600'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Amazing streak! You\'re a power user!'
    if (streak >= 14) return 'Great consistency! Keep it up!'
    if (streak >= 7) return 'Nice streak! Building momentum!'
    if (streak >= 3) return 'Good start! Keep coming back!'
    return 'Start your streak by using the app daily!'
  }

  if (loading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  if (compact) {
    return (
      <div className={cn('flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm', className)}>
        <div className="flex items-center">
          <TrophyIcon className="w-5 h-5 text-yellow-500 mr-2" />
          <div>
            <p className="text-xs text-gray-600">Points</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-xs text-gray-600">Streak</p>
            <p className={cn('text-lg font-bold', getStreakColor(stats.currentStreak))}>
              {stats.currentStreak} days
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6 space-y-6', className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Progress
        </h2>
        <p className="text-gray-600">
          Track your achievements and rewards
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Points */}
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-yellow-200 rounded-full">
              <StarIcon className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Points</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalPoints.toLocaleString()}
          </p>
        </div>

        {/* Achievements */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-blue-200 rounded-full">
              <TrophyIcon className="w-6 h-6 text-blue-700" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Achievements</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.completedAchievements}/{stats.totalAchievements}
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{completionPercentage}% Complete</p>
          </div>
        </div>

        {/* Streak */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-purple-200 rounded-full">
              <TrendingUpIcon className="w-6 h-6 text-purple-700" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Current Streak</p>
          <p className={cn('text-2xl font-bold', getStreakColor(stats.currentStreak))}>
            {stats.currentStreak}
          </p>
          <p className="text-xs text-gray-500 mt-1">days</p>
        </div>
      </div>

      {/* Streak Message */}
      <div className={cn('text-center p-3 rounded-lg',
        stats.currentStreak >= 7 ? 'bg-green-50' : 'bg-blue-50'
      )}>
        <p className={cn('text-sm font-medium',
          stats.currentStreak >= 7 ? 'text-green-700' : 'text-blue-700'
        )}>
          {getStreakMessage(stats.currentStreak)}
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Achievement Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium capitalize text-gray-700">
                {category}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestone */}
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Next Milestone
        </h3>
        <p className="text-gray-600 mb-2">
          {stats.completedAchievements < stats.totalAchievements
            ? `Complete ${stats.totalAchievements - stats.completedAchievements} more achievements to master the app!`
            : 'Congratulations! You\'ve completed all achievements!'
          }
        </p>
        {stats.completedAchievements < stats.totalAchievements && (
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
```

### 4. Premium Upgrade Flow (Priority: High)

#### 4.1 Upgrade Modal Component
**File:** `src/components/premium/UpgradeModal.tsx`

```typescript
'use client'

import React, { useState } from 'react'
import { XIcon, CheckIcon, StarIcon, CrownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (plan: 'monthly' | 'yearly') => void
  currentPlan?: 'free' | 'premium'
  trialDays?: number
}

export function UpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  currentPlan = 'free',
  trialDays = 7
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')

  if (!isOpen) return null

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 4.99,
      period: 'month',
      description: 'Perfect for trying out premium features',
      features: [
        'All free features',
        'Detailed itineraries',
        'Hidden gems & exclusive content',
        'Offline maps',
        'Advanced search & filtering',
        'Unlimited favorites & itineraries',
        'Ad-free experience',
        'Priority support'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 49.99,
      period: 'year',
      description: 'Best value - Save 17% with annual billing',
      features: [
        'All monthly features',
        'Early access to new features',
        'Exclusive premium badges',
        'Advanced social features',
        'AI-powered recommendations',
        'Lifetime discount on future features'
      ],
      popular: true,
      savings: 'Save $9.89 per year'
    }
  ]

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    onUpgrade(plan)
    onClose()
  }

  const features = [
    { name: 'Detailed Itineraries', description: 'AI-powered trip planning with optimized routes' },
    { name: 'Hidden Gems', description: 'Exclusive local spots and insider recommendations' },
    { name: 'Offline Maps', description: 'Download maps for offline use during travel' },
    { name: 'Advanced Search', description: 'Filter by price, rating, distance, and more' },
    { name: 'Unlimited Creation', description: 'Create unlimited itineraries and favorites' },
    { name: 'Ad-Free Experience', description: 'Enjoy the app without advertisements' },
    { name: 'Priority Support', description: 'Get help when you need it most' },
    { name: 'Early Access', description: 'Be the first to try new features' },
    { name: 'Premium Achievements', description: 'Unlock exclusive badges and rewards' },
    { name: 'Social Features', description: 'Advanced sharing and collaboration tools' }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-500" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <CrownIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upgrade to Premium
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Unlock the full Southern California travel experience
            </p>

            {/* Trial Offer */}
            {currentPlan === 'free' && trialDays > 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full mb-6">
                <StarIcon className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  Try free for {trialDays} days, cancel anytime
                </span>
              </div>
            )}
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'relative p-6 rounded-2xl border-2 transition-all duration-200',
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /{plan.period}
                    </span>
                  </div>
                  {plan.savings && (
                    <p className="text-green-600 font-medium mt-1">
                      {plan.savings}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.id as 'monthly' | 'yearly')}
                  className={cn(
                    'w-full mt-6 py-3 px-6 rounded-lg font-medium transition-colors',
                    selectedPlan === plan.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {currentPlan === 'free' ? 'Start Free Trial' : 'Switch Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Everything in Premium
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {feature.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                </div>
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <StarIcon className="w-4 h-4 text-blue-600" />
                </div>
                <span>4.9/5 user rating</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                  <CrownIcon className="w-4 h-4 text-purple-600" />
                </div>
                <span>500+ happy travelers</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              By upgrading, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 5. Social Features Integration (Priority: Medium)

#### 5.1 Social Sharing Component
**File:** `src/components/social/SocialSharing.tsx`

```typescript
'use client'

import React, { useState } from 'react'
import {
  ShareIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkIcon,
  DownloadIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialSharingProps {
  title: string
  description: string
  url?: string
  image?: string
  locationName?: string
  className?: string
  onShare?: (platform: string) => void
}

export function SocialSharing({
  title,
  description,
  url,
  image,
  locationName,
  className = '',
  onShare
}: SocialSharingProps) {
  const [copied, setCopied] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const fullTitle = locationName ? `${title} - ${locationName}` : title

  const shareOptions = [
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullTitle)}`,
      action: 'facebook'
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${fullTitle} ${description}`)}&url=${encodeURIComponent(shareUrl)}`,
      action: 'twitter'
    },
    {
      name: 'Copy Link',
      icon: LinkIcon,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: 'copy'
    }
  ]

  const handleShare = (platform: string, shareUrl?: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl || url)
      setCopied(true)
      setShowSuccess(true)
      setTimeout(() => {
        setCopied(false)
        setShowSuccess(false)
      }, 3000)
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }

    onShare?.(platform)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fullTitle,
          text: description,
          url: shareUrl
        })
        onShare?.('native')
      } catch (error) {
        console.error('Native sharing failed:', error)
      }
    }
  }

  const handleDownloadImage = async () => {
    if (image) {
      try {
        const response = await fetch(image)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${title.replace(/\s+/g, '_')}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        onShare?.('download')
      } catch (error) {
        console.error('Download failed:', error)
      }
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Native Share Button */}
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          Share
        </button>
      )}

      {/* Desktop Share Options */}
      <div className="grid grid-cols-3 gap-3">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => handleShare(option.action, option.url)}
            className={cn(
              'flex flex-col items-center justify-center p-3 rounded-lg transition-colors',
              option.color,
              'text-white hover:shadow-lg transform hover:scale-105'
            )}
          >
            <option.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">
              {option.name}
            </span>
          </button>
        ))}
      </div>

      {/* Additional Options */}
      <div className="flex gap-3">
        {image && (
          <button
            onClick={handleDownloadImage}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download Image
          </button>
        )}
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="text-center p-3 bg-green-100 text-green-800 rounded-lg">
          <p className="text-sm font-medium">
            {copied ? 'Link copied to clipboard!' : 'Shared successfully!'}
          </p>
        </div>
      )}

      {/* Share Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-2">Share Preview</h4>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-900">{fullTitle}</p>
          <p className="text-gray-600">{description}</p>
          <p className="text-blue-600 break-all">{shareUrl}</p>
        </div>
      </div>
    </div>
  )
}
```

### 6. Analytics & Tracking (Priority: Medium)

#### 6.1 Gamification Analytics
**File:** `src/lib/analytics/gamification-analytics.ts`

```typescript
interface GamificationEvent {
  eventType: 'achievement_unlocked' | 'streak_milestone' | 'premium_upgrade' | 'feature_used' | 'social_share'
  userId: string
  data: Record<string, any>
  timestamp: Date
  metadata?: Record<string, any>
}

export interface GamificationMetrics {
  achievementUnlockRate: number
  averageStreakLength: number
  premiumConversionRate: number
  socialShareRate: number
  userEngagementScore: number
  retentionRate: number
}

export class GamificationAnalytics {
  private events: GamificationEvent[] = []
  private batchSize = 50

  trackEvent(event: Omit<GamificationEvent, 'timestamp'>): void {
    const fullEvent: GamificationEvent = {
      ...event,
      timestamp: new Date()
    }

    this.events.push(fullEvent)

    // Process in batches
    if (this.events.length >= this.batchSize) {
      this.processBatch()
    }
  }

  trackAchievementUnlock(userId: string, achievementId: string, points: number): void {
    this.trackEvent({
      eventType: 'achievement_unlocked',
      userId,
      data: {
        achievementId,
        points,
        category: 'engagement'
      }
    })
  }

  trackStreakMilestone(userId: string, streakLength: number, milestone: string): void {
    this.trackEvent({
      eventType: 'streak_milestone',
      userId,
      data: {
        streakLength,
        milestone,
        category: 'retention'
      }
    })
  }

  trackPremiumUpgrade(userId: string, plan: string, price: number): void {
    this.trackEvent({
      eventType: 'premium_upgrade',
      userId,
      data: {
        plan,
        price,
        category: 'conversion'
      }
    })
  }

  trackFeatureUse(userId: string, feature: string, context?: Record<string, any>): void {
    this.trackEvent({
      eventType: 'feature_used',
      userId,
      data: {
        feature,
        context,
        category: 'feature_adoption'
      }
    })
  }

  trackSocialShare(userId: string, platform: string, contentType: string): void {
    this.trackEvent({
      eventType: 'social_share',
      userId,
      data: {
        platform,
        contentType,
        category: 'social'
      }
    })
  }

  async calculateMetrics(): Promise<GamificationMetrics> {
    const processedEvents = await this.getProcessedEvents()

    const totalUsers = new Set(processedEvents.map(e => e.userId)).size
    const usersWithAchievements = new Set(
      processedEvents
        .filter(e => e.eventType === 'achievement_unlocked')
        .map(e => e.userId)
    ).size

    const usersWithPremium = new Set(
      processedEvents
        .filter(e => e.eventType === 'premium_upgrade')
        .map(e => e.userId)
    ).size

    const usersWithShares = new Set(
      processedEvents
        .filter(e => e.eventType === 'social_share')
        .map(e => e.userId)
    ).size

    const streakEvents = processedEvents.filter(e => e.eventType === 'streak_milestone')
    const averageStreakLength = streakEvents.length > 0
      ? streakEvents.reduce((sum, e) => sum + e.data.streakLength, 0) / streakEvents.length
      : 0

    // Calculate engagement score (0-100)
    const engagementScore = this.calculateEngagementScore(processedEvents, totalUsers)

    // Calculate retention rate (30-day retention)
    const retentionRate = this.calculateRetentionRate(processedEvents)

    return {
      achievementUnlockRate: totalUsers > 0 ? (usersWithAchievements / totalUsers) * 100 : 0,
      averageStreakLength,
      premiumConversionRate: totalUsers > 0 ? (usersWithPremium / totalUsers) * 100 : 0,
      socialShareRate: totalUsers > 0 ? (usersWithShares / totalUsers) * 100 : 0,
      userEngagementScore: engagementScore,
      retentionRate
    }
  }

  private async getProcessedEvents(): Promise<GamificationEvent[]> {
    // In a real implementation, this would fetch from your analytics database
    return this.events
  }

  private calculateEngagementScore(events: GamificationEvent[], totalUsers: number): number {
    if (totalUsers === 0) return 0

    const userScores = new Map<string, number>()

    events.forEach(event => {
      const currentScore = userScores.get(event.userId) || 0

      switch (event.eventType) {
        case 'achievement_unlocked':
          userScores.set(event.userId, currentScore + 10)
          break
        case 'streak_milestone':
          userScores.set(event.userId, currentScore + 5)
          break
        case 'feature_used':
          userScores.set(event.userId, currentScore + 1)
          break
        case 'social_share':
          userScores.set(event.userId, currentScore + 3)
          break
        case 'premium_upgrade':
          userScores.set(event.userId, currentScore + 20)
          break
      }
    })

    const totalScore = Array.from(userScores.values()).reduce((sum, score) => sum + score, 0)
    return Math.min(100, (totalScore / totalUsers) * 10) // Scale to 0-100
  }

  private calculateRetentionRate(events: GamificationEvent[]): number {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentEvents = events.filter(e => e.timestamp > thirtyDaysAgo)

    const activeUsers = new Set(recentEvents.map(e => e.userId)).size

    // Calculate retention based on returning users
    const returningUsers = new Set()
    const dailyActiveUsers = new Map<string, Set<string>>()

    recentEvents.forEach(event => {
      const dateKey = event.timestamp.toISOString().split('T')[0]
      if (!dailyActiveUsers.has(dateKey)) {
        dailyActiveUsers.set(dateKey, new Set())
      }
      dailyActiveUsers.get(dateKey)!.add(event.userId)
    })

    dailyActiveUsers.forEach((users, date) => {
      users.forEach(userId => {
        if (userId !== 'new_user') {
          returningUsers.add(userId)
        }
      })
    })

    return recentEvents.length > 0 ? (returningUsers.size / activeUsers) * 100 : 0
  }

  private async processBatch(): Promise<void> {
    if (this.events.length === 0) return

    try {
      // In a real implementation, send to analytics service
      console.log(`Processing batch of ${this.events.length} gamification events`)

      // Clear processed events
      this.events = []
    } catch (error) {
      console.error('Failed to process analytics batch:', error)
    }
  }

  // Process any remaining events before page unload
  async flush(): Promise<void> {
    if (this.events.length > 0) {
      await this.processBatch()
    }
  }
}

export const gamificationAnalytics = new GamificationAnalytics()

// Set up page unload handler
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    gamificationAnalytics.flush()
  })
}
```

## Success Criteria

### Functional Requirements
- [ ] Freemium model successfully implemented with proper tier management
- [ ] Premium upgrade flow works seamlessly with payment integration
- [ ] Achievement system tracks progress and awards rewards correctly
- [ ] Gamification elements drive user engagement and retention
- [ ] Social features integrate properly with sharing capabilities
- [ ] Feature flags control access to premium content
- [ ] Analytics track user behavior and conversion metrics
- [ ] Progress tracking displays accurate user statistics

### Business Requirements
- [ ] Clear value proposition for premium upgrade
- [ ] Smooth free-to-premium conversion flow
- [ ] Engaging gamification that doesn't feel forced
- [ ] Social features drive organic growth
- [ ] Premium features justify subscription cost
- [ ] Achievement system encourages regular app usage
- [ ] Analytics provide actionable insights for optimization

### Technical Requirements
- [ ] Scalable architecture supports user growth
- [ ] Performance optimized for mobile devices
- [ ] Real-time progress tracking without delays
- [ ] Secure payment processing integration
- [ ] Robust analytics tracking and reporting
- [ ] Type-safe implementation throughout

### User Experience Requirements
- [ ] Premium upgrade prompts feel helpful, not intrusive
- [ ] Achievement celebrations feel rewarding and meaningful
- [ ] Progress tracking motivates continued engagement
- [ ] Social sharing is easy and intuitive
- [ ] Feature limitations are clear and justified
- [ ] Gamification enhances rather than detracts from core functionality

## Risk Mitigation

### Business Risks
1. **Premium Conversion Rate**: Mitigate with compelling value proposition and clear upgrade benefits
2. **User Retention**: Use gamification and social features to maintain engagement
3. **Feature Fatigue**: Balance gamification with core functionality to avoid overwhelming users
4. **Revenue Predictability**: Diversify premium features and pricing strategies

### Technical Risks
1. **Performance Impact**: Optimize gamification tracking to avoid app slowdowns
2. **Data Privacy**: Ensure compliance with privacy regulations for user data
3. **Scalability**: Design systems that can handle growing user bases
4. **Integration Complexity**: Maintain clean separation between gamification and core features

### User Experience Risks
1. **Gamification Burnout**: Design sustainable progression systems
2. **Premium Friction**: Make upgrade flow smooth and value-driven
3. **Social Pressure**: Encourage but don't force social features
4. **Notification Fatigue**: Balance helpful notifications with user control

## Documentation Requirements

### Technical Documentation
- [x] Phase 5 Implementation Plan (this document)
- [ ] Freemium Model Architecture Documentation
- [ ] Achievement System API Reference
- [ ] Gamification Analytics Guide
- [ ] Premium Upgrade Flow Documentation
- [ ] Feature Flag System Guide

### User Documentation
- [ ] Premium Features Guide
- [ ] Achievement System Tutorial
- [ ] Social Features How-To
- [ ] FAQ for Premium Subscriptions
- [ ] Progress Tracking Guide

## Conclusion

Phase 5 delivers a comprehensive freemium model and gamification system that creates sustainable revenue while driving user engagement. The achievement system, premium features, and social integration work together to create a compelling user experience that encourages both retention and conversion.

**Key Achievements:**
- Complete freemium model with clear value proposition
- Engaging achievement system with meaningful rewards
- Seamless premium upgrade flow with proper feature gating
- Comprehensive gamification that drives user engagement
- Social features that enable organic growth
- Analytics system that provides actionable insights
- Mobile-optimized implementation throughout

The successful completion of Phase 5 establishes Drive SoCal POV as a sustainable business with a solid foundation for long-term growth and user engagement. The freemium model provides revenue while the gamification system ensures users remain engaged and motivated to explore all that Southern California has to offer.

**Next Steps:**
- Monitor user behavior and conversion metrics
- Optimize premium upgrade flow based on user feedback
- Expand achievement categories based on user engagement
- Implement additional premium features based on demand
- Scale infrastructure to support user growth
- Explore additional monetization opportunities
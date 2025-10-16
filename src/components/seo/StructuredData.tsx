/**
 * Structured Data Component for SEO
 * Provides Schema.org markup for search engines
 */

'use client'

import React from 'react'

interface StructuredDataProps {
  type: string
  data: Record<string, any>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

// Specific structured data components for different types

export function TravelActionStructuredData() {
  const data = {
    name: 'Explore Southern California',
    description: 'Discover the best attractions, restaurants, and events in Southern California with our interactive travel guide',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://drivesocalpov.com/search?q={search_term_string}',
      inLanguage: 'en-US',
      actionPlatform: [
        'https://schema.org/DesktopWebPlatform',
        'https://schema.org/MobileWebPlatform',
      ],
    },
    object: {
      '@type': 'Place',
      name: 'Southern California',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US',
        addressRegion: 'CA',
      },
    },
  }

  return <StructuredData type="SearchAction" data={data} />
}

export function WebSiteStructuredData() {
  const data = {
    name: 'Drive SoCal POV',
    alternateName: 'SoCal POV',
    description: 'Your ultimate mobile travel guide to Southern California with GTA V-inspired maps and gamified exploration',
    url: 'https://drivesocalpov.com',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    genre: ['Travel', 'Tourism', 'Mobile App'],
    audience: {
      '@type': 'Audience',
      audienceType: 'Travelers, Tourists, Southern California Visitors',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Drive SoCal POV',
      url: 'https://drivesocalpov.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://drivesocalpov.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return <StructuredData type="WebSite" data={data} />
}

export function MobileApplicationStructuredData() {
  const data = {
    name: 'Drive SoCal POV',
    description: 'Mobile-first travel guide for Southern California with interactive maps and gamified exploration',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'iOS, Android, Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Interactive Maps',
      'Location Discovery',
      'Mobile-First Design',
      'Southern California Focus',
      'Gamified Exploration',
      'Free to Use',
    ],
  }

  return <StructuredData type="MobileApplication" data={data} />
}

export function BreadcrumbStructuredData({ items }: {
  items: Array<{ name: string; url: string }>
}) {
  const data = {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <StructuredData type="BreadcrumbList" data={data} />
}

export function FAQStructuredData({ faqs }: {
  faqs: Array<{ question: string; answer: string }>
}) {
  const data = {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return <StructuredData type="FAQPage" data={data} />
}
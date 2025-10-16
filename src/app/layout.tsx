import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Drive SoCal POV - Southern California Travel Guide",
    template: "%s | Drive SoCal POV",
  },
  description: "Explore Southern California with our free mobile travel guide. Discover attractions, restaurants, and events in LA, San Diego, Orange County, and Inland Empire with interactive maps.",
  keywords: [
    "Southern California travel guide",
    "Los Angeles attractions",
    "San Diego tourism",
    "Orange County restaurants",
    "Inland Empire events",
    "mobile travel app",
    "free travel guide",
    "SoCal destinations",
    "California tourism",
    "interactive map",
    "gamified travel",
    "mobile-first travel",
    "Southern California vacation"
  ],
  authors: [{ name: "Drive SoCal POV Team" }],
  creator: "Drive SoCal POV",
  publisher: "Drive SoCal POV",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://drivesocalpov.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://drivesocalpov.com',
    title: "Drive SoCal POV - Free Southern California Travel Guide",
    description: "Discover the best attractions, restaurants, and events in Southern California. Interactive maps, mobile-first design, and completely free to use.",
    siteName: "Drive SoCal POV",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Drive SoCal POV - Interactive Southern California Travel Map",
      },
    ],
    countryName: "United States",
    region: "California",
    locality: "Southern California",
    category: "Travel",
    tags: ["travel", "tourism", "Southern California", "mobile app", "free"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive SoCal POV",
    description: "Your ultimate mobile travel guide to Southern California",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    title: "Drive SoCal POV",
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Mobile PWA and iOS Safari specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Drive SoCal POV" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Drive SoCal POV" />
        <meta name="msapplication-TileColor" content="#007AFF" />
        <meta name="theme-color" content="#007AFF" />

        {/* iOS Safari viewport and PWA optimizations - CRITICAL FIXES */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="email=no" />
        <meta name="format-detection" content="address=no" />

        {/* Prevent bounce scroll on iOS Safari */}
        <meta name="apple-mobile-web-app-scroll-to-top" content="yes" />

        {/* Force iOS Safari to use full viewport height */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, height=device-height" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);

                      // Check for updates
                      registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (confirm('New version available! Reload to update?')) {
                              window.location.reload();
                            }
                          }
                        });
                      });
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // Register for periodic background sync (if supported)
              if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
                navigator.serviceWorker.ready.then(function(registration) {
                  return registration.periodicSync.register({
                    tag: 'map-tiles-sync',
                    minPeriod: 24 * 60 * 60 * 1000, // 24 hours
                  });
                }).catch(function(error) {
                  console.log('Periodic sync registration failed:', error);
                });
              }
            `,
          }}
        />

        {/* Google AdSense Script - Client Side Only */}
        {typeof window !== 'undefined' && (
          <>
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
              crossOrigin="anonymous"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (adsbygoogle = window.adsbygoogle || []).push({
                    google_ad_client: "ca-pub-XXXXXXXXXXXXXXXX",
                    enable_page_level_ads: true
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden ios-fixed"
        suppressHydrationWarning
        style={{
          // iOS Safari specific fixes - CRITICAL HEIGHT FIXES
          WebkitOverflowScrolling: 'touch',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          // Prevent zoom on input focus
          WebkitTextSizeAdjust: '100%',
          // Force iOS Safari to use full viewport height with fallback
          height: '-webkit-fill-available',
          minHeight: '-webkit-fill-available',
          // Prevent iOS Safari from adding extra space
          margin: '0px',
          padding: '0px',
          // Force full viewport coverage
          position: 'fixed',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          width: '100vw',
          // Override iOS Safari viewport behavior
          overflow: 'hidden',
        }}
      >
        <div
          className="relative flex flex-col ios-fixed"
          style={{
            // Force iOS Safari viewport coverage
            height: '-webkit-fill-available',
            minHeight: '-webkit-fill-available',
            width: '100vw',
            position: 'fixed',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            margin: '0px',
            padding: '0px',
            // Prevent iOS Safari viewport issues
            WebkitOverflowScrolling: 'touch',
            overflow: 'hidden',
          }}
        >
          {/* Main content area */}
          <main
            className="flex-1 relative"
            style={{
              // Ensure main content fills available space
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              // iOS Safari specific fixes
              WebkitOverflowScrolling: 'touch',
              overflow: 'hidden',
            }}
          >
            {children}
          </main>
        </div>

        {/* Global loading indicator */}
        <div id="global-loading" className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] hidden items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </body>
    </html>
  );
}

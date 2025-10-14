import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Drive SoCal POV",
    template: "%s | Drive SoCal POV",
  },
  description: "Your ultimate mobile travel guide to Southern California with GTA V-inspired maps and gamified exploration",
  keywords: ["Southern California", "travel guide", "mobile app", "San Diego", "Los Angeles", "Inland Empire", "attractions", "restaurants", "events"],
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
    title: "Drive SoCal POV - Your Ultimate Southern California Travel Guide",
    description: "Explore Southern California with our mobile-first travel guide featuring interactive maps, gamified exploration, and curated local experiences.",
    siteName: "Drive SoCal POV",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Drive SoCal POV - Southern California Travel Guide",
      },
    ],
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

        {/* iOS Safari viewport and PWA optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="email=no" />
        <meta name="format-detection" content="address=no" />

        {/* Prevent bounce scroll on iOS Safari */}
        <meta name="apple-mobile-web-app-scroll-to-top" content="yes" />

        {/* Safe area support for iOS devices with notches */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body
        className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden ios-fixed"
        suppressHydrationWarning
        style={{
          // iOS Safari specific fixes
          WebkitOverflowScrolling: 'touch',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          // Prevent zoom on input focus
          WebkitTextSizeAdjust: '100%',
          // Mobile PWA viewport fixes
          height: '100vh',
          height: '100dvh',
          minHeight: '100vh',
          minHeight: '100dvh',
        }}
      >
        <div className="relative min-h-screen flex flex-col">
          {/* Main content area */}
          <main className="flex-1 relative">
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

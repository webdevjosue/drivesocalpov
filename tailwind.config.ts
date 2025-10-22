import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui system colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // SoCal Inspired Colors
        socal: {
          ocean: {
            50: "var(--socal-ocean-50)",
            100: "var(--socal-ocean-100)",
            200: "var(--socal-ocean-200)",
            300: "var(--socal-ocean-300)",
            400: "var(--socal-ocean-400)",
            500: "var(--socal-ocean-500)",
            600: "var(--socal-ocean-600)",
            700: "var(--socal-ocean-700)",
            800: "var(--socal-ocean-800)",
            900: "var(--socal-ocean-900)",
          },
          sunset: {
            50: "var(--socal-sunset-50)",
            100: "var(--socal-sunset-100)",
            200: "var(--socal-sunset-200)",
            300: "var(--socal-sunset-300)",
            400: "var(--socal-sunset-400)",
            500: "var(--socal-sunset-500)",
            600: "var(--socal-sunset-600)",
            700: "var(--socal-sunset-700)",
            800: "var(--socal-sunset-800)",
            900: "var(--socal-sunset-900)",
          },
          palm: {
            50: "var(--socal-palm-50)",
            100: "var(--socal-palm-100)",
            200: "var(--socal-palm-200)",
            300: "var(--socal-palm-300)",
            400: "var(--socal-palm-400)",
            500: "var(--socal-palm-500)",
            600: "var(--socal-palm-600)",
            700: "var(--socal-palm-700)",
            800: "var(--socal-palm-800)",
            900: "var(--socal-palm-900)",
          },
          sand: {
            50: "var(--socal-sand-50)",
            100: "var(--socal-sand-100)",
            200: "var(--socal-sand-200)",
            300: "var(--socal-sand-300)",
            400: "var(--socal-sand-400)",
            500: "var(--socal-sand-500)",
            600: "var(--socal-sand-600)",
            700: "var(--socal-sand-700)",
            800: "var(--socal-sand-800)",
            900: "var(--socal-sand-900)",
          },
          stone: {
            50: "var(--socal-stone-50)",
            100: "var(--socal-stone-100)",
            200: "var(--socal-stone-200)",
            300: "var(--socal-stone-300)",
            400: "var(--socal-stone-400)",
            500: "var(--socal-stone-500)",
            600: "var(--socal-stone-600)",
            700: "var(--socal-stone-700)",
            800: "var(--socal-stone-800)",
            900: "var(--socal-stone-900)",
          },
        },

        // GTA V Inspired Colors
        gtav: {
          gold: {
            50: "var(--gtav-gold-50)",
            100: "var(--gtav-gold-100)",
            200: "var(--gtav-gold-200)",
            300: "var(--gtav-gold-300)",
            400: "var(--gtav-gold-400)",
            500: "var(--gtav-gold-500)",
            600: "var(--gtav-gold-600)",
            700: "var(--gtav-gold-700)",
            800: "var(--gtav-gold-800)",
            900: "var(--gtav-gold-900)",
          },
          purple: {
            50: "var(--gtav-purple-50)",
            100: "var(--gtav-purple-100)",
            200: "var(--gtav-purple-200)",
            300: "var(--gtav-purple-300)",
            400: "var(--gtav-purple-400)",
            500: "var(--gtav-purple-500)",
            600: "var(--gtav-purple-600)",
            700: "var(--gtav-purple-700)",
            800: "var(--gtav-purple-800)",
            900: "var(--gtav-purple-900)",
          },
        },

        // Semantic System Colors
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        "surface-elevated": "var(--color-surface-elevated)",
        "surface-overlay": "var(--color-surface-overlay)",

        // Map-specific colors for Drive SoCal POV (updated with better contrast)
        map: {
          water: "var(--socal-ocean-400)",
          park: "var(--socal-palm-500)",
          road: "var(--socal-stone-300)",
          building: "var(--socal-stone-400)",
          poi: "var(--socal-sunset-500)",
          "poi-dark": "var(--socal-sunset-400)",
          highway: "var(--socal-sand-400)",
          coastline: "var(--socal-ocean-300)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      screens: {
        // Mobile-first breakpoint system
        xs: "375px", // iPhone SE
        sm: "414px", // iPhone Pro
        md: "768px", // iPad
        lg: "1024px", // iPad Pro
        xl: "1280px", // Desktop
        "2xl": "1536px", // Large desktop
      },
      spacing: {
        // Safe area spacing for mobile
        "safe-top": "max(env(safe-area-inset-top), 1rem)",
        "safe-bottom": "max(env(safe-area-inset-bottom), 1rem)",
        "safe-left": "max(env(safe-area-inset-left), 1rem)",
        "safe-right": "max(env(safe-area-inset-right), 1rem)",
        // Map-specific spacing
        "map-overlay": "2.5rem",
        "map-control": "3rem",
      },
      minHeight: {
        // Mobile viewport heights
        "screen-safe": "calc(100vh - var(--safe-top) - var(--safe-bottom))",
        "map-full": "calc(100vh - 4rem)", // Account for header and bottom nav
      },
      minWidth: {
        // Touch-friendly minimum sizes
        "touch-target": "44px",
        "touch-large": "56px",
      },
      maxWidth: {
        // Mobile constraints
        "mobile": "428px", // Largest iPhone width
        "tablet": "768px",
      },
      boxShadow: {
        // Elevated shadows for mobile
        "mobile-elevation-1": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        "mobile-elevation-2": "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
        "mobile-elevation-3": "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
      },
      backdropBlur: {
        xs: "2px",
      },
      zIndex: {
        // Mobile layer management
        "map-base": "1",
        "map-overlay": "10",
        "map-controls": "20",
        "map-popup": "30",
        "ui-base": "40",
        "ui-nav": "50",
        "ui-modal": "100",
        "ui-toast": "200",
      },
    },
  },
  plugins: [],
  // Enable important utility classes for mobile-first overrides
  important: true,
  // Dark mode configuration
  darkMode: "class",
  };

export default config;
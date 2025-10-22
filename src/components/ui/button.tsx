import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline",

        // SoCal themed variants
        socal:
          "bg-gradient-to-r from-socal-ocean-500 to-socal-ocean-600 text-white shadow-lg hover:from-socal-ocean-600 hover:to-socal-ocean-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0",
        sunset:
          "bg-gradient-to-r from-socal-sunset-500 to-socal-sunset-600 text-white shadow-lg hover:from-socal-sunset-600 hover:to-socal-sunset-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0",
        palm:
          "bg-gradient-to-r from-socal-palm-500 to-socal-palm-600 text-white shadow-lg hover:from-socal-palm-600 hover:to-socal-palm-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0",

        // GTA V themed variants
        gtavGold:
          "bg-gradient-to-r from-gtav-gold-500 to-gtav-gold-600 text-socal-stone-900 font-semibold shadow-lg hover:from-gtav-gold-400 hover:to-gtav-gold-500 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 relative overflow-hidden",
        gtavPurple:
          "bg-gradient-to-r from-gtav-purple-500 to-gtav-purple-600 text-white shadow-lg hover:from-gtav-purple-400 hover:to-gtav-purple-500 hover:-translate-y-1 hover:shadow-xl active:translate-y-0",

        // High contrast variants for accessibility
        contrast:
          "bg-socal-stone-900 text-white border-2 border-socal-stone-700 hover:bg-socal-stone-800 hover:border-socal-stone-600 hover:-translate-y-0.5 active:translate-y-0",
        "contrast-dark":
          "bg-white text-socal-stone-900 border-2 border-socal-stone-300 hover:bg-socal-stone-50 hover:border-socal-stone-400 hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        // Mobile-optimized larger sizes
        mobile: "h-12 px-6 py-3 text-base min-h-[52px]",
        "mobile-lg": "h-14 px-8 py-4 text-lg min-h-[56px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

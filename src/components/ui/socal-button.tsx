import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const socalButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-600 hover:to-pink-600 hover:shadow-xl",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl",
        outline: "border-2 border-orange-500 bg-background text-orange-500 shadow-lg hover:bg-orange-500 hover:text-white hover:shadow-xl",
        secondary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl",
        ghost: "text-orange-500 hover:bg-orange-50 hover:text-orange-600",
        link: "text-orange-500 underline-offset-4 hover:underline hover:text-orange-600",
        gta: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-lg hover:from-yellow-300 hover:to-orange-400 hover:shadow-xl border-2 border-black",
        premium: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl border border-purple-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
        gta: "h-12 px-6 py-3 text-base font-black tracking-wide",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SoCalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof socalButtonVariants> {
  asChild?: boolean
}

const SoCalButton = React.forwardRef<HTMLButtonElement, SoCalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(socalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
SoCalButton.displayName = "SoCalButton"

export { SoCalButton, socalButtonVariants }
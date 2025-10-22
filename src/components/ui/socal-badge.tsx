import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const socalBadgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-orange-200 bg-orange-100 text-orange-800 shadow-md hover:bg-orange-200",
        secondary: "border-blue-200 bg-blue-100 text-blue-800 shadow-md hover:bg-blue-200",
        destructive: "border-red-200 bg-red-100 text-red-800 shadow-md hover:bg-red-200",
        outline: "text-orange-600 border-2 border-orange-500 shadow-md hover:bg-orange-50",
        gta: "border-yellow-400 bg-yellow-300 text-black font-black shadow-lg hover:bg-yellow-200 border-2",
        free: "border-green-400 bg-green-100 text-green-800 shadow-md hover:bg-green-200",
        premium: "border-purple-400 bg-purple-100 text-purple-800 shadow-md hover:bg-purple-200",
        location: "border-cyan-400 bg-cyan-100 text-cyan-800 shadow-md hover:bg-cyan-200",
        mission: "border-red-400 bg-red-100 text-red-800 shadow-md hover:bg-red-200"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SoCalBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof socalBadgeVariants> {}

function SoCalBadge({ className, variant, ...props }: SoCalBadgeProps) {
  return (
    <div className={cn(socalBadgeVariants({ variant }), className)} {...props} />
  )
}

export { SoCalBadge, socalBadgeVariants }
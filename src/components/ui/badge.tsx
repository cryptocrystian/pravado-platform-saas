import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-short ease-standard focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-150",
        primary: "border-pravado-purple-200 bg-pravado-purple-100 text-pravado-purple-700 hover:bg-pravado-purple-150",
        secondary: "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-150",
        destructive: "border-alert-200 bg-alert-100 text-alert-700 hover:bg-alert-150",
        success: "border-success-200 bg-success-100 text-success-700 hover:bg-success-150",
        warning: "border-warning-200 bg-warning-100 text-warning-700 hover:bg-warning-150",
        info: "border-intelligence-200 bg-intelligence-100 text-intelligence-700 hover:bg-intelligence-150",
        ai: "border-pravado-purple-200 bg-pravado-purple-subtle text-pravado-purple-dark shadow-xs",
        outline: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        dot: "border-transparent bg-gray-700 text-white px-2 py-1",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

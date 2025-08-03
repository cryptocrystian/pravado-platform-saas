
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-short ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pravado-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gpu-accelerated",
  {
    variants: {
      variant: {
        default: "bg-pravado-purple-600 text-white shadow-sm hover:bg-pravado-purple-700 hover:shadow-purple active:scale-95",
        destructive: "bg-alert-500 text-white shadow-sm hover:bg-alert-600 hover:shadow-glow-alert active:scale-95",
        outline: "border border-gray-300 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm active:scale-95",
        secondary: "bg-gray-100 text-gray-700 shadow-xs hover:bg-gray-150 hover:shadow-sm active:scale-95",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-700",
        link: "text-pravado-purple-600 underline-offset-4 hover:underline hover:text-pravado-purple-700",
        ai: "bg-gradient-to-r from-pravado-purple-500 to-pravado-purple-600 text-white shadow-purple hover:from-pravado-purple-600 hover:to-pravado-purple-700 hover:shadow-purple-lg active:scale-95",
        success: "bg-success-500 text-white shadow-sm hover:bg-success-600 hover:shadow-glow-success active:scale-95",
        warning: "bg-warning-500 text-white shadow-sm hover:bg-warning-600 active:scale-95",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
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

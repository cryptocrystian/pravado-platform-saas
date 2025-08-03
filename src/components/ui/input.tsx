
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-250 bg-white px-4 py-3 text-sm text-gray-800 shadow-xs transition-all duration-short ease-standard ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 hover:border-gray-300 focus-visible:outline-none focus-visible:border-pravado-purple-400 focus-visible:ring-3 focus-visible:ring-pravado-purple-100 disabled:cursor-not-allowed disabled:bg-gray-75 disabled:border-gray-200 disabled:text-gray-500 disabled:opacity-75",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-[var(--primary-hover)] hover:to-[var(--accent-hover)]",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-red-600 hover:to-red-700",
        outline:
          "border-2 border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--primary-light)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm hover:shadow-md hover:scale-[1.02]",
        secondary:
          "bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-[var(--accent-hover)] hover:to-purple-700",
        ghost: "text-[var(--secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:scale-[1.02]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline hover:text-[var(--primary-hover)] hover:scale-[1.02]",
        success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-green-600 hover:to-emerald-700",
        warning: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] hover:from-yellow-600 hover:to-orange-700",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-11 w-11",
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
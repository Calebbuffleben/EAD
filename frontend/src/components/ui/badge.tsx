import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-sm hover:shadow-md",
        secondary:
          "border-transparent bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white shadow-sm hover:shadow-md",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:shadow-md",
        outline: "border-2 border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--primary-light)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm hover:shadow-md",
        success: "border-transparent bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow-md",
        warning: "border-transparent bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-sm hover:shadow-md",
        info: "border-transparent bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
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
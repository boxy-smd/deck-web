import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'w-full rounded-[6px] border outline-none transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-deck-border bg-deck-bg text-deck-darkest placeholder-deck-placeholder hover:bg-deck-bg-hover/20 focus:border-deck-darkest',
        error:
          'border-red-800 bg-slate-100 text-deck-darkest placeholder-deck-placeholder hover:bg-deck-bg-hover/20',
      },
      'input-size': {
        default: 'p-3',
        md: 'px-3 py-2',
        sm: 'px-2.5 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      'input-size': 'default',
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ className, ...props }))}
        ref={ref}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export { Input }

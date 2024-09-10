import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const inputVariants = cva('w-full rounded-[6px] border transition-colors', {
  variants: {
    variant: {
      default:
        'border-slate-300 bg-slate-100 text-slate-900 placeholder-slate-500 hover:bg-slate-200',
      error:
        'border-red-800 bg-slate-100 text-slate-900 placeholder-slate-500 hover:bg-slate-200',
    },
    inputSize: {
      default: 'p-3',
      md: 'px-3 py-2',
      sm: 'px-2.5 py-1.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    inputSize: 'default',
  },
})

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

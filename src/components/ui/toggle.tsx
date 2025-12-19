'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'flex items-center justify-center gap-[10px] whitespace-nowrap rounded-[18px] border font-semibold text-sm transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200',
        added: 'border-slate-600 bg-slate-600 text-slate-50 hover:bg-slate-600',
        toAdd:
          'border-none bg-slate-100 text-deck-secondary-text hover:bg-slate-200',
        addedTo: 'border-none bg-slate-200 text-slate-900 hover:bg-slate-300',
        transparent:
          'border-none bg-transparent text-slate-900 hover:bg-deck-bg-hover',
        active:
          'border-none bg-deck-bg-button text-deck-darkest hover:bg-deck-bg-hover',
      },
      size: {
        default: 'px-4 py-2',
        tag: 'px-3 py-1.5',
        icon: 'rounded-sm p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

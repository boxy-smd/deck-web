import type * as React from 'react'
import { cn } from '@/lib/utils'

function Kbd({
  className,
  ...props
}: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-slate-300 bg-white px-1.5 font-medium text-[11px] text-slate-700 leading-none',
        className,
      )}
      {...props}
    />
  )
}

function KbdGroup({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 align-middle', className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }

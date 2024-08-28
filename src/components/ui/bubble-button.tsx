import type { ComponentProps, ReactNode } from 'react'

export interface BubbleButtonProps extends ComponentProps<'button'> {
  children: ReactNode
}

export function BubbleButton(props: BubbleButtonProps) {
  return (
    <button
      className="flex items-center p-2 font-medium text-sm text-zinc-200 leading-none hover:bg-zinc-600 hover:text-zinc-50"
      {...props}
    />
  )
}

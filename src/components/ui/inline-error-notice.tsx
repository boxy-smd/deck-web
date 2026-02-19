'use client'

import { Button } from '@/components/ui/button'

interface InlineErrorNoticeProps {
  message: string
  onDismiss?(): void
  className?: string
  textSize?: 'xs' | 'sm'
}

export function InlineErrorNotice({
  message,
  onDismiss,
  className,
  textSize = 'xs',
}: InlineErrorNoticeProps) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700 ${textSize === 'sm' ? 'text-sm' : 'text-xs'} ${className || ''}`}
      role="alert"
      aria-live="polite"
    >
      <span>{message}</span>
      {onDismiss && (
        <Button
          type="button"
          size="sm"
          className="h-6 rounded-xs bg-transparent px-2 py-1 text-red-700"
          onClick={onDismiss}
        >
          Fechar
        </Button>
      )}
    </div>
  )
}

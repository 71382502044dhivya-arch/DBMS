'use client'

import { Heart } from 'lucide-react'
import { useOptimistic, useTransition } from 'react'
import { toggleLike } from '@/app/actions'
import { cn } from '@/lib/utils'

export function LikeButton({ postId, liked, count }: { postId: number; liked: boolean; count: number }) {
  const [, startTransition] = useTransition()
  const [optimistic, toggle] = useOptimistic({ liked, count }, (current) => ({
    liked: !current.liked,
    count: current.count + (current.liked ? -1 : 1),
  }))

  return (
    <button
      type="button"
      aria-pressed={optimistic.liked}
      onClick={() =>
        startTransition(async () => {
          toggle(undefined)
          await toggleLike(postId)
        })
      }
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm transition-colors',
        optimistic.liked ? 'text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Heart className={cn('size-4', optimistic.liked && 'fill-current')} aria-hidden="true" />
      <span className="tabular-nums">{optimistic.count}</span>
      <span className="sr-only">{optimistic.liked ? 'Unlike post' : 'Like post'}</span>
    </button>
  )
}

'use client'

import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { deletePost } from '@/app/actions'

export function DeletePostButton({ postId }: { postId: number }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm('Delete this post?')) startTransition(() => deletePost(postId))
      }}
      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="size-4" aria-hidden="true" />
      <span className="sr-only">Delete post</span>
    </button>
  )
}

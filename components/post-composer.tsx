'use client'

import { useActionState, useEffect, useState } from 'react'
import { createPost, type FormState } from '@/app/actions'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
import { POST_MAX_LENGTH } from '@/lib/validation'
import { cn } from '@/lib/utils'

export function PostComposer({ name, image }: { name: string; image: string | null }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createPost, { status: 'idle' })
  const [content, setContent] = useState('')
  const remaining = POST_MAX_LENGTH - content.length

  useEffect(() => {
    if (state.status === 'success') setContent('')
  }, [state])

  return (
    <form action={formAction} className="rounded-lg border border-border bg-card p-4">
      <div className="flex gap-3">
        <Avatar name={name} image={image} />
        <div className="flex-1">
          <label htmlFor="content" className="sr-only">
            {"What's new?"}
          </label>
          <textarea
            id="content"
            name="content"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={POST_MAX_LENGTH}
            placeholder={"What's new with you?"}
            className="w-full resize-none bg-transparent pt-2 text-base leading-relaxed placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-3">
        {state.status === 'error' && (
          <p role="alert" className="mr-auto text-sm text-destructive">
            {state.message}
          </p>
        )}
        <span
          className={cn('text-xs tabular-nums text-muted-foreground', remaining < 20 && 'text-destructive')}
          aria-live="polite"
        >
          {remaining}
        </span>
        <Button type="submit" size="sm" disabled={pending || content.trim().length === 0}>
          {pending ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </form>
  )
}

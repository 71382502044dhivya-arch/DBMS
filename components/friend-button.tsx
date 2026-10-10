'use client'

import { Check, Clock, UserMinus, UserPlus, X } from 'lucide-react'
import { useTransition } from 'react'
import { updateFriendship, type FriendAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import type { Relationship } from '@/lib/queries'

export function FriendButton({ userId, relationship }: { userId: string; relationship: Relationship }) {
  const [pending, startTransition] = useTransition()
  const run = (action: FriendAction) => startTransition(() => updateFriendship(userId, action))

  if (relationship === 'self') return null

  if (relationship === 'incoming') {
    return (
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={() => run('accept')}>
          <Check className="size-4" aria-hidden="true" />
          Accept
        </Button>
        <Button size="sm" variant="secondary" disabled={pending} onClick={() => run('decline')}>
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Decline</span>
        </Button>
      </div>
    )
  }

  if (relationship === 'outgoing') {
    return (
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => run('cancel')} className="group">
        <Clock className="size-4 group-hover:hidden" aria-hidden="true" />
        <X className="hidden size-4 group-hover:block" aria-hidden="true" />
        <span className="group-hover:hidden">Requested</span>
        <span className="hidden group-hover:inline">Cancel</span>
      </Button>
    )
  }

  if (relationship === 'friends') {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() => {
          if (window.confirm('Remove this friend?')) run('remove')
        }}
        className="group"
      >
        <Check className="size-4 text-primary group-hover:hidden" aria-hidden="true" />
        <UserMinus className="hidden size-4 group-hover:block" aria-hidden="true" />
        <span className="group-hover:hidden">Friends</span>
        <span className="hidden group-hover:inline">Remove</span>
      </Button>
    )
  }

  return (
    <Button size="sm" disabled={pending} onClick={() => run('add')}>
      <UserPlus className="size-4" aria-hidden="true" />
      Add friend
    </Button>
  )
}

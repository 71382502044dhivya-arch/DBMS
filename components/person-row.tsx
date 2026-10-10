import Link from 'next/link'
import type { Person, Relationship } from '@/lib/queries'
import { Avatar } from '@/components/avatar'
import { FriendButton } from '@/components/friend-button'

export function PersonRow({ person }: { person: Person & { relationship: Relationship } }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
      <Link href={`/u/${person.username}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-md">
        <Avatar name={person.name} image={person.image} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{person.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            @{person.username}
            {person.bio ? ` · ${person.bio}` : ''}
          </p>
        </div>
      </Link>
      <FriendButton userId={person.id} relationship={person.relationship} />
    </div>
  )
}

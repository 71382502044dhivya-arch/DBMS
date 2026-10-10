import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'
import { PersonRow } from '@/components/person-row'
import { buttonClasses } from '@/components/ui/button'
import { getConnections, type Person, type Relationship } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'Friends' }

function Section({ title, people }: { title: string; people: (Person & { relationship: Relationship })[] }) {
  if (people.length === 0) return null
  return (
    <section aria-labelledby={`${title}-heading`} className="flex flex-col gap-3">
      <h2 id={`${title}-heading`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {title}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-foreground">{people.length}</span>
      </h2>
      <ul className="flex flex-col gap-3">
        {people.map((person) => (
          <li key={person.id}>
            <PersonRow person={person} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function FriendsPage() {
  const currentUser = await requireUser()
  const { friends, incoming, outgoing } = await getConnections(currentUser.id)
  const isEmpty = friends.length + incoming.length + outgoing.length === 0

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">Friends</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage requests and the people in your loop.</p>
      </div>

      {isEmpty ? (
        <EmptyState title="No friends yet" description="Send a few requests and your friends will appear here.">
          <Link href="/people" className={buttonClasses({ size: 'sm' })}>
            Find people
          </Link>
        </EmptyState>
      ) : (
        <>
          <Section title="Requests" people={incoming} />
          <Section title="Your friends" people={friends} />
          <Section title="Sent" people={outgoing} />
        </>
      )}
    </div>
  )
}

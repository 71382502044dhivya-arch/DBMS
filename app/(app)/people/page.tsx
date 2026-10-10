import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PersonRow } from '@/components/person-row'
import { getPeople } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'People' }

export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const currentUser = await requireUser()
  const { q = '' } = await searchParams
  const query = q.slice(0, 50)
  const people = await getPeople(currentUser.id, query)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Find people</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search by name or username and grow your loop.</p>
      </div>

      <form role="search" className="relative">
        <label htmlFor="q" className="sr-only">
          Search people
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search people…"
          className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm placeholder:text-muted-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </form>

      {people.length === 0 ? (
        <EmptyState
          title={query ? 'No matches' : 'No one else here yet'}
          description={query ? `Nobody matches “${query}”. Try another name.` : 'Invite friends to join Loop and they will show up here.'}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {people.map((person) => (
            <li key={person.id}>
              <PersonRow person={person} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

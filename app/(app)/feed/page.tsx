import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'
import { PostCard } from '@/components/post-card'
import { PostComposer } from '@/components/post-composer'
import { buttonClasses } from '@/components/ui/button'
import { getFeed } from '@/lib/queries'
import { requireUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Feed' }

export default async function FeedPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const currentUser = await requireUser()
  const { tab } = await searchParams
  const scope = tab === 'everyone' ? 'everyone' : 'friends'
  const feed = await getFeed(currentUser.id, scope)

  const tabs = [
    { key: 'friends', label: 'Friends', href: '/feed' },
    { key: 'everyone', label: 'Everyone', href: '/feed?tab=everyone' },
  ] as const

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Hey, {currentUser.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{"Here's what your loop is up to."}</p>
        </div>
      </div>

      <PostComposer name={currentUser.name} image={currentUser.image ?? null} />

      <nav aria-label="Feed filter" className="flex gap-1 rounded-full border border-border bg-card p-1 self-start">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={scope === t.key ? 'page' : undefined}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              scope === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {feed.length === 0 ? (
        scope === 'friends' ? (
          <EmptyState
            title="Your feed is quiet"
            description="Posts from you and your friends show up here. Find people to add, or browse everyone's posts."
          >
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/people" className={buttonClasses({ size: 'sm' })}>
                Find people
              </Link>
              <Link href="/feed?tab=everyone" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                Browse everyone
              </Link>
            </div>
          </EmptyState>
        ) : (
          <EmptyState title="No posts yet" description="Be the first to share something with the loop." />
        )
      ) : (
        <ul className="flex flex-col gap-3">
          {feed.map((post) => (
            <li key={post.id}>
              <PostCard post={post} viewerId={currentUser.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

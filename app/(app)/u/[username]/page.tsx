import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/avatar'
import { EmptyState } from '@/components/empty-state'
import { FriendButton } from '@/components/friend-button'
import { PostCard } from '@/components/post-card'
import { buttonClasses } from '@/components/ui/button'
import { getPostsByUser, getProfileStats, getRelationship, getUserByUsername } from '@/lib/queries'
import { requireUser } from '@/lib/session'

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `@${username}` }
}

export default async function ProfilePage({ params }: Props) {
  const currentUser = await requireUser()
  const { username } = await params
  const profile = await getUserByUsername(decodeURIComponent(username))
  if (!profile) notFound()

  const [relationship, stats, posts] = await Promise.all([
    getRelationship(currentUser.id, profile.id),
    getProfileStats(profile.id),
    getPostsByUser(profile.id, currentUser.id),
  ])
  const joined = profile.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-48 rounded-full border-[28px] border-primary/10" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} image={profile.image} size="lg" />
            <div className="min-w-0">
              <h1 className="font-display text-3xl leading-tight">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            </div>
          </div>
          {relationship === 'self' ? (
            <Link href="/settings" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
              Edit profile
            </Link>
          ) : (
            <FriendButton userId={profile.id} relationship={relationship} />
          )}
        </div>
        {profile.bio && <p className="relative mt-5 leading-relaxed text-pretty">{profile.bio}</p>}
        <dl className="relative mt-5 flex gap-6 text-sm">
          <div className="flex gap-1.5">
            <dt className="order-2 text-muted-foreground">posts</dt>
            <dd className="font-semibold tabular-nums">{stats.posts}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="order-2 text-muted-foreground">friends</dt>
            <dd className="font-semibold tabular-nums">{stats.friends}</dd>
          </div>
          <div className="flex gap-1.5 text-muted-foreground">
            <dt className="sr-only">Joined</dt>
            <dd>Joined {joined}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="posts-heading" className="flex flex-col gap-3">
        <h2 id="posts-heading" className="text-sm font-medium text-muted-foreground">
          Posts
        </h2>
        {posts.length === 0 ? (
          <EmptyState
            title="Nothing posted yet"
            description={relationship === 'self' ? 'Share your first update from the feed.' : `${profile.name} hasn’t posted anything yet.`}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} viewerId={currentUser.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

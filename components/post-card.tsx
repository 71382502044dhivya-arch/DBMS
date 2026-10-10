import Link from 'next/link'
import type { FeedPost } from '@/lib/queries'
import { formatRelative } from '@/lib/utils'
import { Avatar } from '@/components/avatar'
import { DeletePostButton } from '@/components/delete-post-button'
import { LikeButton } from '@/components/like-button'

export function PostCard({ post, viewerId }: { post: FeedPost; viewerId: string }) {
  const profileHref = `/u/${post.author.username}`
  return (
    <article className="flex gap-3 rounded-lg border border-border bg-card p-4">
      <Link href={profileHref} className="shrink-0 self-start rounded-full">
        <Avatar name={post.author.name} image={post.author.image} />
        <span className="sr-only">{post.author.name}</span>
      </Link>
      <div className="min-w-0 flex-1">
        <header className="flex items-baseline gap-2 text-sm">
          <Link href={profileHref} className="truncate font-semibold hover:underline">
            {post.author.name}
          </Link>
          <span className="truncate text-muted-foreground">@{post.author.username}</span>
          <span aria-hidden="true" className="text-muted-foreground">
            ·
          </span>
          <time dateTime={post.createdAt.toISOString()} className="shrink-0 text-muted-foreground">
            {formatRelative(post.createdAt)}
          </time>
        </header>
        <p className="mt-1 whitespace-pre-wrap break-words leading-relaxed text-pretty">{post.content}</p>
        <footer className="-ml-2.5 mt-2 flex items-center justify-between">
          <LikeButton postId={post.id} liked={post.likedByMe} count={post.likeCount} />
          {post.author.id === viewerId && <DeletePostButton postId={post.id} />}
        </footer>
      </div>
    </article>
  )
}

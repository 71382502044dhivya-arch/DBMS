import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { buttonClasses } from '@/components/ui/button'

const samplePosts = [
  { name: 'Maya Chen', username: 'maya', time: '2m', content: 'Finally finished the pottery class. Three bowls, one is almost round.', likes: 12, liked: true },
  { name: 'Jonas Berg', username: 'jonas', time: '1h', content: 'Sunday ramen at mine? I have way too much broth.', likes: 5, liked: false },
  { name: 'Priya Nair', username: 'priya', time: '3h', content: 'Moved into the new place today. The light here is unreal.', likes: 21, liked: false },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute -left-40 top-20 size-[36rem] rounded-full border-[64px] border-primary/5" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 md:py-28 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            A calmer social network
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-7xl">
            Stay in the loop with <em className="text-primary">your people.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Share short updates, cheer each other on, and keep up with friends — without the noise, ads, or
            algorithms.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/sign-up" className={buttonClasses({ size: 'lg' })}>
              Create your account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/sign-in" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
              I already have one
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-2xl" />
          <div className="relative flex flex-col gap-3 rounded-[1.5rem] border border-border bg-background/60 p-4 shadow-2xl backdrop-blur">
            {samplePosts.map((post, i) => (
              <div
                key={post.username}
                className="flex gap-3 rounded-lg border border-border bg-card p-4"
                style={{ transform: `translateX(${i % 2 === 0 ? 0 : 16}px)` }}
              >
                <Avatar name={post.name} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-2 text-sm">
                    <span className="font-semibold">{post.name}</span>
                    <span className="text-muted-foreground">
                      @{post.username} · {post.time}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{post.content}</p>
                  <p className={`mt-2 inline-flex items-center gap-1.5 text-sm ${post.liked ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Heart className={`size-4 ${post.liked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

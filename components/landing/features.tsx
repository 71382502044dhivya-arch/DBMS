import { Heart, MessageSquareText, ShieldCheck, Users } from 'lucide-react'

const features = [
  {
    icon: MessageSquareText,
    title: 'Short, honest updates',
    description: 'Post what’s on your mind in 280 characters. No filters, no performance.',
  },
  {
    icon: Users,
    title: 'Friends, not followers',
    description: 'Connections are mutual. Send a request, get accepted, and your feeds come together.',
  },
  {
    icon: Heart,
    title: 'Quiet appreciation',
    description: 'Like posts to let friends know you saw them. That’s it — no viral mechanics.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    description: 'Secure accounts, hashed passwords, and your data scoped to you. No ads, ever.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl leading-tight text-balance md:text-5xl">
            Everything you need to stay close. Nothing you don&apos;t.
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Loop strips social media back to what it was meant for — keeping up with the people you care about.
          </p>
        </div>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="rounded-lg border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

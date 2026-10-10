import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button'

const steps = [
  { n: '01', title: 'Create an account', text: 'Pick a name and a username. Takes under a minute.' },
  { n: '02', title: 'Add your friends', text: 'Search for people you know and send a request.' },
  { n: '03', title: 'Share and catch up', text: 'Post updates and see what your loop is up to.' },
]

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <ol className="grid gap-10 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n} className="border-t border-border pt-6">
            <span className="font-display text-3xl text-primary">{step.n}</span>
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="relative mt-24 overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center text-primary-foreground md:py-20">
        <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full border-[40px] border-primary-foreground/10" />
        <h2 className="relative font-display text-4xl leading-tight text-balance md:text-6xl">Your loop is waiting.</h2>
        <p className="relative mx-auto mt-4 max-w-md text-primary-foreground/80">
          Free forever. Join in seconds and invite the people you actually want to hear from.
        </p>
        <Link
          href="/sign-up"
          className={buttonClasses({
            size: 'lg',
            className: 'relative mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90',
          })}
        >
          Get started — it&apos;s free
        </Link>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { buttonClasses } from '@/components/ui/button'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav aria-label="Primary" className="flex items-center gap-2">
          <a href="#features" className="hidden px-3 text-sm text-muted-foreground hover:text-foreground sm:inline">
            Features
          </a>
          <Link href="/sign-in" className={buttonClasses({ variant: 'ghost', size: 'sm' })}>
            Sign in
          </Link>
          <Link href="/sign-up" className={buttonClasses({ size: 'sm' })}>
            Get started
          </Link>
        </nav>
      </div>
    </header>
  )
}

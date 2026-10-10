import Link from 'next/link'
import { Logo } from '@/components/logo'

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
        <Logo />
        <nav aria-label="Footer" className="flex gap-6">
          <Link href="/sign-in" className="hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="hover:text-foreground">
            Create account
          </Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} Loop</p>
      </div>
    </footer>
  )
}

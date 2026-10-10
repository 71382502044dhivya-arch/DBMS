import Link from 'next/link'
import { Settings } from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { Logo } from '@/components/logo'
import { NavLinks } from '@/components/nav-links'
import { SignOutButton } from '@/components/sign-out-button'
import { buttonClasses } from '@/components/ui/button'
import { getPendingRequestCount } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await requireUser()
  const pendingCount = await getPendingRequestCount(currentUser.id)

  return (
    <div className="min-h-dvh pb-20 md:pb-0">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <Logo href="/feed" />
          <nav aria-label="Main" className="hidden md:block">
            <NavLinks username={currentUser.username} pendingCount={pendingCount} variant="top" />
          </nav>
          <div className="flex items-center gap-1">
            <Link
              href="/settings"
              className={buttonClasses({ variant: 'ghost', size: 'sm', className: 'hidden md:inline-flex' })}
            >
              <Settings className="size-4" aria-hidden="true" />
              <span className="sr-only">Settings</span>
            </Link>
            <SignOutButton />
            <Link href={`/u/${currentUser.username}`} className="ml-1 rounded-full">
              <Avatar name={currentUser.name} image={currentUser.image} size="sm" />
              <span className="sr-only">Your profile</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur md:hidden"
      >
        <NavLinks username={currentUser.username} pendingCount={pendingCount} variant="bottom" />
      </nav>
    </div>
  )
}

import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl text-primary">404</p>
      <h1 className="mt-4 text-xl font-semibold">This page fell out of the loop</h1>
      <p className="mt-2 text-sm text-muted-foreground">{"The page or profile you're looking for doesn't exist."}</p>
      <Link href="/" className={buttonClasses({ className: 'mt-8' })}>
        Go home
      </Link>
    </main>
  )
}

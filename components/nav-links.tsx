'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Settings, User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NavLinks({
  username,
  pendingCount,
  variant,
}: {
  username: string
  pendingCount: number
  variant: 'top' | 'bottom'
}) {
  const pathname = usePathname()
  const links = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '/people', label: 'People', icon: Search },
    { href: '/friends', label: 'Friends', icon: Users, badge: pendingCount },
    { href: `/u/${username}`, label: 'Profile', icon: User },
    ...(variant === 'bottom' ? [{ href: '/settings', label: 'Settings', icon: Settings }] : []),
  ]

  return (
    <ul className={cn('flex', variant === 'top' ? 'items-center gap-1' : 'w-full justify-around')}>
      {links.map(({ href, label, icon: Icon, badge }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-2 rounded-full text-sm font-medium transition-colors',
                variant === 'top' ? 'h-9 px-3.5' : 'flex-col gap-1 px-3 py-2 text-[11px]',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                variant === 'top' && active && 'bg-muted',
              )}
            >
              <Icon className={cn('size-4', variant === 'bottom' && 'size-5', active && 'text-primary')} aria-hidden="true" />
              {label}
              {badge ? (
                <span
                  className={cn(
                    'flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground',
                    variant === 'bottom' && 'absolute right-1 top-0.5',
                  )}
                >
                  {badge}
                  <span className="sr-only"> pending requests</span>
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

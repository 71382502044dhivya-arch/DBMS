import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-full border-[3px] border-primary"
      >
        <span className="size-2 rounded-full bg-primary" />
      </span>
      <span className="text-lg">Loop</span>
    </Link>
  )
}

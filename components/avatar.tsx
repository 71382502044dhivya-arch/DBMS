import { cn, initials } from '@/lib/utils'

const sizes = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-20 text-2xl',
} as const

export function Avatar({
  name,
  image,
  size = 'md',
  className,
}: {
  name: string
  image?: string | null
  size?: keyof typeof sizes
  className?: string
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        className={cn('shrink-0 rounded-full object-cover', sizes[size], className)}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-primary ring-1 ring-border',
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}

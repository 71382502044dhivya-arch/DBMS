import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-muted text-foreground hover:bg-muted/70 border border-border',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted',
  destructive: 'text-destructive hover:bg-destructive/10',
} as const

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
} as const

export type ButtonVariant = keyof typeof variants

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: keyof typeof sizes; className?: string } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

export function Button({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<'button'> & { variant?: ButtonVariant; size?: keyof typeof sizes }) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />
}

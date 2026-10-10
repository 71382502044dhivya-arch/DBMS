export function EmptyState({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <span aria-hidden="true" className="mb-4 flex size-12 items-center justify-center rounded-full border-[3px] border-primary/40">
        <span className="size-3 rounded-full bg-primary/60" />
      </span>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}

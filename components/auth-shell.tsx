export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">{children}</div>
      <aside className="relative hidden overflow-hidden border-l border-border bg-card lg:flex lg:flex-col lg:justify-end lg:p-12">
        <div aria-hidden="true" className="absolute -right-32 -top-32 size-[28rem] rounded-full border-[48px] border-primary/15" />
        <div aria-hidden="true" className="absolute right-24 top-40 size-24 rounded-full bg-primary/20" />
        <blockquote className="relative max-w-md">
          <p className="font-display text-4xl leading-tight text-balance">
            {'“A quieter place for the people I actually want to hear from.”'}
          </p>
          <footer className="mt-6 text-sm text-muted-foreground">Early Loop member</footer>
        </blockquote>
      </aside>
    </main>
  )
}

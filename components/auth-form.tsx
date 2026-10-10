'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

const inputClass =
  'h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const { error } = isSignUp
      ? await authClient.signUp.email({
          email,
          password,
          name: String(form.get('name') ?? '').trim(),
          username: String(form.get('username') ?? '').trim().toLowerCase(),
        })
      : await authClient.signIn.email({ email, password })

    if (error) {
      setPending(false)
      setError(
        isSignUp
          ? 'We couldn’t create your account. The email or username may already be in use.'
          : 'Incorrect email or password.',
      )
      return
    }

    router.push('/feed')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <Logo className="mb-10" />
      <h1 className="font-display text-4xl leading-tight text-balance">
        {isSignUp ? 'Join the loop.' : 'Welcome back.'}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isSignUp
          ? 'Create an account to share updates with your friends.'
          : 'Sign in to catch up with your people.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {isSignUp && (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Display name
              </label>
              <input id="name" name="name" required maxLength={50} autoComplete="name" className={inputClass} placeholder="Ada Lovelace" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                  @
                </span>
                <input
                  id="username"
                  name="username"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]{3,20}"
                  title="3–20 characters: letters, numbers, or underscores"
                  autoComplete="username"
                  className={`${inputClass} pl-7`}
                  placeholder="ada"
                />
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className={inputClass}
            placeholder={isSignUp ? 'At least 8 characters' : '••••••••'}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
          {pending ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account? ' : 'New to Loop? '}
        <Link href={isSignUp ? '/sign-in' : '/sign-up'} className="font-medium text-primary hover:underline">
          {isSignUp ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </div>
  )
}

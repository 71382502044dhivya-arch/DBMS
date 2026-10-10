'use client'

import { useActionState } from 'react'
import { updateProfile, type FormState } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { BIO_MAX_LENGTH, NAME_MAX_LENGTH } from '@/lib/validation'

const inputClass =
  'w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30'

export function ProfileForm({ name, username, bio }: { name: string; username: string; bio: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateProfile, { status: 'idle' })

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Display name
        </label>
        <input id="name" name="name" defaultValue={name} required maxLength={NAME_MAX_LENGTH} className={`${inputClass} h-11`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">@</span>
          <input
            id="username"
            name="username"
            defaultValue={username}
            required
            pattern="[a-zA-Z0-9_]{3,20}"
            title="3–20 characters: letters, numbers, or underscores"
            className={`${inputClass} h-11 pl-7`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio}
          rows={3}
          maxLength={BIO_MAX_LENGTH}
          placeholder="A line or two about you"
          className={`${inputClass} resize-none py-2.5`}
        />
        <p className="text-xs text-muted-foreground">Up to {BIO_MAX_LENGTH} characters.</p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        {state.message && (
          <p
            role={state.status === 'error' ? 'alert' : 'status'}
            className={`mr-auto text-sm ${state.status === 'error' ? 'text-destructive' : 'text-primary'}`}
          >
            {state.message}
          </p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

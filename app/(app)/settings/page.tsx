import type { Metadata } from 'next'
import { ProfileForm } from '@/components/profile-form'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const currentUser = await requireUser()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Edit profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <span className="text-foreground">{currentUser.email}</span>
        </p>
      </div>
      <ProfileForm name={currentUser.name} username={currentUser.username} bio={currentUser.bio ?? ''} />
    </div>
  )
}

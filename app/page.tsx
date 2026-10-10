import { redirect } from 'next/navigation'
import { LandingHeader } from '@/components/landing/landing-header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { CallToAction } from '@/components/landing/call-to-action'
import { LandingFooter } from '@/components/landing/landing-footer'
import { getSession } from '@/lib/session'

export default async function HomePage() {
  const session = await getSession()
  if (session?.user) redirect('/feed')

  return (
    <>
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <LandingFooter />
    </>
  )
}

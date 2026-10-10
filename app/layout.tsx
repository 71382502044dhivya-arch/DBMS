import type { Metadata, Viewport } from 'next'
import { Geist, Instrument_Serif } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  title: { default: 'Loop — stay close to your people', template: '%s · Loop' },
  description:
    'Loop is a small, calm social network for sharing short updates with friends. Post, like, and keep up with the people who matter.',
}

export const viewport: Viewport = {
  themeColor: '#16171c',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrument.variable} bg-background`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  )
}

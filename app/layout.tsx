import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SiteBackground } from '@/components/SiteBackground'
import { CustomCursor } from '@/components/CustomCursor'
import { getSiteUrl } from '@/lib/site'
import './globals.css'

const geologica = localFont({
  src: [
    { path: '../public/fonts/geologica-latin.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/geologica-cyrillic.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/geologica-cyrillic-ext.woff2', weight: '100 900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-geologica',
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Иван Россолов — Портфолио',
  title: 'Ваня Россолов — продуктовый дизайнер',
  description: 'Портфолио продуктового дизайнера: проекты, кейсы, UX/UI решения и визуальные концепции.',
  generator: 'v0.app',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'Иван Россолов — Портфолио',
    title: 'Ваня Россолов — продуктовый дизайнер',
    description: 'Портфолио продуктового дизайнера: проекты, кейсы, UX/UI решения и визуальные концепции.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ваня Россолов — продуктовый дизайнер',
    description: 'Портфолио продуктового дизайнера: проекты, кейсы, UX/UI решения и визуальные концепции.',
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${geologica.variable} font-sans antialiased`}>
        <SiteBackground />
        <CustomCursor />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}

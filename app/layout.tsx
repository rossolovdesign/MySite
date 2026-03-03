import type { Metadata } from 'next'
import { Geologica } from 'next/font/google'
import { SiteBackground } from '@/components/SiteBackground'
import { getSiteUrl } from '@/lib/site'
import './globals.css'

const geologica = Geologica({ subsets: ['latin', 'cyrillic'] })

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Иван Россолов — Портфолио',
  title: 'Иван Россолов — Продуктовый Дизайнер',
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
    title: 'Иван Россолов — Продуктовый Дизайнер',
    description: 'Портфолио продуктового дизайнера: проекты, кейсы, UX/UI решения и визуальные концепции.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Иван Россолов — Продуктовый Дизайнер',
    description: 'Портфолио продуктового дизайнера: проекты, кейсы, UX/UI решения и визуальные концепции.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${geologica.className} antialiased`}>
        <SiteBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}

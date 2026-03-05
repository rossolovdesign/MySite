import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SiteBackground } from '@/components/SiteBackground'
import { CustomCursor } from '@/components/CustomCursor'
import { getSiteUrl } from '@/lib/site'
import { DEFAULT_OG_TITLE, DEFAULT_OG_DESCRIPTION, DEFAULT_SITE_NAME } from '@/lib/metadata'
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
  applicationName: DEFAULT_SITE_NAME,
  title: DEFAULT_OG_TITLE,
  description: DEFAULT_OG_DESCRIPTION,
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
    siteName: DEFAULT_SITE_NAME,
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
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

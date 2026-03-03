import type { Metadata } from 'next'
import { Geologica } from 'next/font/google'
import { SiteBackground } from '@/components/SiteBackground'
import './globals.css'

const geologica = Geologica({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Иван Россолов — Продуктовый Дизайнер',
  description: 'Product designer portfolio with design case studies',
  generator: 'v0.app',
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

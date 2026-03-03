const DEFAULT_SITE_URL = 'https://example.com'

function normalizeUrl(url: string) {
  if (!url) return DEFAULT_SITE_URL
  const trimmed = url.trim()
  if (!trimmed) return DEFAULT_SITE_URL
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.replace(/\/+$/, '')
}

export function getSiteUrl() {
  return normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      DEFAULT_SITE_URL
  )
}


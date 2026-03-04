const DEFAULT_SITE_URL = 'https://rossolovedesign.ru'

function normalizeUrl(url: string) {
  if (!url) return DEFAULT_SITE_URL

  let normalized = url.trim()
  if (!normalized) return DEFAULT_SITE_URL

  // Частый кейс ручного ввода: https//domain.com (без двоеточия).
  normalized = normalized.replace(/^https\/\//i, 'https://').replace(/^http\/\//i, 'http://')

  const withProtocol = /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`

  try {
    const parsed = new URL(withProtocol)
    const protocol = parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.protocol : 'https:'
    return `${protocol}//${parsed.host}`
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function getSiteUrl() {
  return normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      DEFAULT_SITE_URL
  )
}


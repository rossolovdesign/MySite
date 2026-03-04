import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'
import { getProjectsByLocale } from '@/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const projects = await getProjectsByLocale('ru')
  const now = new Date()

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = []
  const projectRoutesEn: MetadataRoute.Sitemap = []

  projects.forEach((project) => {
    const slug = project.slug?.current
    if (!slug) return

    const lastModified = project.date ? new Date(project.date) : now
    projectRoutes.push({
      url: `${siteUrl}/projects/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    projectRoutesEn.push({
      url: `${siteUrl}/en/projects/${slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  return [...routes, ...projectRoutes, ...projectRoutesEn]
}


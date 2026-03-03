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

  const projectRoutes = projects
    .filter((project) => Boolean(project.slug?.current))
    .map((project) => ({
      url: `${siteUrl}/projects/${project.slug.current}`,
      lastModified: project.date ? new Date(project.date) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const projectRoutesEn = projects
    .filter((project) => Boolean(project.slug?.current))
    .map((project) => ({
      url: `${siteUrl}/en/projects/${project.slug.current}`,
      lastModified: project.date ? new Date(project.date) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [...routes, ...projectRoutes, ...projectRoutesEn]
}


import { client } from './client'
import type { Locale } from '@/lib/i18n'

export interface Scene {
  _id: string
  title: string
  description?: string
  mediaType?: 'image' | 'gif' | 'lottie'
  mediaFileUrl?: string
}

export interface Project {
  _id: string
  title: string
  slug: {
    current: string
  }
  shortDescription?: string
  date?: string
  tags?: string[]
  thumbnail?: {
    asset: {
      _id: string
      url: string
      metadata?: { dimensions?: { width: number; height: number } }
    }
  }
  collaboration?: {
    url: string
    title: string
  }
  scenes?: Scene[]
}

export async function getProjects(): Promise<Project[]> {
  try {
    const query = `*[_type == "project"] | order(order desc, date desc) {
      _id,
      title,
      slug,
      shortDescription,
      date,
      tags,
      "thumbnail": thumbnail {
        asset-> {
          _id,
          url,
          metadata { dimensions { width, height } }
        }
      },
      "collaboration": collaboration {
        "url": url,
        "title": coalesce(titleRu, titleEn)
      }
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getProjectsByLocale(locale: Locale = 'ru'): Promise<Project[]> {
  try {
    const titleExpr = locale === 'en' ? 'coalesce(titleEn, title)' : 'title'
    const shortDescriptionExpr = locale === 'en' ? 'coalesce(shortDescriptionEn, shortDescription)' : 'shortDescription'
    const tagsExpr = locale === 'en' ? 'coalesce(tagsEn, tags)' : 'tags'

    const query = `*[_type == "project"] | order(order desc, date desc) {
      _id,
      "title": ${titleExpr},
      slug,
      "shortDescription": ${shortDescriptionExpr},
      date,
      "tags": ${tagsExpr},
      "thumbnail": thumbnail {
        asset-> {
          _id,
          url,
          metadata { dimensions { width, height } }
        }
      },
      "collaboration": collaboration {
        "url": url,
        "title": ${locale === 'en' ? 'coalesce(titleEn, titleRu)' : 'coalesce(titleRu, titleEn)'}
      }
    }`

    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching localized projects:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      shortDescription,
      date,
      tags,
      "thumbnail": thumbnail {
        asset-> {
          _id,
          url,
          metadata { dimensions { width, height } }
        }
      },
      "collaboration": collaboration {
        "url": url,
        "title": coalesce(titleRu, titleEn)
      },
      scenes[]-> {
        _id,
        title,
        description,
        mediaType,
        "mediaFileUrl": mediaFile.asset->url
      }
    }`
    
    return await client.fetch(query, { slug })
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function getProjectBySlugAndLocale(slug: string, locale: Locale = 'ru'): Promise<Project | null> {
  try {
    const titleExpr = locale === 'en' ? 'coalesce(titleEn, title)' : 'title'
    const shortDescriptionExpr = locale === 'en' ? 'coalesce(shortDescriptionEn, shortDescription)' : 'shortDescription'
    const tagsExpr = locale === 'en' ? 'coalesce(tagsEn, tags)' : 'tags'
    const sceneTitleExpr = locale === 'en' ? 'coalesce(titleEn, title)' : 'title'
    const sceneDescriptionExpr = locale === 'en' ? 'coalesce(descriptionEn, description)' : 'description'
    const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      "title": ${titleExpr},
      slug,
      "shortDescription": ${shortDescriptionExpr},
      date,
      "tags": ${tagsExpr},
      "thumbnail": thumbnail {
        asset-> {
          _id,
          url,
          metadata { dimensions { width, height } }
        }
      },
      "collaboration": collaboration {
        "url": url,
        "title": ${locale === 'en' ? 'coalesce(titleEn, titleRu)' : 'coalesce(titleRu, titleEn)'}
      },
      scenes[]-> {
        _id,
        "title": ${sceneTitleExpr},
        "description": ${sceneDescriptionExpr},
        mediaType,
        "mediaFileUrl": mediaFile.asset->url
      }
    }`

    return await client.fetch(query, { slug })
  } catch (error) {
    console.error('Error fetching localized project:', error)
    return null
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    const query = `*[_type == "project" && defined(slug.current)].slug.current`
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching project slugs:', error)
    return []
  }
}

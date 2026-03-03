import { client } from './client'
import type { Locale } from '@/lib/i18n'

export interface Scene {
  _id: string
  title: string
  description?: string
  image: {
    asset: {
      _id: string
      url: string
      metadata?: { dimensions?: { width: number; height: number } }
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
  order?: number
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
  scenes?: Scene[]
}

export async function getProjects(): Promise<Project[]> {
  try {
    const query = `*[_type == "project"] | order(date desc) {
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

    const query = `*[_type == "project"] | order(date desc) {
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
      scenes[]-> {
        _id,
        title,
        description,
        "image": image {
          asset-> {
            _id,
            url,
            metadata { dimensions { width, height } }
          },
          hotspot
        },
        order
      } | order(order asc)
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
      scenes[]-> {
        _id,
        "title": ${sceneTitleExpr},
        "description": ${sceneDescriptionExpr},
        "image": image {
          asset-> {
            _id,
            url,
            metadata { dimensions { width, height } }
          },
          hotspot
        },
        order
      } | order(order asc)
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

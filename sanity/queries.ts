import { client } from './client'

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

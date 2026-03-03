'use client'

import { Project } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const thumbnailUrl = project.thumbnail ? urlFor(project.thumbnail).width(400).height(300).url() : null
  const date = project.date ? new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : null

  return (
    <Link href={`/projects/${project.slug.current}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-[4/3]">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700">{project.title}</h3>
          {date && <time className="text-sm text-neutral-500 flex-shrink-0">{date}</time>}
        </div>
        {project.description && (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{project.description}</p>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

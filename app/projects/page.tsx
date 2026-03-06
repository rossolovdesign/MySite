import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjectsByLocale } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { ProjectCardImage } from '@/components/ProjectCardImage'
import { ProjectsPageClient } from '@/components/ProjectsPageClient'
import { DEFAULT_OG_TITLE, DEFAULT_OG_DESCRIPTION } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Проекты | Иван Россолов',
  description: DEFAULT_OG_DESCRIPTION,
  alternates: {
    canonical: '/projects',
    languages: {
      ru: '/projects',
      en: '/en/projects',
    },
  },
  openGraph: {
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
    url: '/projects',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
  },
}

export const revalidate = 30

export default async function ProjectsPage() {
  const projects = await getProjectsByLocale('ru')

  return (
    <ProjectsPageClient>
      {/* Projects Grid */}
      <div className="flex-1 w-full">
          <div className="w-full px-4 pt-4 pb-6 md:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {projects.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 rounded-2xl bg-white/5 backdrop-blur-sm p-8">
                    <p className="text-white font-light text-lg">
                      Проекты пока не добавлены. Откройте <span className="text-white font-light">/studio</span> и создайте первый проект в Sanity.
                    </p>
                  </div>
                ) : (
                  projects.map((project, index) => {
                    const imageUrl = project.thumbnail
                      ? urlFor(project.thumbnail).width(1000).height(700).quality(80).url()
                      : null

                    return (
                      <Link
                        key={project._id}
                        href={`/projects/${project.slug.current}`}
                        prefetch={false}
                        className="group relative bg-[#333333] border border-white/30 rounded-[20px] overflow-hidden hover:bg-[#AFFC41] hover:border-[#AFFC41] active:bg-[#AFFC41] active:border-[#AFFC41] transition-all duration-300 animate-in fade-in flex flex-col h-full hover:scale-[1.04] active:scale-[1.04]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* 1. Картинка */}
                        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-[#5a5a5a] to-[#333333] group-hover:from-[#AFFC41] group-hover:to-[#AFFC41] transition-colors flex-shrink-0">
                          <ProjectCardImage
                            imageUrl={imageUrl}
                            alt={project.title}
                            priority={index === 0}
                          />
                        </div>

                        {/* 2. Краткое описание и 3. Бейджи */}
                        <div className="p-5 flex flex-col flex-1 gap-3">
                          <h3 className="text-white font-light text-xl leading-custom group-hover:text-[#00060A] transition-colors">{project.title}</h3>
                          {project.shortDescription && (
                            <p className="text-white font-light text-sm leading-snug line-clamp-2 flex-1 group-hover:text-[#00060A] transition-colors">
                              {project.shortDescription}
                            </p>
                          )}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2.5 py-1 rounded-full bg-[#FF99E5] text-[#00060A] font-light uppercase whitespace-nowrap group-hover:bg-[#00060A] group-hover:text-[#AFFC41] transition-colors"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
    </ProjectsPageClient>
  )
}

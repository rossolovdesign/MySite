import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjectsByLocale } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { ProjectCardImage } from '@/components/ProjectCardImage'
import { ProjectsPageClient } from '@/components/ProjectsPageClient'

export const metadata: Metadata = {
  title: 'Projects | Иван Россолов — Продуктовый Дизайнер',
  description: 'Подборка проектов и кейсов: продуктовый дизайн, UX/UI, визуальные решения и прототипы.',
  alternates: {
    canonical: '/projects',
    languages: {
      ru: '/projects',
      en: '/en/projects',
    },
  },
  openGraph: {
    title: 'Projects | Иван Россолов — Продуктовый Дизайнер',
    description: 'Подборка проектов и кейсов: продуктовый дизайн, UX/UI, визуальные решения и прототипы.',
    url: '/projects',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Иван Россолов — Продуктовый Дизайнер',
    description: 'Подборка проектов и кейсов: продуктовый дизайн, UX/UI, визуальные решения и прототипы.',
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
                  <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
                    <p className="text-white/70 font-thin text-lg">
                      Проекты пока не добавлены. Откройте <span className="text-white font-thin">/studio</span> и создайте первый проект в Sanity.
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
                        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[20px] overflow-hidden hover:bg-[#affc41]/10 hover:border-[#affc41] active:bg-[#affc41]/10 active:border-[#affc41] transition-all duration-300 animate-in fade-in flex flex-col h-full hover:scale-[1.04] active:scale-[1.04]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* 1. Картинка */}
                        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-[#003d5c] to-[#00060a] flex-shrink-0">
                          <ProjectCardImage
                            imageUrl={imageUrl}
                            alt={project.title}
                            priority={index === 0}
                          />
                        </div>

                        {/* 2. Краткое описание и 3. Бейджи */}
                        <div className="p-5 flex flex-col flex-1 gap-3">
                          <h3 className="text-white font-thin text-xl leading-custom">{project.title}</h3>
                          {project.shortDescription && (
                            <p className="text-white/60 font-thin text-sm leading-snug line-clamp-2 flex-1">
                              {project.shortDescription}
                            </p>
                          )}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2.5 py-1 rounded-full border border-white/30 bg-[#affc41] text-[#00060a] font-normal uppercase whitespace-nowrap"
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

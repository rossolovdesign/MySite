import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjectsByLocale } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { ProjectCardImage } from '@/components/ProjectCardImage'

export const metadata: Metadata = {
  title: 'Projects | Ivan Rossolov — Product Designer',
  description: 'Selected product design projects and case studies.',
  alternates: {
    canonical: '/en/projects',
    languages: {
      en: '/en/projects',
      ru: '/projects',
    },
  },
}

export const revalidate = 30

export default async function ProjectsPageEn() {
  const projects = await getProjectsByLocale('en')

  return (
    <main className="w-screen h-screen relative overflow-x-hidden overflow-y-auto scrollbar-hide">
      <div className="relative z-10 w-full flex flex-col min-h-full">
        <div className="sticky top-0 z-20 pt-[calc(2rem+env(safe-area-inset-top))] px-4 pb-2 flex-shrink-0 bg-[#00060a]">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/en"
              className="inline-flex h-9 lg:h-auto items-center gap-1 text-white/80 hover:text-[#affc41] active:text-[#affc41] transition-colors font-thin text-sm lg:text-lg"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Home
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="w-full px-4 pt-4 pb-6 md:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {projects.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
                    <p className="text-white/70 font-thin text-lg">No projects yet. Open <span className="text-white font-thin">/studio</span> and publish your first project in Sanity.</p>
                  </div>
                ) : (
                  projects.map((project, index) => {
                    const imageUrl = project.thumbnail ? urlFor(project.thumbnail).width(1000).height(700).quality(80).url() : null

                    return (
                      <Link
                        key={project._id}
                        href={`/en/projects/${project.slug.current}`}
                        prefetch={false}
                        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-[#affc41]/10 hover:border-[#affc41] transition-all duration-300 animate-in fade-in flex flex-col h-full hover:scale-[1.04]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-[#003d5c] to-[#00060a] flex-shrink-0">
                          <ProjectCardImage imageUrl={imageUrl} alt={project.title} priority={index === 0} />
                        </div>

                        <div className="p-5 flex flex-col flex-1 gap-3">
                          <h3 className="text-white font-thin text-xl leading-custom">{project.title}</h3>
                          {project.shortDescription && (
                            <p className="text-white/60 font-thin text-sm leading-snug line-clamp-2 flex-1">{project.shortDescription}</p>
                          )}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {project.tags.map((tag) => (
                                <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-[#affc41]/40 text-[#affc41] font-thin whitespace-nowrap">
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
      </div>
    </main>
  )
}


import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { ProjectScenes } from '@/components/ProjectScenes'

export const revalidate = 30

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const imageUrl = project.thumbnail ? urlFor(project.thumbnail).width(1600).height(1000).quality(85).url() : null

  return (
    <main className="w-screen min-h-screen relative overflow-x-hidden bg-[#00060a]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,#002033_0%,#00060a_100%)] pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <div className="pt-8 px-8 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-extralight text-2xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Проекты
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full px-6 md:px-8 py-8 md:py-14">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <div className="space-y-4">
                  <h1 className="text-white font-extralight text-4xl leading-custom">{project.title}</h1>
                  {project.description && (
                    <p className="text-white/70 font-extralight text-base leading-relaxed">{project.description}</p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-full border border-[#affc41]/40 text-[#affc41] font-extralight whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-white/5 border border-white/10">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={project.title} fill className="object-cover" priority />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#003d5c] to-[#00060a]" />
                  )}
                </div>
              </div>
            </div>

            {project.scenes && project.scenes.length > 0 && (
              <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8">
                <h2 className="text-white font-extralight text-2xl mb-6">Сцены</h2>
                <ProjectScenes scenes={project.scenes} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}


import Link from 'next/link'
import Image from 'next/image'
import { getProjects } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

export const metadata = {
  title: 'Projects | Иван Россолов — Продуктовый Дизайнер',
  description: 'Portfolio of design projects and case studies',
}

export const revalidate = 30

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="w-screen min-h-screen relative overflow-x-hidden bg-[#00060a]">
      {/* Background with radial gradient - Full coverage */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,#002033_0%,#00060a_100%)] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '95.24px 95.24px',
        }}
      />

      {/* Fade Shadow - Blue glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <svg
          width="1189"
          height="900"
          viewBox="0 0 1189 900"
          className="w-full h-full min-w-full min-h-full object-cover"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g filter="url(#filter0_f)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M538.249 235.939C613.131 222.335 694.095 207.717 757.437 249.909C831.059 298.948 883.824 380.752 888.287 469.098C892.924 560.906 861.254 667.214 780.759 711.608C705.658 753.027 620.778 685.482 538.249 662.148C489.142 648.263 442.284 636.842 402.647 604.7C356.9 567.605 303.489 527.901 300.176 469.098C296.773 408.691 343.23 359.639 386.456 317.305C429.094 275.548 479.53 246.606 538.249 235.939Z"
              fill="#00A1FF"
              fillOpacity="0.5"
            />
          </g>
          <defs>
            <filter
              id="filter0_f"
              x="0"
              y="-78"
              width="1188.73"
              height="1102.76"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col min-h-screen overflow-hidden">
        {/* Header with Back Button */}
        <div className="pt-8 px-8 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-extralight text-2xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Вернуться
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 w-full overflow-hidden">
          <div className="w-full px-6 md:px-8 py-6 md:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {projects.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
                    <p className="text-white/70 font-extralight text-lg">
                      Проекты пока не добавлены. Откройте <span className="text-white">/studio</span> и создайте первый проект в Sanity.
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
                        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 animate-in fade-in flex flex-col h-full"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Project Image Container */}
                        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-[#003d5c] to-[#00060a] flex-shrink-0">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0" />
                          )}
                        </div>

                        {/* Project Info */}
                        <div className="p-5 space-y-3 flex flex-col flex-1">
                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
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

                          {/* Title and Description */}
                          <div className="flex-1">
                            <h3 className="text-white font-extralight text-xl leading-custom mb-2">{project.title}</h3>
                            {project.description && (
                              <p className="text-white/60 font-extralight text-sm leading-custom line-clamp-2">
                                {project.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 rounded-full border border-[#affc41] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#affc41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 17L17 7M17 7H7m10 0V17"
                              />
                            </svg>
                          </div>
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

'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import type { Project, Scene } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

/** Радиус скругления для всех картинок проекта (обложка и сцены). */
const IMAGE_ROUNDING_PX = 32

const SECTION_GAP_PX = 32
/** Высота секции: видимая область минус 64px (сверху и снизу по 32px «выступа»). Учитываем отступы обёртки (2rem + 64px под скроллбар). */
const SECTION_HEIGHT_CSS = `calc(100vh - 2rem - 64px - 128px)`

/** Контейнер по размеру картинки (aspect ratio) со скруглениями. maxHeight можно задать (например "100%") для заполнения родителя. */
function CoverImageBox({
  imageUrl,
  alt,
  dimensions,
  defaultAspectRatio = 16 / 10,
  maxHeight,
}: {
  imageUrl: string | null
  alt: string
  dimensions?: { width: number; height: number }
  defaultAspectRatio?: number
  maxHeight?: string
}) {
  const aspectRatio = dimensions ? dimensions.width / dimensions.height : defaultAspectRatio
  const effectiveMaxH = maxHeight ?? 'calc(100vh - 2rem)'
  const widthFromHeight = `calc(${effectiveMaxH} * ${aspectRatio})`
  const boxStyle: React.CSSProperties = {
    aspectRatio: `${dimensions?.width ?? 16}/${dimensions?.height ?? 10}`,
    maxHeight: effectiveMaxH,
    width: `min(100%, ${widthFromHeight})`,
    minHeight: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    clipPath: `inset(0 round ${IMAGE_ROUNDING_PX}px)`,
    ...(imageUrl && {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
  }

  return (
    <div
      className="shrink-0 box-border max-w-full border-0 p-0 m-0"
      style={boxStyle}
      role={imageUrl ? 'img' : undefined}
      aria-label={imageUrl ? alt : undefined}
    />
  )
}

interface ProjectDetailViewProps {
  project: Project
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const sortedScenes = useMemo(() => {
    if (!project.scenes?.length) return []
    return [...project.scenes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [project.scenes])

  const sectionsCount = sortedScenes.length
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!sectionRefs.current.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        let maxEntry: IntersectionObserverEntry | null = null

        entries.forEach((entry) => {
          if (!maxEntry || entry.intersectionRatio > maxEntry.intersectionRatio) {
            maxEntry = entry
          }
        })

        if (maxEntry && maxEntry.isIntersecting) {
          const index = sectionRefs.current.findIndex((el) => el === maxEntry!.target)
          if (index !== -1) {
            setActiveIndex(index)
          }
        }
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionsCount])

  const activeScene: Scene | null = sortedScenes[activeIndex] ?? null

  const sectionTitles = useMemo(() => {
    return sortedScenes.map((s, i) => ({ index: i, label: s.title }))
  }, [sortedScenes])

  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index]
    if (el && leftRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (sortedScenes.length > 0 && sectionRefs.current[0] && leftRef.current) {
      sectionRefs.current[0].scrollIntoView({ block: 'start' })
    }
  }, [sortedScenes.length])

  return (
    <main className="h-screen w-screen flex overflow-hidden bg-[#00060a]">
      {/* Единый фон для левого и правого блока */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,#002033_0%,#00060a_100%)] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-1 min-w-0 h-full">
        {/* Left: scrollable images. Обёртка с безопасными отступами и вертикальными отступами под скроллбар (32px). */}
        <div className="flex-1 min-w-0 h-full flex flex-col pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] overflow-hidden">
          <div className="pt-8 pb-8 flex-1 min-h-0 flex flex-col overflow-hidden">
            <div
              ref={leftRef}
              className="scrollbar-project flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
              style={{ scrollSnapType: 'y mandatory' }}
            >
              {/* Секции: отступ 32px между фото всегда; при скролле сверху/снизу виден выступ соседнего; неактивный выступ затемнён */}
              {sortedScenes.map((scene, i) => {
                const sceneImageUrl = scene.image ? urlFor(scene.image).width(1600).height(1200).quality(85).url() : null
                const isActive = activeIndex === i
                return (
                  <section
                    key={scene._id}
                    ref={(el) => {
                      sectionRefs.current[i] = el
                    }}
                    className="relative w-full flex-shrink-0 flex items-center justify-center box-border"
                    style={{
                      scrollSnapAlign: 'start',
                      scrollMarginTop: i === 0 ? 0 : 64,
                      minHeight: SECTION_HEIGHT_CSS,
                      height: SECTION_HEIGHT_CSS,
                      marginBottom: `${SECTION_GAP_PX}px`,
                    }}
                  >
                    <CoverImageBox
                      imageUrl={sceneImageUrl}
                      alt={scene.title}
                      dimensions={scene.image?.asset?.metadata?.dimensions}
                      defaultAspectRatio={4 / 3}
                      maxHeight="100%"
                    />
                    {!isActive && (
                      <div
                        className="absolute inset-0 bg-black/50 pointer-events-none rounded-[32px]"
                        style={{ clipPath: 'inset(0 round 32px)' }}
                        aria-hidden
                      />
                    )}
                  </section>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: фиксированный блок + переключатель по заголовкам внизу */}
        <div className="hidden lg:flex flex-shrink-0 w-full max-w-md flex-col pt-[max(1.5rem,env(safe-area-inset-top))] px-8 pb-8 overflow-hidden scrollbar-project">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-extralight text-2xl mb-6"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Проекты
          </Link>

          <h1 className="text-white font-extralight text-4xl leading-custom">{project.title}</h1>

          <div className="mt-12 flex-1 min-h-0 overflow-y-auto overflow-x-hidden transition-opacity duration-300">
            {activeScene ? (
              <div className="space-y-4">
                <h2 className="text-white/90 font-extralight text-2xl leading-custom">{activeScene.title}</h2>
                {activeScene.description && (
                  <p className="text-white/70 font-extralight text-base leading-relaxed">{activeScene.description}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
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
              </div>
            )}
          </div>

          {/* Переключатель по заголовкам — вертикальный список */}
          {sectionTitles.length > 0 && (
            <nav className="flex flex-col gap-2 pt-6 mt-auto flex-shrink-0 border-t border-white/10">
              {sectionTitles.map(({ index, label }) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollToSection(index)}
                  className={`text-left font-extralight text-sm transition-colors hover:text-white ${
                    activeIndex === index ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Mobile: back link + bottom bar with current title */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-extralight text-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Проекты
        </Link>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-extralight text-lg">
          {activeScene ? activeScene.title : project.title}
        </p>
        {activeScene?.description && (
          <p className="text-white/70 font-extralight text-sm line-clamp-2 mt-1">
            {activeScene.description}
          </p>
        )}
      </div>
    </main>
  )
}

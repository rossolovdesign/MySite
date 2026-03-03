'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import type { Project, Scene } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

/** Радиус скругления для всех картинок проекта (обложка и сцены). */
const IMAGE_ROUNDING_PX = 32

const SECTION_GAP_PX = 32
/** Высота секции: меньше высоты скролл-области на 2×32px, чтобы были видны выступы соседних кадров (по 32px сверху и снизу). */
const SECTION_HEIGHT_CSS = 'calc(100% - 64px)'

/** Контейнер по размеру картинки (aspect ratio) со скруглениями. Пока картинка грузится — skeleton. */
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
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!imageUrl) {
      setLoaded(false)
      return
    }
    setLoaded(false)
  }, [imageUrl])

  const aspectRatio = dimensions ? dimensions.width / dimensions.height : defaultAspectRatio
  // Максимальная высота: ограничиваем, чтобы на очень больших экранах контейнер не растягивался бесконечно.
  const effectiveMaxH = maxHeight ?? 'min(800px, calc(100vh - 4rem))'
  const widthFromHeight = `calc(${effectiveMaxH} * ${aspectRatio})`
  const boxStyle: React.CSSProperties = {
    aspectRatio: `${dimensions?.width ?? 16}/${dimensions?.height ?? 10}`,
    maxHeight: effectiveMaxH,
    width: `min(100%, ${widthFromHeight})`,
    minHeight: 0,
    // Фиксируем максимальную ширину контента, чтобы контейнер скелетона не растягивался на весь экран.
    maxWidth: 'min(100%, 1400px)',
    overflow: 'hidden',
    clipPath: `inset(0 round ${IMAGE_ROUNDING_PX}px)`,
    ...(imageUrl && {
      backgroundImage: `url(${imageUrl})`,
      // Картинка целиком помещается в контейнере со скруглениями, без обрезки по краям.
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
  }

  const showSkeleton = imageUrl && !loaded

  return (
    <div
      className="shrink-0 box-border max-w-full border-0 p-0 m-0 relative"
      style={{
        ...boxStyle,
        // Размер контейнера строго по пропорциям фото, без растягивания по секции — скелетон и скругления совпадают с фоткой.
        alignSelf: 'center',
      }}
      role={imageUrl ? 'img' : undefined}
      aria-label={imageUrl ? alt : undefined}
    >
      {showSkeleton && (
        <div
          className="absolute inset-0 skeleton-image transition-opacity duration-300"
          style={{ clipPath: `inset(0 round ${IMAGE_ROUNDING_PX}px)` }}
          aria-hidden
        />
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
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
    if (!sectionRefs.current.length || !leftRef.current) return

    const rootEl = leftRef.current

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
        root: rootEl,
        threshold: [0.7],
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
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const prevActiveIndex = useRef<number | null>(null)

  // Начальное положение скролла полностью вверху (scrollTop = 0).
  useEffect(() => {
    if (leftRef.current) leftRef.current.scrollTop = 0
  }, [])

  // Доскраливание: когда активная сцена переключилась по скроллу, мягко центрируем её (не на первом рендере).
  useEffect(() => {
    if (!sortedScenes.length) return
    if (prevActiveIndex.current === null) {
      prevActiveIndex.current = activeIndex
      return
    }
    if (prevActiveIndex.current === activeIndex) return
    prevActiveIndex.current = activeIndex
    const id = requestAnimationFrame(() => scrollToSection(activeIndex))
    return () => cancelAnimationFrame(id)
  }, [activeIndex])

  return (
    <main className="h-screen w-screen flex overflow-hidden">
      <div className="relative z-10 flex flex-1 min-w-0 h-full">
        {/* Left: scrollable images. Горизонтальные безопасные отступы. */}
        <div className="flex-1 min-w-0 h-full flex flex-col pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div
              ref={leftRef}
              className="scrollbar-hide flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2"
              style={{}}
            >
              {/* Секции: первая имеет безопасный отступ 32px сверху, между фото — 32px; при скролле видны выступы соседних кадров. */}
              {sortedScenes.map((scene, i) => {
                const sceneImageUrl = scene.image ? urlFor(scene.image).width(1600).height(1200).quality(85).url() : null
                const isActive = activeIndex === i
                const isFirst = i === 0
                const isLast = i === sortedScenes.length - 1
                return (
                  <section
                    key={scene._id}
                    ref={(el) => {
                      sectionRefs.current[i] = el
                    }}
                    className="relative w-full flex-shrink-0 flex items-center justify-center box-border"
                    style={{
                      minHeight: SECTION_HEIGHT_CSS,
                      height: SECTION_HEIGHT_CSS,
                      marginTop: isFirst ? SECTION_GAP_PX : 0,
                      marginBottom: isLast ? SECTION_GAP_PX : SECTION_GAP_PX,
                    }}
                    onClick={() => scrollToSection(i)}
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
        <div className="hidden lg:flex flex-shrink-0 w-full max-w-md flex-col pt-[max(1.5rem,env(safe-area-inset-top))] px-8 pb-8 overflow-hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-thin text-2xl mb-6"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Проекты
          </Link>

          <h1 className="text-white font-semibold text-4xl leading-custom">{project.title}</h1>

          <div className="mt-12 flex-1 min-h-0 overflow-y-auto overflow-x-hidden transition-opacity duration-300 scrollbar-hide">
            {activeScene ? (
              <div className="space-y-4">
                <h2 className="text-white/90 font-thin text-2xl leading-custom">{activeScene.title}</h2>
                {activeScene.description && (
                  <p className="text-white/70 font-thin text-base leading-relaxed">{activeScene.description}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full border border-[#affc41]/40 text-[#affc41] font-thin whitespace-nowrap"
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
                  className={`text-left font-thin text-sm transition-colors hover:text-white ${
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
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-thin text-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Проекты
        </Link>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-thin text-lg">
          {activeScene ? activeScene.title : project.title}
        </p>
        {activeScene?.description && (
          <p className="text-white/70 font-thin text-sm line-clamp-2 mt-1">
            {activeScene.description}
          </p>
        )}
      </div>
    </main>
  )
}

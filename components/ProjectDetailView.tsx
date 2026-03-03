'use client'

import { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import type { Project, Scene } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

/** Радиус скругления для всех картинок проекта (обложка и сцены). */
const IMAGE_ROUNDING_PX = 32

const SECTION_GAP_PX = 32
const SECTION_PEEK_PX = 32
/**
 * Для центральной карточки должны одновременно выполняться:
 * - между карточками gap = 32px
 * - видимый кусочек соседей = 32px сверху и снизу
 * => высота активной секции: H - 2 * (gap + peek) = H - 128px
 */
const SECTION_HEIGHT_CSS = `calc(100% - ${2 * (SECTION_GAP_PX + SECTION_PEEK_PX)}px)`
const SECTION_HEIGHT_VH_CSS = `calc(100vh - ${2 * (SECTION_GAP_PX + SECTION_PEEK_PX)}px)`
const MOBILE_SCROLL_MARGIN_TOP_CSS = 'calc(80px + env(safe-area-inset-top))'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Контейнер по размеру картинки (aspect ratio) со скруглениями. Пока картинка грузится — skeleton. */
const CoverImageBox = memo(function CoverImageBox({
  imageUrl,
  alt,
  dimensions,
  defaultAspectRatio = 16 / 10,
  maxHeight,
  dimmed = false,
  onOpenImage,
}: {
  imageUrl: string | null
  alt: string
  dimensions?: { width: number; height: number }
  defaultAspectRatio?: number
  maxHeight?: string
  dimmed?: boolean
  onOpenImage?: (imageUrl: string, alt: string) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [measuredAspectRatio, setMeasuredAspectRatio] = useState<number | null>(null)

  useEffect(() => {
    if (!imageUrl) {
      setLoaded(false)
      setMeasuredAspectRatio(null)
      return
    }
    setLoaded(false)
    setMeasuredAspectRatio(null)
  }, [imageUrl])

  const aspectRatio = measuredAspectRatio ?? (dimensions ? dimensions.width / dimensions.height : defaultAspectRatio)
  // Максимальная высота: ограничиваем, чтобы на очень больших экранах контейнер не растягивался бесконечно.
  const effectiveMaxH = maxHeight ?? 'min(800px, calc(100vh - 4rem))'
  const widthFromHeight = `calc(${effectiveMaxH} * ${aspectRatio})`
  const boxStyle: React.CSSProperties = {
    aspectRatio: `${aspectRatio}`,
    maxHeight: effectiveMaxH,
    width: `min(100%, ${widthFromHeight})`,
    minHeight: 0,
    overflow: 'hidden',
    borderRadius: IMAGE_ROUNDING_PX,
  }

  const showSkeleton = imageUrl && !loaded

  return (
    <div
      className={`shrink-0 box-border max-w-full border-0 p-0 m-0 relative ${imageUrl && onOpenImage ? 'cursor-zoom-in' : ''}`}
      style={{
        ...boxStyle,
        // Размер контейнера строго по пропорциям фото, без растягивания по секции — скелетон и скругления совпадают с фоткой.
        alignSelf: 'center',
      }}
      role={imageUrl ? 'img' : undefined}
      aria-label={imageUrl ? alt : undefined}
      onClick={(event) => {
        if (!onOpenImage || !imageUrl) return
        event.stopPropagation()
        onOpenImage(imageUrl, alt)
      }}
    >
      {showSkeleton && (
        <div
          className="absolute inset-0 skeleton-image transition-opacity duration-300"
          aria-hidden
        />
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain"
          loading={dimmed ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={(event) => {
            const img = event.currentTarget
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              setMeasuredAspectRatio(img.naturalWidth / img.naturalHeight)
            }
            setLoaded(true)
          }}
        />
      )}
      <div
        className={`absolute inset-0 bg-black/50 pointer-events-none transition-opacity duration-300 ${
          dimmed ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      />
    </div>
  )
})

CoverImageBox.displayName = 'CoverImageBox'

interface ProjectDetailViewProps {
  project: Project
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isDesktopLayout, setIsDesktopLayout] = useState(false)

  const sortedScenes = useMemo(() => {
    if (!project.scenes?.length) return []
    return [...project.scenes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [project.scenes])

  const preparedScenes = useMemo(
    () =>
      sortedScenes.map((scene) => ({
        ...scene,
        imageUrl: scene.image ? urlFor(scene.image).width(1600).quality(85).url() : null,
      })),
    [sortedScenes]
  )

  const sectionsCount = preparedScenes.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null)
  const [lightboxTitle, setLightboxTitle] = useState('')
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 })
  const [isPanningLightbox, setIsPanningLightbox] = useState(false)
  const lightboxPanStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number } | null>(null)
  const panRafRef = useRef<number | null>(null)
  const pendingPanRef = useRef<{ x: number; y: number } | null>(null)
  const wheelZoomRafRef = useRef<number | null>(null)
  const pendingWheelDirectionRef = useRef<-1 | 0 | 1>(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktopLayout(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!sectionRefs.current.length || !leftRef.current) return

    const rootEl = leftRef.current
    const threshold = isDesktopLayout ? 0.55 : 0.2

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
            setActiveIndex((prev) => (prev === index ? prev : index))
          }
        }
      },
      {
        root: rootEl,
        threshold: [threshold],
      }
    )

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionsCount, isDesktopLayout])

  const activeScene: Scene | null = preparedScenes[activeIndex] ?? null

  const sectionTitles = useMemo(() => {
    return preparedScenes.map((s, i) => ({ index: i, label: s.title }))
  }, [preparedScenes])

  const autoScrollRef = useRef(false)
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollAnimationRef = useRef<number | null>(null)

  const cancelScrollAnimation = useCallback(() => {
    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = null
    }
    autoScrollRef.current = false
  }, [])

  const scrollToSection = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = sectionRefs.current[index]
    if (el && leftRef.current) {
      const rootEl = leftRef.current
      const block: ScrollLogicalPosition =
        !isDesktopLayout ? 'start' : index === 0 ? 'start' : index === preparedScenes.length - 1 ? 'end' : 'center'
      const rootRect = rootEl.getBoundingClientRect()
      const sectionRect = el.getBoundingClientRect()
      const currentScrollTop = rootEl.scrollTop
      const maxScrollTop = rootEl.scrollHeight - rootEl.clientHeight

      let delta = 0
      if (block === 'start') {
        delta = sectionRect.top - rootRect.top
      } else if (block === 'end') {
        delta = sectionRect.bottom - rootRect.bottom
      } else {
        const sectionCenter = sectionRect.top + sectionRect.height / 2
        const rootCenter = rootRect.top + rootRect.height / 2
        delta = sectionCenter - rootCenter
      }
      const targetScrollTop = clamp(currentScrollTop + delta, 0, maxScrollTop)

      if (behavior === 'auto') {
        cancelScrollAnimation()
        rootEl.scrollTop = targetScrollTop
        return
      }

      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cancelScrollAnimation()
        rootEl.scrollTop = targetScrollTop
        return
      }

      cancelScrollAnimation()
      autoScrollRef.current = true
      const startScrollTop = rootEl.scrollTop
      const distance = targetScrollTop - startScrollTop
      const durationMs = clamp(Math.abs(distance) * 0.55, 260, 720)
      const startTime = performance.now()
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = clamp(elapsed / durationMs, 0, 1)
        rootEl.scrollTop = startScrollTop + distance * easeInOutCubic(progress)

        if (progress < 1) {
          scrollAnimationRef.current = requestAnimationFrame(step)
        } else {
          scrollAnimationRef.current = null
          autoScrollRef.current = false
        }
      }

      scrollAnimationRef.current = requestAnimationFrame(step)
    }
  }, [preparedScenes.length, isDesktopLayout, cancelScrollAnimation])

  const goToSection = useCallback((index: number) => {
    const safeIndex = Math.max(0, Math.min(index, preparedScenes.length - 1))
    setActiveIndex((prev) => (prev === safeIndex ? prev : safeIndex))
    scrollToSection(safeIndex, 'smooth')
  }, [scrollToSection, preparedScenes.length])

  const hasPrevScene = activeIndex > 0
  const hasNextScene = activeIndex < preparedScenes.length - 1
  const isLightboxOpen = Boolean(lightboxImageUrl)
  const canPanLightbox = lightboxZoom > 1.01

  const closeLightbox = useCallback(() => {
    setLightboxImageUrl(null)
    setLightboxTitle('')
    setLightboxZoom(1)
    setLightboxPan({ x: 0, y: 0 })
    setIsPanningLightbox(false)
    lightboxPanStartRef.current = null
    if (panRafRef.current !== null) {
      cancelAnimationFrame(panRafRef.current)
      panRafRef.current = null
    }
    if (wheelZoomRafRef.current !== null) {
      cancelAnimationFrame(wheelZoomRafRef.current)
      wheelZoomRafRef.current = null
    }
    pendingPanRef.current = null
    pendingWheelDirectionRef.current = 0
  }, [])

  const openLightbox = useCallback((imageUrl: string, title: string) => {
    setLightboxImageUrl(imageUrl)
    setLightboxTitle(title)
    setLightboxZoom(1)
    setLightboxPan({ x: 0, y: 0 })
    setIsPanningLightbox(false)
    lightboxPanStartRef.current = null
  }, [])

  const handleOpenSceneImage = useCallback(
    (imageUrl: string, title: string) => {
      if (isDesktopLayout) return
      openLightbox(imageUrl, title)
    },
    [isDesktopLayout, openLightbox]
  )

  const zoomIn = useCallback(() => {
    setLightboxZoom((prev) => Math.min(3, prev + 0.25))
  }, [])

  const zoomOut = useCallback(() => {
    setLightboxZoom((prev) => Math.max(1, prev - 0.25))
  }, [])

  const schedulePanUpdate = useCallback((nextPan: { x: number; y: number }) => {
    pendingPanRef.current = nextPan
    if (panRafRef.current !== null) return
    panRafRef.current = requestAnimationFrame(() => {
      panRafRef.current = null
      const next = pendingPanRef.current
      pendingPanRef.current = null
      if (!next) return
      setLightboxPan((prev) => (prev.x === next.x && prev.y === next.y ? prev : next))
    })
  }, [])

  const scheduleWheelZoom = useCallback(() => {
    if (wheelZoomRafRef.current !== null) return
    wheelZoomRafRef.current = requestAnimationFrame(() => {
      wheelZoomRafRef.current = null
      const direction = pendingWheelDirectionRef.current
      pendingWheelDirectionRef.current = 0
      if (direction === 0) return
      setLightboxZoom((prev) => clamp(prev + direction * 0.12, 1, 3))
    })
  }, [])

  useEffect(() => {
    if (!canPanLightbox) {
      setLightboxPan({ x: 0, y: 0 })
      setIsPanningLightbox(false)
      lightboxPanStartRef.current = null
    }
  }, [canPanLightbox])

  // Начальное положение скролла полностью вверху (scrollTop = 0).
  useEffect(() => {
    if (leftRef.current) leftRef.current.scrollTop = 0
  }, [])

  useEffect(() => {
    return () => {
      cancelScrollAnimation()
    }
  }, [cancelScrollAnimation])

  useEffect(() => {
    return () => {
      if (panRafRef.current !== null) {
        cancelAnimationFrame(panRafRef.current)
      }
      if (wheelZoomRafRef.current !== null) {
        cancelAnimationFrame(wheelZoomRafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isLightboxOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === '+' || event.key === '=') zoomIn()
      if (event.key === '-') zoomOut()
      if (event.key === '0') setLightboxZoom(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLightboxOpen, closeLightbox, zoomIn, zoomOut])

  useEffect(() => {
    if (!isLightboxOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isLightboxOpen])

  // Мягкий доскралл: после паузы в ручном скролле аккуратно прилипает к ближайшей секции.
  useEffect(() => {
    if (!isDesktopLayout) return
    const rootEl = leftRef.current
    if (!rootEl || !preparedScenes.length) return

    const snapToNearest = () => {
      if (!leftRef.current || !sectionRefs.current.length) return
      const rootRect = leftRef.current.getBoundingClientRect()
      const rootCenter = rootRect.top + rootRect.height / 2
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      sectionRefs.current.forEach((sectionEl, index) => {
        if (!sectionEl) return
        const rect = sectionEl.getBoundingClientRect()
        const sectionCenter = rect.top + rect.height / 2
        const distance = Math.abs(sectionCenter - rootCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      setActiveIndex((prev) => (prev === nearestIndex ? prev : nearestIndex))
      scrollToSection(nearestIndex, 'smooth')
    }

    const onScroll = () => {
      if (autoScrollRef.current) return
      if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current)
      scrollDebounceRef.current = setTimeout(snapToNearest, 140)
    }

    rootEl.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      rootEl.removeEventListener('scroll', onScroll)
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current)
        scrollDebounceRef.current = null
      }
    }
  }, [preparedScenes.length, scrollToSection, isDesktopLayout])

  useEffect(() => {
    if (!preparedScenes.length) {
      setActiveIndex(0)
      return
    }
    if (activeIndex > preparedScenes.length - 1) {
      setActiveIndex(preparedScenes.length - 1)
    }
  }, [preparedScenes.length, activeIndex])

  return (
    <main className="h-screen w-screen overflow-hidden">
      <div className="relative z-10 flex h-full">
        <div className="w-full">
          <div className="max-w-[1920px] mx-auto flex h-full">
            {/* Left: scrollable images. Горизонтальные безопасные отступы. */}
            <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <div
                  ref={leftRef}
                  className="scrollbar-hide flex-1 min-h-0 overflow-y-hidden lg:overflow-y-auto overflow-x-hidden pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] pt-[calc(72px+env(safe-area-inset-top))] pb-[calc(156px+env(safe-area-inset-bottom))] md:pl-[max(32px,env(safe-area-inset-left))] md:pr-[max(32px,env(safe-area-inset-right))] lg:pr-0 lg:pt-0 lg:pb-0"
                  style={{}}
                >
                  {/* Секции: первая имеет безопасный отступ 32px сверху, между фото — 32px; при скролле видны выступы соседних кадров. */}
                  {preparedScenes.map((scene, i) => {
                    const isActive = activeIndex === i
                    const isFirst = i === 0
                    const isLast = i === preparedScenes.length - 1
                    return (
                      <section
                        key={scene._id}
                        ref={(el) => {
                          sectionRefs.current[i] = el
                        }}
                        className="relative w-full flex-shrink-0 flex items-center justify-center box-border min-h-0 h-auto 2xl:min-h-[calc(100%-128px)] 2xl:h-[calc(100%-128px)]"
                        style={{
                          marginTop: isFirst ? SECTION_GAP_PX : 0,
                          marginBottom: isLast ? SECTION_GAP_PX : SECTION_GAP_PX,
                          scrollMarginTop: MOBILE_SCROLL_MARGIN_TOP_CSS,
                        }}
                        onClick={() => {
                          if (!isDesktopLayout) return
                          goToSection(i)
                        }}
                      >
                        <CoverImageBox
                          imageUrl={scene.imageUrl}
                          alt={scene.title}
                          dimensions={scene.image?.asset?.metadata?.dimensions}
                          defaultAspectRatio={4 / 3}
                          maxHeight={SECTION_HEIGHT_VH_CSS}
                          dimmed={!isActive}
                          onOpenImage={!isDesktopLayout ? handleOpenSceneImage : undefined}
                        />
                      </section>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: фиксированный блок + переключатель по заголовкам внизу */}
            <div className="hidden lg:flex flex-shrink-0 w-full max-w-md flex-col pt-[max(1.5rem,env(safe-area-inset-top))] pl-8 pr-8 pb-8 overflow-hidden">
              <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md px-5 py-4 mb-0">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-thin text-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Закрыть
                </Link>
                <h1 className="text-white font-thin text-lg leading-relaxed mt-2">{project.title}</h1>
              </div>

              <div className="mt-8 flex-1 min-h-0 overflow-y-auto overflow-x-hidden transition-opacity duration-300 scrollbar-hide">
                {activeScene ? (
                  <div className="space-y-4">
                    <h2 className="text-white font-thin text-3xl leading-custom">{activeScene.title}</h2>
                    {activeScene.description && (
                      <p className="text-white font-thin text-base leading-relaxed">{activeScene.description}</p>
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
                      onClick={() => goToSection(index)}
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
        </div>
      </div>

      {isLightboxOpen && lightboxImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр изображения"
        >
          <div className="hidden lg:flex absolute top-[max(12px,env(safe-area-inset-top))] right-[max(12px,env(safe-area-inset-right))] items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                zoomOut()
              }}
              className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 shadow-lg hover:bg-black/90"
              aria-label="Уменьшить"
            >
              -
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setLightboxZoom(1)
              }}
              className="h-10 px-3 rounded-full border border-white/60 text-white bg-black/75 shadow-lg hover:bg-black/90 text-sm"
              aria-label="Сбросить масштаб"
            >
              {Math.round(lightboxZoom * 100)}%
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                zoomIn()
              }}
              className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 shadow-lg hover:bg-black/90"
              aria-label="Увеличить"
            >
              +
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                closeLightbox()
              }}
              className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 shadow-lg hover:bg-black/90"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div
              className="mx-auto max-w-md rounded-full border border-white/20 bg-black/80 backdrop-blur-md p-3"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      zoomOut()
                    }}
                    className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 shadow-lg"
                    aria-label="Уменьшить"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setLightboxZoom(1)
                    }}
                    className="h-10 px-3 rounded-full border border-white/60 text-white bg-black/75 shadow-lg text-sm"
                    aria-label="Сбросить масштаб"
                  >
                    {Math.round(lightboxZoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      zoomIn()
                    }}
                    className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 shadow-lg"
                    aria-label="Увеличить"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    closeLightbox()
                  }}
                  className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 shadow-lg"
                  aria-label="Закрыть"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div
            className="h-full w-full overflow-auto p-4 md:p-8"
            onClick={(event) => event.stopPropagation()}
            onWheel={(event) => {
              if (!event.ctrlKey && Math.abs(event.deltaY) < 1) return
              event.preventDefault()
              pendingWheelDirectionRef.current = event.deltaY < 0 ? 1 : -1
              scheduleWheelZoom()
            }}
          >
            <div
              className={`min-h-full min-w-full flex items-center justify-center ${canPanLightbox ? (isPanningLightbox ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
              style={{ touchAction: canPanLightbox ? 'none' : 'auto' }}
              onPointerDown={(event) => {
                if (!canPanLightbox) return
                event.currentTarget.setPointerCapture(event.pointerId)
                setIsPanningLightbox(true)
                lightboxPanStartRef.current = {
                  pointerX: event.clientX,
                  pointerY: event.clientY,
                  startX: lightboxPan.x,
                  startY: lightboxPan.y,
                }
              }}
              onPointerMove={(event) => {
                if (!isPanningLightbox || !lightboxPanStartRef.current) return
                const deltaX = event.clientX - lightboxPanStartRef.current.pointerX
                const deltaY = event.clientY - lightboxPanStartRef.current.pointerY
                const maxX = ((window.innerWidth - 32) * (lightboxZoom - 1)) / 2
                const maxY = ((window.innerHeight - 32) * (lightboxZoom - 1)) / 2
                schedulePanUpdate({
                  x: clamp(lightboxPanStartRef.current.startX + deltaX, -maxX, maxX),
                  y: clamp(lightboxPanStartRef.current.startY + deltaY, -maxY, maxY),
                })
              }}
              onPointerUp={(event) => {
                if (!isPanningLightbox) return
                event.currentTarget.releasePointerCapture(event.pointerId)
                setIsPanningLightbox(false)
                lightboxPanStartRef.current = null
              }}
              onPointerCancel={(event) => {
                if (!isPanningLightbox) return
                event.currentTarget.releasePointerCapture(event.pointerId)
                setIsPanningLightbox(false)
                lightboxPanStartRef.current = null
              }}
            >
              <img
                src={lightboxImageUrl}
                alt={lightboxTitle}
                className="max-w-none select-none"
                style={{
                  transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${lightboxZoom})`,
                  transformOrigin: 'center center',
                  maxHeight: 'calc(100vh - 2rem)',
                  maxWidth: 'calc(100vw - 2rem)',
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile: bottom project card */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-8 bg-gradient-to-t from-black/90 via-black/55 to-transparent">
        <div className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md px-4 pt-3 pb-6">
          <div className="flex items-center justify-between gap-3 pb-8 border-b border-white/10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-white/70 active:text-white transition-colors font-thin text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Закрыть
            </Link>
            <p className="text-white/90 font-thin text-sm truncate text-right">{project.title}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white font-thin text-base truncate">
                {activeScene ? activeScene.title : project.title}
              </p>
              {preparedScenes.length > 0 && (
                <p className="text-white/50 font-thin text-xs mt-1">
                  {activeIndex + 1} / {preparedScenes.length}
                </p>
              )}
            </div>

            {preparedScenes.length > 1 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => goToSection(Math.max(activeIndex - 1, 0))}
                  disabled={!hasPrevScene}
                  className="h-9 w-9 rounded-full border border-white/20 text-white/85 disabled:opacity-35 disabled:cursor-not-allowed"
                  aria-label="Предыдущая сцена"
                >
                  <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => goToSection(Math.min(activeIndex + 1, preparedScenes.length - 1))}
                  disabled={!hasNextScene}
                  className="h-9 w-9 rounded-full border border-white/20 text-white/85 disabled:opacity-35 disabled:cursor-not-allowed"
                  aria-label="Следующая сцена"
                >
                  <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {activeScene?.description && (
            <p className="text-white/70 font-thin text-sm line-clamp-2 mt-2">
              {activeScene.description}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

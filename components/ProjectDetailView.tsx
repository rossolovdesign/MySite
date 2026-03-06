'use client'

import { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import type { Project, Scene } from '@/sanity/queries'
import type { Locale } from '@/lib/i18n'
import { clamp } from '@/lib/utils'

/** Радиус скругления для всех картинок проекта (обложка и сцены). */
const IMAGE_ROUNDING_PX = 32

const SECTION_GAP_PX = 32
const SECTION_PEEK_PX = 32
/** Активная карточка всегда на этой высоте от верхней границы экрана (px). */
const ACTIVE_CARD_OFFSET_PX = 120
/**
 * Для центральной карточки должны одновременно выполняться:
 * - между карточками gap = 32px
 * - видимый кусочек соседей = 32px сверху и снизу
 * => высота активной секции: H - 2 * (gap + peek) = H - 128px
 */
const SECTION_HEIGHT_VH_CSS = `calc(100vh - ${2 * (SECTION_GAP_PX + SECTION_PEEK_PX)}px)`
const MOBILE_SAFE_PAD_X_LEFT = 'max(16px, env(safe-area-inset-left))'
const MOBILE_SAFE_PAD_X_RIGHT = 'max(16px, env(safe-area-inset-right))'
const MOBILE_SAFE_PAD_BOTTOM = 'max(14px, env(safe-area-inset-bottom))'
const SWIPE_THRESHOLD = 60
type SceneMediaType = 'image' | 'gif' | 'lottie'

/** Контейнер по размеру картинки (aspect ratio) со скруглениями. Пока картинка грузится — skeleton. */
const CoverImageBox = memo(function CoverImageBox({
  mediaType = 'image',
  imageUrl,
  lottieFileUrl,
  alt,
  precomputedAspectRatio,
  defaultAspectRatio = 16 / 10,
  maxHeight,
  dimmed = false,
  onOpenImage,
  rounded = true,
}: {
  mediaType?: SceneMediaType
  imageUrl: string | null
  lottieFileUrl?: string | null
  alt: string
  precomputedAspectRatio?: number | null
  defaultAspectRatio?: number
  maxHeight?: string
  dimmed?: boolean
  onOpenImage?: (imageUrl: string, alt: string) => void
  /** На мобилке можно отключить скругления для картинки на всю ширину */
  rounded?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const [measuredAspectRatio, setMeasuredAspectRatio] = useState<number | null>(null)
  const lottieContainerRef = useRef<HTMLDivElement>(null)
  const isLottie = mediaType === 'lottie' && Boolean(lottieFileUrl)

  useEffect(() => {
    if (isLottie) {
      setLoaded(true)
      setMeasuredAspectRatio(null)
      return
    }
    if (!imageUrl) {
      setLoaded(false)
      setMeasuredAspectRatio(null)
      return
    }
    setLoaded(false)
    setMeasuredAspectRatio(null)
  }, [imageUrl, isLottie])

  useEffect(() => {
    if (!isLottie || !lottieFileUrl || !lottieContainerRef.current) return

    let disposed = false
    let animation: { destroy: () => void } | null = null

    const run = async () => {
      const lottie = await import('lottie-web')
      if (disposed || !lottieContainerRef.current) return
      animation = lottie.default.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: lottieFileUrl,
      })
      setLoaded(true)
    }

    run()

    return () => {
      disposed = true
      animation?.destroy()
    }
  }, [isLottie, lottieFileUrl])

  const aspectRatio = measuredAspectRatio ?? precomputedAspectRatio ?? defaultAspectRatio
  // Максимальная высота: ограничиваем, чтобы на очень больших экранах контейнер не растягивался бесконечно.
  const effectiveMaxH = maxHeight ?? 'min(800px, calc(100vh - 4rem))'
  const widthFromHeight = `calc(${effectiveMaxH} * ${aspectRatio})`
  const boxStyle: React.CSSProperties = {
    aspectRatio: `${aspectRatio}`,
    maxHeight: effectiveMaxH,
    width: `min(100%, ${widthFromHeight})`,
    minHeight: 0,
    overflow: 'hidden',
    borderRadius: rounded ? IMAGE_ROUNDING_PX : 0,
  }

  const showSkeleton = !isLottie && imageUrl && !loaded

  return (
    <div
      className={`shrink-0 box-border max-w-full border-0 p-0 m-0 relative ${!isLottie && imageUrl && onOpenImage ? 'cursor-zoom-in' : ''}`}
      style={{
        ...boxStyle,
        // Размер контейнера строго по пропорциям фото, без растягивания по секции — скелетон и скругления совпадают с фоткой.
        alignSelf: 'center',
      }}
      role={imageUrl || isLottie ? 'img' : undefined}
      aria-label={imageUrl || isLottie ? alt : undefined}
      onClick={(event) => {
        if (isLottie || !onOpenImage || !imageUrl) return
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
      {isLottie && lottieFileUrl && (
        <div
          ref={lottieContainerRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
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
  locale?: Locale
  projectsHref?: string
}

export function ProjectDetailView({
  project,
  locale = 'ru',
  projectsHref = '/projects',
}: ProjectDetailViewProps) {
  const copy = useMemo(
    () =>
      locale === 'en'
        ? {
            toProjects: 'To projects',
            closeImage: 'Close',
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out',
            resetZoom: 'Reset zoom',
            prevScene: 'Previous scene',
            nextScene: 'Next scene',
            imageDialog: 'Image preview',
            collaborationWith: 'As part of',
          }
        : {
            toProjects: 'К проектам',
            closeImage: 'Закрыть',
            zoomIn: 'Увеличить',
            zoomOut: 'Уменьшить',
            resetZoom: 'Сбросить масштаб',
            prevScene: 'Предыдущая сцена',
            nextScene: 'Следующая сцена',
            imageDialog: 'Просмотр изображения',
            collaborationWith: 'В составе',
          },
    [locale]
  )

  const leftRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isDesktopLayout, setIsDesktopLayout] = useState(false)

  const preparedScenes = useMemo(
    () =>
      (project.scenes ?? []).map((scene) => ({
        ...scene,
        sceneMediaType:
          scene.mediaType === 'lottie' || scene.mediaType === 'gif' || scene.mediaType === 'image'
            ? scene.mediaType
            : 'image',
        lottieFileUrl:
          (scene.mediaType === 'lottie'
            ? scene.mediaFileUrl ?? null
            : null),
        imageUrl:
          scene.mediaType === 'image' || scene.mediaType === 'gif'
            ? scene.mediaFileUrl ?? null
            : null,
      })),
    [project.scenes]
  )
  const [mediaAspectRatios, setMediaAspectRatios] = useState<Record<string, number>>({})

  useEffect(() => {
    const candidates = preparedScenes.filter(
      (scene) => scene.sceneMediaType !== 'lottie' && scene.imageUrl && !mediaAspectRatios[scene.imageUrl]
    )
    if (!candidates.length) return

    let cancelled = false
    const probes: HTMLImageElement[] = []
    candidates.forEach((scene) => {
      const src = scene.imageUrl
      if (!src) return
      const probe = new Image()
      probes.push(probe)
      probe.decoding = 'async'
      probe.onload = () => {
        if (cancelled || probe.naturalWidth <= 0 || probe.naturalHeight <= 0) return
        setMediaAspectRatios((prev) => {
          if (prev[src]) return prev
          return { ...prev, [src]: probe.naturalWidth / probe.naturalHeight }
        })
      }
      probe.src = src
    })

    return () => {
      cancelled = true
      probes.forEach((p) => {
        p.src = ''
      })
    }
  }, [preparedScenes, mediaAspectRatios])

  const sectionsCount = preparedScenes.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null)
  const [lightboxTitle, setLightboxTitle] = useState('')
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 })
  const [isPanningLightbox, setIsPanningLightbox] = useState(false)
  const lightboxPanStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number } | null>(null)

  // Swipe для мобильной версии: drag offset для анимации перелистывания
  const [mobileSwipeOffset, setMobileSwipeOffset] = useState(0)
  const [mobileGalleryWidth, setMobileGalleryWidth] = useState(0)
  const mobileSwipeStartRef = useRef<{ x: number; y: number } | null>(null)
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
    if (isDesktopLayout === false) return
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
            setActiveIndex((prev) => (prev === index ? prev : index))
          }
        }
      },
      {
        root: rootEl,
        threshold: [0.55],
      }
    )

    sectionRefs.current.slice(0, sectionsCount).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionsCount, isDesktopLayout])

  const activeScene: Scene | null = preparedScenes[activeIndex] ?? null

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
      const rootRect = rootEl.getBoundingClientRect()
      const sectionRect = el.getBoundingClientRect()
      const currentScrollTop = rootEl.scrollTop
      const maxScrollTop = rootEl.scrollHeight - rootEl.clientHeight

      // Все карточки: верх на ACTIVE_CARD_OFFSET_PX от верха экрана
      const delta = sectionRect.top - ACTIVE_CARD_OFFSET_PX
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
  }, [cancelScrollAnimation])

  const goToSection = useCallback((index: number) => {
    const safeIndex = Math.max(0, Math.min(index, preparedScenes.length - 1))
    setActiveIndex((prev) => (prev === safeIndex ? prev : safeIndex))
    if (isDesktopLayout) scrollToSection(safeIndex, 'smooth')
  }, [scrollToSection, preparedScenes.length, isDesktopLayout])

  const hasPrevScene = activeIndex > 0
  const hasNextScene = activeIndex < preparedScenes.length - 1
  const mobileGalleryRef = useRef<HTMLDivElement>(null)

  const handleMobileTouchStart = useCallback((e: React.TouchEvent) => {
    mobileSwipeStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleMobileTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!mobileSwipeStartRef.current || preparedScenes.length <= 1) return
      const dx = e.touches[0].clientX - mobileSwipeStartRef.current.x
      const dy = e.touches[0].clientY - mobileSwipeStartRef.current.y
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault()
        const maxDrag = 120
        const clamped = clamp(dx, -maxDrag, maxDrag)
        const offset =
          activeIndex === 0 && dx > 0
            ? clamped * 0.3
            : activeIndex === preparedScenes.length - 1 && dx < 0
              ? clamped * 0.3
              : clamped
        setMobileSwipeOffset(offset)
      }
    },
    [activeIndex, preparedScenes.length]
  )

  const handleMobileTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!mobileSwipeStartRef.current || preparedScenes.length <= 1) {
        setMobileSwipeOffset(0)
        mobileSwipeStartRef.current = null
        return
      }
      const dx = e.changedTouches[0].clientX - mobileSwipeStartRef.current.x
      if (dx > SWIPE_THRESHOLD && hasPrevScene) {
        goToSection(activeIndex - 1)
      } else if (dx < -SWIPE_THRESHOLD && hasNextScene) {
        goToSection(activeIndex + 1)
      }
      setMobileSwipeOffset(0)
      mobileSwipeStartRef.current = null
    },
    [activeIndex, hasPrevScene, hasNextScene, preparedScenes.length, goToSection]
  )

  useEffect(() => {
    const el = mobileGalleryRef.current
    if (!el) return
    el.addEventListener('touchmove', handleMobileTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleMobileTouchMove)
  }, [handleMobileTouchMove])

  useEffect(() => {
    const el = mobileGalleryRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      setMobileGalleryWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

  // Начальное положение: активная карточка на 120px от верха экрана.
  useEffect(() => {
    if (leftRef.current && preparedScenes.length > 0 && isDesktopLayout) {
      const t = requestAnimationFrame(() => {
        scrollToSection(0, 'auto')
      })
      return () => cancelAnimationFrame(t)
    }
    if (leftRef.current && !isDesktopLayout) leftRef.current.scrollTop = 0
  }, [isDesktopLayout, preparedScenes.length, scrollToSection])

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

  // Мягкий доскралл: после паузы в ручном скролле аккуратно прилипает к ближайшей секции. Только на десктопе.
  useEffect(() => {
    if (!isDesktopLayout) return
    const rootEl = leftRef.current
    if (!rootEl || !preparedScenes.length) return

    const snapToNearest = () => {
      if (!leftRef.current || !sectionRefs.current.length) return
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      sectionRefs.current.slice(0, preparedScenes.length).forEach((sectionEl, index) => {
        if (!sectionEl) return
        const rect = sectionEl.getBoundingClientRect()
        const distance = Math.abs(rect.top - ACTIVE_CARD_OFFSET_PX)

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
            {/* Left: images. Mobile — стопка (одна картинка), desktop — скролл. */}
            <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* Mobile: свайп-галерея на всю ширину без скруглений. Два бара фиксированы снизу. */}
                <div
                  ref={mobileGalleryRef}
                  className="lg:hidden flex-1 min-h-0 flex items-center justify-start overflow-hidden pt-[calc(2rem+env(safe-area-inset-top))] pb-[38vh] touch-pan-y w-full min-w-0"
                  onTouchStart={handleMobileTouchStart}
                  onTouchEnd={handleMobileTouchEnd}
                  onTouchCancel={handleMobileTouchEnd}
                >
                  <div
                    className="flex h-full items-center flex-nowrap"
                    style={{
                      width:
                        mobileGalleryWidth && preparedScenes.length
                          ? `${preparedScenes.length * mobileGalleryWidth + (preparedScenes.length - 1) * 16}px`
                          : '100%',
                      transform: mobileGalleryWidth && preparedScenes.length
                        ? `translateX(${-activeIndex * (mobileGalleryWidth + 16) + mobileSwipeOffset}px)`
                        : 'none',
                      transition: mobileSwipeOffset !== 0 ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    {preparedScenes.map((scene, i) => (
                      <div
                        key={scene._id}
                        className="flex h-full shrink-0 items-center justify-center"
                        style={{
                          width: mobileGalleryWidth ? `${mobileGalleryWidth}px` : '100%',
                          minWidth: mobileGalleryWidth ? `${mobileGalleryWidth}px` : '100%',
                          marginRight: i < preparedScenes.length - 1 ? 16 : 0,
                        }}
                      >
                        <CoverImageBox
                          mediaType={scene.sceneMediaType}
                          imageUrl={scene.imageUrl}
                          lottieFileUrl={scene.lottieFileUrl}
                          alt={scene.title}
                          precomputedAspectRatio={scene.imageUrl ? mediaAspectRatios[scene.imageUrl] ?? null : null}
                          defaultAspectRatio={4 / 3}
                          maxHeight={SECTION_HEIGHT_VH_CSS}
                          dimmed={activeIndex !== i}
                          onOpenImage={handleOpenSceneImage}
                          rounded={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop: скролл с секциями. Padding создаёт пустое пространство сверху/снизу для первой/последней карточки. */}
                <div
                  ref={leftRef}
                  className="hidden lg:block scrollbar-hide flex-1 min-h-0 overflow-y-auto overflow-x-hidden pl-[max(32px,env(safe-area-inset-left))] pr-0 pt-0 pb-0"
                >
                  <div
                    className="min-h-full flex flex-col"
                    style={{
                      paddingTop: ACTIVE_CARD_OFFSET_PX,
                      paddingBottom: `max(${ACTIVE_CARD_OFFSET_PX}px, calc(100vh - ${ACTIVE_CARD_OFFSET_PX}px))`,
                    }}
                  >
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
                        className="relative w-full flex-shrink-0 flex items-center justify-center box-border min-h-0 h-auto cursor-pointer"
                        style={{
                          marginTop: isFirst ? 0 : SECTION_GAP_PX,
                          marginBottom: isLast ? SECTION_GAP_PX : SECTION_GAP_PX,
                        }}
                        onClick={() => goToSection(i)}
                      >
                        <CoverImageBox
                          mediaType={scene.sceneMediaType}
                          imageUrl={scene.imageUrl}
                          lottieFileUrl={scene.lottieFileUrl}
                          alt={scene.title}
                          precomputedAspectRatio={scene.imageUrl ? mediaAspectRatios[scene.imageUrl] ?? null : null}
                          defaultAspectRatio={4 / 3}
                          maxHeight={SECTION_HEIGHT_VH_CSS}
                          dimmed={!isActive}
                          onOpenImage={undefined}
                        />
                      </section>
                    )
                  })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: контент сверху, карточка с кнопкой и заголовком внизу */}
            <div className="hidden lg:flex flex-shrink-0 w-full max-w-md flex-col pt-[max(120px,env(safe-area-inset-top))] pl-8 pr-8 pb-[48px] overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden transition-opacity duration-300 scrollbar-hide">
                {activeScene ? (
                  <div className="space-y-4">
                    <h2 className="text-white font-light text-3xl leading-custom">{activeScene.title}</h2>
                    {activeScene.description && (
                      <p className="text-white font-light text-base leading-relaxed">{activeScene.description}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-[#FF99E5] text-[#00060A] font-light uppercase whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 mt-8 rounded-[20px] border border-white/30 bg-[#333333] px-5 pt-8 pb-8">
                <Link
                  href={projectsHref}
                  className="inline-flex items-center gap-1 text-white/80 hover:text-[#affc41] transition-colors font-light text-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {copy.toProjects}
                </Link>
                <h1 className="text-white/95 font-light text-xl leading-snug mt-3">{project.title}</h1>
                {project.collaboration?.url && project.collaboration.title && (
                  <p className="mt-[2px] text-sm leading-relaxed text-white/70 font-light">
                    {copy.collaborationWith}{' '}
                    <a
                      href={project.collaboration.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#affc41] font-light underline decoration-[#affc41]/60 underline-offset-2 hover:text-white transition-colors"
                    >
                      {project.collaboration.title}
                    </a>
                  </p>
                )}
              </div>
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
          aria-label={copy.imageDialog}
        >
          <div className="hidden lg:flex absolute top-[max(12px,env(safe-area-inset-top))] right-[max(12px,env(safe-area-inset-right))] items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                zoomOut()
              }}
              className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 hover:bg-black/90"
              aria-label={copy.zoomOut}
            >
              -
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setLightboxZoom(1)
              }}
              className="h-10 px-3 rounded-full border border-white/60 text-white bg-black/75 hover:bg-black/90 text-sm"
              aria-label={copy.resetZoom}
            >
              {Math.round(lightboxZoom * 100)}%
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                zoomIn()
              }}
              className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 hover:bg-black/90"
              aria-label={copy.zoomIn}
            >
              +
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                closeLightbox()
              }}
              className="h-10 w-10 rounded-full border border-white/60 text-white bg-black/75 hover:bg-black/90"
              aria-label={copy.closeImage}
            >
              ✕
            </button>
          </div>

          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] pt-3 bg-gradient-to-t from-[#333333]/95 via-[#333333]/65 to-transparent"
            style={{
              paddingLeft: MOBILE_SAFE_PAD_X_LEFT,
              paddingRight: MOBILE_SAFE_PAD_X_RIGHT,
              paddingBottom: MOBILE_SAFE_PAD_BOTTOM,
            }}
          >
            <div
              className="mx-auto max-w-md rounded-full p-3 flex items-center justify-end gap-2"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  closeLightbox()
                }}
                className="h-10 w-10 rounded-full border border-white/60 text-white/90 bg-[#333333]/70"
                aria-label={copy.closeImage}
              >
                ✕
              </button>
            </div>
          </div>

          <div
            className="h-full w-full overflow-auto md:p-8"
            style={{
              paddingTop: 'max(16px, env(safe-area-inset-top))',
              paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
              paddingLeft: MOBILE_SAFE_PAD_X_LEFT,
              paddingRight: MOBILE_SAFE_PAD_X_RIGHT,
            }}
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

      {/* Mobile: два отдельных бара — контент сверху, контроллы и инфо снизу */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 flex flex-col gap-4 px-4 pb-4" style={{ paddingBottom: `max(16px, env(safe-area-inset-bottom))` }}>
        {/* Бар 1: контент сцены */}
        <div className="rounded-[20px] px-4 py-6 overflow-y-auto scrollbar-hide max-h-[25vh] min-h-0">
          <p className="text-white font-light text-lg leading-snug">
            {activeScene ? activeScene.title : project.title}
          </p>
          {activeScene?.description && (
            <p className="text-white/75 font-light text-sm leading-relaxed mt-[2px]">
              {activeScene.description}
            </p>
          )}
        </div>
        {/* Бар 2: контроллы, название проекта, в составе */}
        <div className="rounded-[20px] border border-white/30 bg-[#333333] px-4 py-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={projectsHref}
              className="inline-flex h-9 items-center gap-1 text-white/80 active:text-[#affc41] transition-colors font-light text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {copy.toProjects}
            </Link>
            {preparedScenes.length > 1 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => goToSection(Math.max(activeIndex - 1, 0))}
                  disabled={!hasPrevScene}
                  className="h-9 w-9 rounded-full border border-white/40 text-white bg-[#333333]/45 disabled:opacity-35 disabled:cursor-not-allowed"
                  aria-label={copy.prevScene}
                >
                  <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-light text-white/70 tabular-nums">
                  {activeIndex + 1} / {preparedScenes.length}
                </span>
                <button
                  type="button"
                  onClick={() => goToSection(Math.min(activeIndex + 1, preparedScenes.length - 1))}
                  disabled={!hasNextScene}
                  className="h-9 w-9 rounded-full border border-white/40 text-white bg-[#333333]/45 disabled:opacity-35 disabled:cursor-not-allowed"
                  aria-label={copy.nextScene}
                >
                  <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="inline-flex max-w-full items-center gap-4 flex-wrap">
            <p className="text-white/90 font-light text-sm leading-relaxed truncate">{project.title}</p>
            {project.collaboration?.url && project.collaboration.title && (
              <p className="text-sm leading-relaxed text-white/75 font-light whitespace-nowrap">
                {copy.collaborationWith}{' '}
                <a
                  href={project.collaboration.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#affc41] font-light underline decoration-[#affc41]/60 underline-offset-2 active:text-white transition-colors"
                >
                  {project.collaboration.title}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

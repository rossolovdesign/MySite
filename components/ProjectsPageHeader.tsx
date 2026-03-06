'use client'

import Link from 'next/link'
import { memo, useEffect, useState } from 'react'

interface ProjectsPageHeaderProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  href?: string
  label?: string
}

export const ProjectsPageHeader = memo(function ProjectsPageHeader({
  scrollContainerRef,
  href = '/',
  label = 'На главную',
}: ProjectsPageHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const handleScroll = () => {
      // Гистерезис: показываем при >12px, скрываем при <4px — убирает мерцание при скролл-апе
      setIsScrolled((prev) => (el.scrollTop > 12 ? true : el.scrollTop < 4 ? false : prev))
    }

    handleScroll()
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  return (
    <div className="sticky top-0 z-20 pt-[calc(2rem+env(safe-area-inset-top))] px-4 pb-2 flex-shrink-0 relative">
      {/* Стеклянный бар — плавное появление/исчезновение, тёмный оттенок чтобы не было белой полосы */}
      <div
        className={`absolute inset-0 bg-white/5 backdrop-blur-md border-b border-white/5 transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <Link
          href={href}
          className="inline-flex h-9 lg:h-auto items-center gap-1 text-white/80 hover:text-[#affc41] active:text-[#affc41] transition-colors font-light text-sm lg:text-lg"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {label}
        </Link>
      </div>
    </div>
  )
})

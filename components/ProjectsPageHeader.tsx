'use client'

import Link from 'next/link'
import { memo } from 'react'

interface ProjectsPageHeaderProps {
  href?: string
  label?: string
}

export const ProjectsPageHeader = memo(function ProjectsPageHeader({
  href = '/',
  label = 'На главную',
}: ProjectsPageHeaderProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex flex-col md:px-8">
      <div
        className="rounded-t-[20px] border-t border-x border-white/30 bg-[#333333] px-5 py-6 md:px-5 md:pt-8 md:pb-8 w-full md:max-w-[1400px] md:mx-auto"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[#AFFC41] hover:text-[#affc41]/90 md:active:text-[#affc41]/90 transition-colors font-light text-sm md:text-lg"
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

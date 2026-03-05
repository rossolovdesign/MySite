'use client'

import { useRef } from 'react'
import { ProjectsPageHeader } from './ProjectsPageHeader'

interface ProjectsPageClientProps {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

export function ProjectsPageClient({ children, backHref = '/', backLabel = 'На главную' }: ProjectsPageClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <main className="w-screen h-screen relative overflow-hidden">
      <div
        ref={scrollRef}
        className="w-full h-full overflow-x-hidden overflow-y-auto scrollbar-hide"
      >
        <div className="relative z-10 w-full flex flex-col min-h-full">
          <ProjectsPageHeader scrollContainerRef={scrollRef} href={backHref} label={backLabel} />
          {children}
        </div>
      </div>
    </main>
  )
}

'use client'

import { useMemo, useState } from 'react'
import type { Scene } from '@/sanity/queries'
import { SceneGallery } from '@/components/SceneGallery'
import { SceneInfo } from '@/components/SceneInfo'

interface ProjectScenesProps {
  scenes: Scene[]
}

export function ProjectScenes({ scenes }: ProjectScenesProps) {
  const orderedScenes = useMemo(() => {
    return [...scenes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [scenes])

  const [activeSceneId, setActiveSceneId] = useState<string | null>(orderedScenes[0]?._id ?? null)

  const activeScene = useMemo(() => {
    return orderedScenes.find((s) => s._id === activeSceneId) ?? null
  }, [orderedScenes, activeSceneId])

  if (orderedScenes.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4">
        <SceneGallery scenes={orderedScenes} activeSceneId={activeSceneId} onSceneChange={setActiveSceneId} />
      </div>
      <div className="lg:col-span-8">
        <SceneInfo scene={activeScene} scenes={orderedScenes} onNavigate={setActiveSceneId} />
      </div>
    </div>
  )
}


'use client'

import { Scene } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface SceneGalleryProps {
  scenes: Scene[]
  activeSceneId: string | null
  onSceneChange: (sceneId: string) => void
}

export function SceneGallery({ scenes, activeSceneId, onSceneChange }: SceneGalleryProps) {
  const sceneRefs = useRef<Record<string, HTMLDivElement>>({})

  useEffect(() => {
    if (activeSceneId && sceneRefs.current[activeSceneId]) {
      sceneRefs.current[activeSceneId].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeSceneId])

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
      {scenes.map((scene) => (
        <button
          key={scene._id}
          ref={(el) => {
            if (el) sceneRefs.current[scene._id] = el
          }}
          onClick={() => onSceneChange(scene._id)}
          className={`w-full text-left transition-all ${
            activeSceneId === scene._id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
          }`}
        >
          <div className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-[4/3]">
            {scene.image && (
              <Image
                src={urlFor(scene.image).width(400).height(300).url()}
                alt={scene.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <h4 className="mt-2 font-medium text-neutral-900">{scene.title}</h4>
          {scene.description && (
            <p className="text-sm text-neutral-600 line-clamp-2">{scene.description}</p>
          )}
        </button>
      ))}
    </div>
  )
}

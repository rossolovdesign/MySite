'use client'

import { Scene } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface SceneInfoProps {
  scene: Scene | null
  scenes: Scene[]
  onNavigate: (sceneId: string) => void
}

export function SceneInfo({ scene, scenes, onNavigate }: SceneInfoProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500">Select a scene to view details</p>
      </div>
    )
  }

  const currentIndex = scenes.findIndex((s) => s._id === scene._id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < scenes.length - 1

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-square">
        {scene.image && (
          <Image
            src={urlFor(scene.image).width(800).height(800).url()}
            alt={scene.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-light text-neutral-900">{scene.title}</h2>
          {scene.description && (
            <p className="mt-2 text-neutral-600">{scene.description}</p>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => hasPrev && onNavigate(scenes[currentIndex - 1]._id)}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition"
          >
            <ChevronUp className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => hasNext && onNavigate(scenes[currentIndex + 1]._id)}
            disabled={!hasNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition"
          >
            Next
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm text-neutral-500 pt-2">
          Scene {currentIndex + 1} of {scenes.length}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

/** Картинка карточки проекта со скелетоном на время загрузки. */
export function ProjectCardImage({
  imageUrl,
  alt,
  priority = false,
}: {
  imageUrl: string | null
  alt: string
  priority?: boolean
}) {
  const [loaded, setLoaded] = useState(false)

  if (!imageUrl) {
    return (
      <div className="absolute inset-0 skeleton-image" aria-hidden />
    )
  }

  return (
    <>
      <div
        className={`absolute inset-0 skeleton-image transition-opacity duration-300 ${loaded ? 'opacity-0 pointer-events-none' : ''}`}
        aria-hidden
      />
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}

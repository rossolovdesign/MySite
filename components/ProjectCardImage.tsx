'use client'

import { memo, useEffect, useState } from 'react'
import Image from 'next/image'

/** Картинка карточки проекта со скелетоном на время загрузки. */
export const ProjectCardImage = memo(function ProjectCardImage({
  imageUrl,
  alt,
  priority = false,
}: {
  imageUrl: string | null
  alt: string
  priority?: boolean
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [imageUrl])

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
        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    </>
  )
})

ProjectCardImage.displayName = 'ProjectCardImage'

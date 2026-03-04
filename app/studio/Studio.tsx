'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/studioConfig'

export default function Studio() {
  return (
    <div className="fixed inset-0">
      <NextStudio config={config} />
    </div>
  )
}


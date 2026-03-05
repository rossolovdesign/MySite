import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlugAndLocale, getProjectSlugs } from '@/sanity/queries'
import { ProjectDetailView } from '@/components/ProjectDetailView'
import { urlFor } from '@/sanity/image'
import { DEFAULT_OG_TITLE, DEFAULT_OG_DESCRIPTION } from '@/lib/metadata'

export const revalidate = 30

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlugAndLocale(slug, 'en')

  if (!project) {
    return {
      title: 'Project not found | Ivan Rossolov',
      robots: { index: false, follow: false },
    }
  }

  const pageTitle = `${project.title} | Ivan Rossolov — Product Designer`
  const pageDescription = project.shortDescription || 'Product design case study: process, decisions and visual system.'
  const canonical = `/en/projects/${project.slug.current}`
  const ogImage = project.thumbnail ? urlFor(project.thumbnail).width(1200).height(630).quality(85).url() : undefined

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        ru: `/projects/${project.slug.current}`,
      },
    },
    openGraph: {
      title: DEFAULT_OG_TITLE,
      description: DEFAULT_OG_DESCRIPTION,
      url: canonical,
      type: 'article',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: DEFAULT_OG_TITLE,
      description: DEFAULT_OG_DESCRIPTION,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function ProjectPageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlugAndLocale(slug, 'en')

  if (!project) notFound()

  return (
    <ProjectDetailView
      project={project}
      locale="en"
      projectsHref="/en/projects"
    />
  )
}


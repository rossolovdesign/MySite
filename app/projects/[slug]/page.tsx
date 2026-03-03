import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjectSlugs } from '@/sanity/queries'
import { ProjectDetailView } from '@/components/ProjectDetailView'

export const revalidate = 30

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return <ProjectDetailView project={project} />
}

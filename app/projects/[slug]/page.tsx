import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/sanity/queries'
import { ProjectDetailView } from '@/components/ProjectDetailView'

export const revalidate = 30

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return <ProjectDetailView project={project} />
}

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from '@/sanity/schemaTypes'
import { projectId, dataset, apiVersion } from '@/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',
  projectId,
  dataset,
  basePath: '/studio',
  apiVersion,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})


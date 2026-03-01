import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemaTypes'

const previewUrl =
  location.hostname === 'localhost'
    ? 'http://localhost:5173'
    : 'https://dreamingwithmarisol.vercel.app'

export default defineConfig({
  name: 'default',
  title: 'Dreaming with Marisol',

  projectId: 't8kqnnav',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

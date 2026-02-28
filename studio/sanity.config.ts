import { defineConfig } from 'sanity'
import { type StructureResolver, structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemaTypes'

const singletonTypes = new Set(['siteSettings'])

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings & Images')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId()!),
      ),
    ])

export default defineConfig({
  name: 'default',
  title: 'Dreaming with Marisol',

  projectId: 't8kqnnav',
  dataset: 'production',

  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      previewUrl: 'http://localhost:5173',
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
})

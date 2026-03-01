import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {resolve} from './presentation/resolve'
import type {StructureBuilder} from 'sanity/structure'

const singletonTypes = new Set(['siteSettings', 'homePage', 'aboutPage', 'valuesPage', 'pricingPage'])

function singletonItem(S: StructureBuilder, typeName: string, title: string) {
    return S.listItem()
        .title(title)
        .id(typeName)
        .child(S.document().schemaType(typeName).documentId(typeName))
}

export default defineConfig({
    name: 'default',
    title: 'Dreaming with Marisol',

    projectId: 't8kqnnav',
    dataset: 'production',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        singletonItem(S, 'siteSettings', 'Site Settings'),
                        S.divider(),
                        S.listItem()
                            .title('Pages')
                            .child(
                                S.list()
                                    .title('Pages')
                                    .items([
                                        singletonItem(S, 'homePage', 'Home'),
                                        singletonItem(S, 'aboutPage', 'About'),
                                        singletonItem(S, 'valuesPage', 'Values'),
                                        singletonItem(S, 'pricingPage', 'Pricing & Policies'),
                                    ]),
                            ),
                        S.divider(),
                        S.documentTypeListItem('service').title('Services'),
                        S.documentTypeListItem('videoModule').title('Learning Modules'),
                        S.documentTypeListItem('product').title('Products'),
                    ]),
        }),
        visionTool(),
        presentationTool({
          previewUrl:
          process.env.SANITY_STUDIO_PREVIEW_URL ??
          (process.env.NODE_ENV === 'production'
            ? 'https://dreamingwithmarisol.vercel.app'
            : 'http://localhost:5173'),
          resolve,
        }),
    ],

    schema: {
        types: schemaTypes,
        templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
    },

    document: {
        actions: (input, context) =>
            singletonTypes.has(context.schemaType)
                ? input.filter(({action}) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
                : input,
    },
})

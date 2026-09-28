import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'sitePage',
    title: 'Page',
    type: 'document',
    fields: [
        defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {source: 'title'},
            validation: (Rule) => Rule.required(),
        }),
        defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
        defineField({name: 'heroTitle', title: 'Hero title', type: 'string'}),
        defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'string'}),
        defineField({
            name: 'sections',
            title: 'Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({name: 'heading', title: 'Heading', type: 'string'}),
                        defineField({
                            name: 'body',
                            title: 'Body',
                            type: 'text',
                            rows: 8,
                            description: 'Separate paragraphs with a blank line.',
                        }),
                    ],
                    preview: {select: {title: 'heading'}},
                },
            ],
        }),
    ],
})

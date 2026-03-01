import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'valuesPage',
    title: 'Values Page',
    type: 'document',
    fields: [
        defineField({
            name: 'pageTitle',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Core Values',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'pageSubtitle',
            title: 'Page Subtitle',
            type: 'string',
            initialValue: 'Guiding principles for healing and community support.',
        }),
        defineField({
            name: 'values',
            title: 'Values',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                            rows: 3,
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: {title: 'title'},
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {title: 'Values Page'}
        },
    },
})

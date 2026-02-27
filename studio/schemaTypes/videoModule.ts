import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'videoModule',
    title: 'Video Module',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'duration',
            title: 'Duration',
            type: 'string',
            description: 'e.g., 45 mins',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
            description: 'Link to YouTube, Vimeo, or external hosted video',
        }),
        defineField({
            name: 'thumbnailColor',
            title: 'Thumbnail Color Class',
            type: 'string',
            options: {
                list: [
                    { title: 'Primary (Light Olive)', value: 'bg-primary' },
                    { title: 'Secondary (Deep Olive)', value: 'bg-secondary' },
                    { title: 'Accent (Mustard Gold)', value: 'bg-accent' },
                ],
            },
            initialValue: 'bg-primary',
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Used to sort modules sequentially (e.g., 1, 2, 3)',
        }),
        defineField({
            name: 'products',
            title: 'Related Store Products',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }]
                }
            ],
            description: 'Link eCommerce or affiliate products mentioned in this video.',
        }),
    ],
})

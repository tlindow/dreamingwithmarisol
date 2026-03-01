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
            name: 'accessTier',
            title: 'Access Tier',
            type: 'string',
            options: {
                list: [
                    { title: 'Free', value: 'free' },
                    { title: 'Premium', value: 'premium' },
                ],
                layout: 'radio',
            },
            initialValue: 'free',
            description: 'Free modules are openly accessible. Premium modules can be offered as paid downloads or gated content.',
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false,
            description: 'Featured modules are highlighted on the healings page when sessions are fully booked, guiding visitors toward learning.',
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

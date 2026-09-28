import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'product',
    title: 'Digital product',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {source: 'title'},
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 5,
        }),
        defineField({
            name: 'amountCents',
            title: 'Listed price (cents)',
            description:
                'Shown on the site until a Stripe Price is attached. Checkout charges the Stripe Price, never this number.',
            type: 'number',
            validation: (Rule) => Rule.required().integer().positive(),
        }),
        defineField({
            name: 'stripePriceId',
            title: 'Stripe Price ID',
            description: 'price_… from Stripe. Required before the buy button appears.',
            type: 'string',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    {title: 'Available', value: 'available'},
                    {title: 'Coming soon', value: 'coming-soon'},
                ],
                layout: 'radio',
            },
            initialValue: 'coming-soon',
        }),
        defineField({
            name: 'file',
            title: 'Download file',
            description: 'Use this for smaller PDFs. Files over about 20 MB should use a private Vercel Blob path.',
            type: 'file',
        }),
        defineField({
            name: 'blobPath',
            title: 'Private Vercel Blob pathname',
            description: 'Example: products/enter-the-cosmic-ocean.pdf',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {hotspot: true},
        }),
        defineField({
            name: 'beaconsProductId',
            title: 'Old Beacons product id',
            type: 'string',
        }),
        defineField({
            name: 'postPurchaseMessage',
            title: 'Post-purchase message',
            type: 'text',
        }),
    ],
    preview: {
        select: {title: 'title', subtitle: 'status', media: 'image'},
    },
})

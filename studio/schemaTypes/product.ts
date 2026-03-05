import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'product',
    title: 'eCommerce Product',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Product Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Digital Download', value: 'digital' },
                    { title: 'Handcrafted / Physical', value: 'physical' },
                    { title: 'Bundle', value: 'bundle' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'price',
            title: 'Price ($)',
            type: 'number',
        }),
        defineField({
            name: 'description',
            title: 'Short Description',
            description: 'Used on the store listing card (2–3 sentences).',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'body',
            title: 'Full Description',
            description: 'Detailed product description shown on the product detail page.',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'features',
            title: 'Key Features / What You Get',
            description: 'Bullet-point list of features or included items.',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'image',
            title: 'Product Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'gallery',
            title: 'Additional Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'stripePaymentLink',
            title: 'Stripe / Direct Payment Link',
            description: 'Paste a Stripe payment link or Gumroad URL here for a one-click purchase button.',
            type: 'url',
        }),
        defineField({
            name: 'storeUrl',
            title: 'External Store Link (fallback)',
            description: 'Shopify, Etsy, or other external store link. Used only when no Stripe link is set.',
            type: 'url',
        }),
    ],
})

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
            name: 'price',
            title: 'Price ($)',
            type: 'number',
        }),
        defineField({
            name: 'description',
            title: 'Short Description',
            type: 'text',
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
            name: 'storeUrl',
            title: 'Store Link',
            type: 'url',
            description: 'Link to where the user can buy this item (e.g., Shopify, Amazon, etc.)',
            validation: (Rule) => Rule.required(),
        }),
    ],
})

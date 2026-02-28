import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'substackArticle',
    title: 'Substack Article',
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
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            description: 'Short description or summary of the article',
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'text',
            description: 'Full HTML content from Substack',
        }),
        defineField({
            name: 'substackUrl',
            title: 'Substack URL',
            type: 'url',
            description: 'Original URL to the article on Substack',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: 'Optional featured image for the article',
        }),
        defineField({
            name: 'isImported',
            title: 'Is Imported',
            type: 'boolean',
            description: 'Whether this article was imported from Substack',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            publishedAt: 'publishedAt',
            media: 'featuredImage',
        },
        prepare({ title, publishedAt, media }) {
            return {
                title,
                subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date',
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Published Date, Newest',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Published Date, Oldest',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
    ],
})

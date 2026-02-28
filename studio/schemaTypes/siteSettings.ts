import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings & Images',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Site Title',
            type: 'string',
            initialValue: 'Dreaming with Marisól',
        }),
        defineField({
            name: 'heroImage',
            title: 'Home Page Hero Image',
            type: 'image',
            options: {
                hotspot: true, // Allows user to select what part of image to crop
            },
        }),
        defineField({
            name: 'portraitImage',
            title: 'About Page Portrait Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'homeVideoUrl',
            title: 'Home Page Video URL',
            type: 'url',
            description: 'YouTube, Vimeo, or direct video URL. Shown between the hero and offerings sections.',
        }),
    ],
})

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
        // Typography Settings
        defineField({
            name: 'typography',
            title: 'Typography Settings',
            type: 'object',
            fields: [
                defineField({
                    name: 'primaryFont',
                    title: 'Primary Font Family',
                    type: 'string',
                    description: 'Font family name (e.g., "Outfit", "Inter")',
                    initialValue: 'Outfit',
                }),
                defineField({
                    name: 'primaryFontUrl',
                    title: 'Primary Font URL',
                    type: 'url',
                    description: 'Google Fonts URL or custom font URL for primary font',
                    initialValue: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap',
                }),
                defineField({
                    name: 'secondaryFont',
                    title: 'Secondary Font Family',
                    type: 'string',
                    description: 'Font family name for headings (e.g., "Playfair Display", "Marisol")',
                    initialValue: 'Playfair Display',
                }),
                defineField({
                    name: 'secondaryFontUrl',
                    title: 'Secondary Font URL',
                    type: 'url',
                    description: 'Google Fonts URL or custom font URL for secondary font',
                    initialValue: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap',
                }),
            ],
        }),
        // Emoji Settings
        defineField({
            name: 'emojis',
            title: 'Emoji Settings',
            type: 'object',
            description: 'Manage emojis used throughout the site',
            fields: [
                defineField({
                    name: 'heroEmoji',
                    title: 'Hero Section Emoji',
                    type: 'string',
                    description: 'Emoji to display in hero section (e.g., ✨, 🌙, 🍨)',
                }),
                defineField({
                    name: 'brandEmoji',
                    title: 'Brand/Logo Emoji',
                    type: 'string',
                    description: 'Emoji used in brand/logo area',
                }),
                defineField({
                    name: 'decorativeEmojis',
                    title: 'Decorative Emojis',
                    type: 'array',
                    description: 'List of emojis for decorative use',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'sectionEmojis',
                    title: 'Section Emojis',
                    type: 'object',
                    description: 'Emojis for different sections',
                    fields: [
                        defineField({
                            name: 'about',
                            title: 'About Section',
                            type: 'string',
                        }),
                        defineField({
                            name: 'services',
                            title: 'Services Section',
                            type: 'string',
                        }),
                        defineField({
                            name: 'store',
                            title: 'Store Section',
                            type: 'string',
                        }),
                        defineField({
                            name: 'learning',
                            title: 'Learning Section',
                            type: 'string',
                        }),
                    ],
                }),
            ],
        }),
        // Text Content Settings
        defineField({
            name: 'textContent',
            title: 'Text Content Settings',
            type: 'object',
            description: 'Manage key text content throughout the site',
            fields: [
                defineField({
                    name: 'heroTitle',
                    title: 'Hero Title',
                    type: 'string',
                    description: 'Main hero title text',
                    initialValue: "Hola, I'm Marisól",
                }),
                defineField({
                    name: 'heroSubtitle',
                    title: 'Hero Subtitle',
                    type: 'text',
                    description: 'Hero section subtitle/description',
                    initialValue: 'Mesoamerican Cleansing Rituals & Spiritual Healing',
                }),
                defineField({
                    name: 'siteDescription',
                    title: 'Site Description',
                    type: 'text',
                    description: 'General site description',
                }),
            ],
        }),
    ],
})

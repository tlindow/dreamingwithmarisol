import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    fields: [
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
            initialValue: "Hola, I'm Marisól",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'string',
            initialValue: 'Mesoamerican Cleansing Rituals & Spiritual Healing',
        }),
        defineField({
            name: 'offeringsTitle',
            title: 'Offerings Section Title',
            type: 'string',
            initialValue: 'Offerings',
        }),
        defineField({
            name: 'offeringsSubtitle',
            title: 'Offerings Section Subtitle',
            type: 'string',
            initialValue: 'Traditional healing practices tailored to your spiritual journey.',
        }),
        defineField({
            name: 'offerings',
            title: 'Offerings',
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
                        defineField({
                            name: 'linkPath',
                            title: 'Link Path',
                            type: 'string',
                            description: 'Internal route path, e.g. /healings',
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: {title: 'title', subtitle: 'linkPath'},
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {title: 'Home Page'}
        },
    },
})

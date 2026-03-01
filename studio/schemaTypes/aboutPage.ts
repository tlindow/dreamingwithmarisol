import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'aboutPage',
    title: 'About Page',
    type: 'document',
    fields: [
        defineField({
            name: 'pageTitle',
            title: 'Page Title',
            type: 'string',
            initialValue: 'About Marisól',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            rows: 6,
            initialValue:
                'Marisól is a spiritual healer dedicated to guiding individuals through their healing journeys. With deep roots in Mesoamerican traditions, she blends ancestral wisdom with modern energetic practices to offer a holistic approach to wellness.',
        }),
        defineField({
            name: 'experienceSectionTitle',
            title: 'Experience Section Title',
            type: 'string',
            initialValue: 'Experience & Education',
        }),
        defineField({
            name: 'experienceItems',
            title: 'Experience & Education',
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
            return {title: 'About Page'}
        },
    },
})

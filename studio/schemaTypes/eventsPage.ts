import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'eventsPage',
    title: 'Events Page',
    type: 'document',
    fields: [
        defineField({
            name: 'pageTitle',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Upcoming Events',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'pageSubtitle',
            title: 'Page Subtitle',
            type: 'string',
            initialValue:
                'Join us for ceremonies, workshops, and community gatherings.',
        }),
    ],
    preview: {
        prepare() {
            return {title: 'Events Page'}
        },
    },
})

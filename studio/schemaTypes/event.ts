import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Start Date & Time',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date & Time',
            type: 'datetime',
            description: 'Leave empty for single-point events.',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
            description: 'e.g. "San Diego, CA" or "Online via Zoom"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'eventType',
            title: 'Event Type',
            type: 'string',
            options: {
                list: [
                    {title: 'Ceremony', value: 'ceremony'},
                    {title: 'Workshop', value: 'workshop'},
                    {title: 'Retreat', value: 'retreat'},
                    {title: 'Community Gathering', value: 'gathering'},
                    {title: 'Online Event', value: 'online'},
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Event Image',
            type: 'image',
            options: {hotspot: true},
        }),
        defineField({
            name: 'registrationUrl',
            title: 'Registration / Ticket URL',
            type: 'url',
            description: 'External link for sign-ups (Eventbrite, Calendly, etc.).',
            validation: (Rule) =>
                Rule.uri({scheme: ['https']}).error('Must be a valid https:// URL'),
        }),
    ],
    orderings: [
        {
            title: 'Date (Upcoming first)',
            name: 'dateAsc',
            by: [{field: 'date', direction: 'asc'}],
        },
    ],
    preview: {
        select: {
            title: 'title',
            date: 'date',
            eventType: 'eventType',
            media: 'image',
        },
        prepare({title, date, eventType, media}) {
            const d = date ? new Date(date).toLocaleDateString() : 'No date'
            return {
                title,
                subtitle: `${eventType ?? 'event'} — ${d}`,
                media,
            }
        },
    },
})

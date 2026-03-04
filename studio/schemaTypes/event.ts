import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    groups: [
        {name: 'details', title: 'Details'},
        {name: 'media', title: 'Media'},
        {name: 'payment', title: 'Payment & Registration'},
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'details',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Start Date & Time',
            type: 'datetime',
            group: 'details',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date & Time',
            type: 'datetime',
            group: 'details',
            description: 'Leave empty for single-point events.',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
            group: 'details',
            description: 'e.g. "San Diego, CA" or "Online via Zoom"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'eventType',
            title: 'Event Type',
            type: 'string',
            group: 'details',
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
            title: 'Short Description',
            type: 'text',
            group: 'details',
            rows: 3,
            description: 'Shown on the events listing page.',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'detailedDescription',
            title: 'Detailed Description',
            type: 'text',
            group: 'details',
            rows: 8,
            description:
                'Longer description shown on the individual event page. Falls back to short description if empty.',
        }),
        defineField({
            name: 'image',
            title: 'Listing Thumbnail',
            type: 'image',
            group: 'media',
            options: {hotspot: true},
            description: 'Small image shown on the events listing cards.',
        }),
        defineField({
            name: 'flyer',
            title: 'Event Flyer / Hero Image',
            type: 'image',
            group: 'media',
            options: {hotspot: true},
            description:
                'Large promotional image or flyer displayed on the event detail page.',
        }),
        defineField({
            name: 'price',
            title: 'Price (USD)',
            type: 'number',
            group: 'payment',
            description: 'Leave empty for free events.',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'stripePaymentLink',
            title: 'Stripe Payment Link',
            type: 'url',
            group: 'payment',
            description:
                'Create a Payment Link in your Stripe Dashboard and paste the URL here. Visitors will be redirected to Stripe to complete payment.',
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

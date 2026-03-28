import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'e.g. "Limpia (Spiritual Cleansing)" or "Distance Limpia & Plática"',
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
            name: 'pageTitle',
            title: 'Page Heading',
            type: 'string',
            description: 'Heading shown at the top of the page, e.g. "In-Person Healings"',
        }),
        defineField({
            name: 'pageSubtitle',
            title: 'Page Subtitle',
            type: 'string',
            description: 'e.g. "San Diego, CA" or "Available Worldwide via Zoom"',
        }),
        defineField({
            name: 'price',
            title: 'Price ($)',
            type: 'number',
        }),
        defineField({
            name: 'duration',
            title: 'Duration',
            type: 'string',
            description: 'e.g. "60 Minutes"',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'whatToExpect',
            title: 'What to Expect',
            type: 'text',
            rows: 4,
            description: 'Describes what the client should expect during the session.',
        }),
        defineField({
            name: 'detailedInfo',
            title: 'Detailed Information',
            type: 'array',
            of: [{type: 'block'}],
        }),
        defineField({
            name: 'isOnline',
            title: 'Is Online Service?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'cancellationPolicy',
            title: 'Rescheduling Policy',
            type: 'text',
            rows: 4,
            initialValue:
                'Life happens — to all of us. Sometimes you need to reschedule, sometimes I do, and there\'s no shame in that. All I ask is that you let me know as soon as you can and do something small to make it right — even just sending a quick dollar amount via Apple Pay. We communicate, we figure it out, and we move forward.',
        }),
        defineField({
            name: 'refundsPolicy',
            title: 'Refunds Policy',
            type: 'text',
            rows: 3,
            initialValue:
                'All healing sessions are final sale. No refunds are provided after the service has been rendered.',
        }),
        defineField({
            name: 'preparationText',
            title: 'Preparation Instructions',
            type: 'text',
            rows: 3,
            description: 'Instructions for the client to prepare for the session.',
        }),
    ],
    preview: {
        select: {title: 'title', subtitle: 'isOnline'},
        prepare({title, subtitle}: {title?: string; subtitle?: boolean}) {
            return {
                title: title ?? 'Untitled Service',
                subtitle: subtitle ? 'Online' : 'In-Person',
            }
        },
    },
})

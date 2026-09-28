import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings & Images',
    type: 'document',
    groups: [
        {name: 'branding', title: 'Branding'},
        {name: 'images', title: 'Images'},
        {name: 'booking', title: 'Booking'},
        {name: 'social', title: 'Social & Links'},
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Site Title',
            type: 'string',
            group: 'branding',
            initialValue: 'Dreaming with Marisól',
        }),
        defineField({
            name: 'tagline',
            title: 'Site Tagline',
            type: 'string',
            group: 'branding',
            description: 'Shown in the footer beneath the brand name.',
            initialValue: 'Spiritual Healing & Education',
        }),
        defineField({
            name: 'heroImage',
            title: 'Home Page Hero Image',
            type: 'image',
            group: 'images',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'portraitImage',
            title: 'About Page Portrait Image',
            type: 'image',
            group: 'images',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'calendlyUrl',
            title: 'Calendly Booking Link',
            type: 'url',
            group: 'booking',
            description:
                'Paste the full Calendly URL for sessions. Update this at the start of each month when new slots are released.',
            validation: (Rule) =>
                Rule.uri({scheme: ['https']}).error('Must be a valid https:// URL'),
        }),
        defineField({
            name: 'contactEmail',
            title: 'Contact / Waitlist Email',
            type: 'string',
            group: 'booking',
            description:
                'Email address used for the "Join the Waitlist" button on the healings page.',
            validation: (Rule) => Rule.email().error('Must be a valid email address'),
        }),
        defineField({
            name: 'instagramUrl',
            title: 'Instagram URL',
            type: 'url',
            group: 'social',
            initialValue: 'https://instagram.com/dreamingwithmarisol',
            validation: (Rule) =>
                Rule.uri({scheme: ['https']}).error('Must be a valid https:// URL'),
        }),
        defineField({
            name: 'substackUrl',
            title: 'Newsletter / Substack URL',
            type: 'url',
            group: 'social',
            description: 'Link to newsletter signup (Substack, Mailchimp, etc.).',
            validation: (Rule) =>
                Rule.uri({scheme: ['https']}).error('Must be a valid https:// URL'),
        }),
        defineField({
            name: 'tiktokUrl',
            title: 'TikTok URL',
            type: 'url',
            group: 'social',
            initialValue: 'https://tiktok.com/@dreamingwithmarisol',
        }),
        defineField({
            name: 'showBookingBanner',
            title: 'Show “no availability” banner',
            type: 'boolean',
            group: 'booking',
            description: 'When on, the booking page hides the Calendly embeds and points people to the newsletter.',
            initialValue: false,
        }),
        defineField({
            name: 'bookingBannerText',
            title: 'No-availability message',
            type: 'text',
            group: 'booking',
            rows: 3,
        }),
        defineField({
            name: 'calendlyEvents',
            title: 'Calendly event types',
            type: 'array',
            group: 'booking',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({name: 'name', title: 'Name', type: 'string'}),
                        defineField({name: 'url', title: 'Calendly URL', type: 'url'}),
                        defineField({name: 'priceLabel', title: 'Price label', type: 'string'}),
                        defineField({name: 'durationLabel', title: 'Duration label', type: 'string'}),
                    ],
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {title: 'Site Settings'}
        },
    },
})

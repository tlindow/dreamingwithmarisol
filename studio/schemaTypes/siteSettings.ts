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
            name: 'sessionsFullyBooked',
            title: 'Sessions Fully Booked',
            type: 'boolean',
            group: 'booking',
            initialValue: false,
            description:
                'Toggle ON when all sessions for the current month are booked. The healings pages will redirect visitors to the Learning Hub instead of showing a waitlist.',
        }),
        defineField({
            name: 'contactEmail',
            title: 'Contact Email',
            type: 'string',
            group: 'booking',
            description:
                'General contact email shown on the site.',
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
    ],
    preview: {
        prepare() {
            return {title: 'Site Settings'}
        },
    },
})

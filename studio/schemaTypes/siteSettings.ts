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
                hotspot: true,
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
            name: 'calendlyUrl',
            title: 'Calendly Booking Link',
            type: 'url',
            description:
                'Paste the full Calendly URL for in-person sessions. Update this at the start of each month when new slots are released.',
            validation: (Rule) =>
                Rule.uri({ scheme: ['https'] }).error('Must be a valid https:// URL'),
        }),
        defineField({
            name: 'contactEmail',
            title: 'Contact / Waitlist Email',
            type: 'string',
            description:
                'Email address used for the "Join the Waitlist" button on the healings page.',
            validation: (Rule) =>
                Rule.email().error('Must be a valid email address'),
        }),
    ],
})

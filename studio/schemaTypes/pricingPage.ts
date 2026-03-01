import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'pricingPage',
    title: 'Pricing & Policies',
    type: 'document',
    fields: [
        defineField({
            name: 'pageTitle',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Pricing & Policies',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'servicesList',
            title: 'Services & Prices',
            type: 'array',
            description: 'List of services shown in the investment section.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Service Name',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'duration',
                            title: 'Duration',
                            type: 'string',
                            description: 'e.g. "60 Min"',
                        }),
                        defineField({
                            name: 'price',
                            title: 'Price ($)',
                            type: 'number',
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: {title: 'name', subtitle: 'price'},
                        prepare({title, subtitle}: {title?: string; subtitle?: number}) {
                            return {title, subtitle: subtitle != null ? `$${subtitle}` : undefined}
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'cancellationPolicy',
            title: 'Cancellation Policy',
            type: 'text',
            rows: 4,
            initialValue:
                'Your time is valuable, and so is mine. Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.',
        }),
        defineField({
            name: 'refundsPolicy',
            title: 'Refunds Policy',
            type: 'text',
            rows: 4,
            initialValue:
                'All healing sessions are final sale. No refunds are provided after the service has been rendered. If you are unsatisfied, please bring it up during our plática.',
        }),
    ],
    preview: {
        prepare() {
            return {title: 'Pricing & Policies'}
        },
    },
})

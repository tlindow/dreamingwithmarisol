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

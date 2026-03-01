import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
    locations: {
        siteSettings: defineLocations({
            select: {title: 'title'},
            resolve: (doc) => ({
                locations: [{title: doc?.title || 'Site Settings', href: '/'}],
            }),
        }),

        homePage: defineLocations({
            select: {title: 'heroTitle'},
            resolve: (doc) => ({
                locations: [{title: doc?.title || 'Home', href: '/'}],
            }),
        }),

        aboutPage: defineLocations({
            select: {title: 'pageTitle'},
            resolve: (doc) => ({
                locations: [{title: doc?.title || 'About', href: '/about'}],
            }),
        }),

        valuesPage: defineLocations({
            select: {title: 'pageTitle'},
            resolve: (doc) => ({
                locations: [{title: doc?.title || 'Values', href: '/values'}],
            }),
        }),

        pricingPage: defineLocations({
            select: {title: 'pageTitle'},
            resolve: (doc) => ({
                locations: [{title: doc?.title || 'Pricing', href: '/pricing'}],
            }),
        }),

        service: defineLocations({
            select: {title: 'title', isOnline: 'isOnline'},
            resolve: (doc) => ({
                locations: [
                    {
                        title: doc?.title || 'Service',
                        href: doc?.isOnline ? '/online-healings' : '/healings',
                    },
                    {title: 'Pricing', href: '/pricing'},
                ],
            }),
        }),

        videoModule: defineLocations({
            select: {title: 'title', id: '_id'},
            resolve: (doc) => ({
                locations: [
                    ...(doc?.id
                        ? [{title: doc?.title || 'Module', href: `/learning/${doc.id}`}]
                        : []),
                    {title: 'Learning Hub', href: '/learning'},
                ],
            }),
        }),

        product: defineLocations({
            select: {title: 'title'},
            resolve: (doc) => ({
                locations: [{title: doc?.title || 'Product', href: '/store'}],
            }),
        }),
    },
}

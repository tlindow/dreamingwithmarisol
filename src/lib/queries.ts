export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
    title,
    tagline,
    heroImage,
    portraitImage,
    calendlyUrl,
    contactEmail,
    instagramUrl,
    substackUrl
}`;

export const HOME_PAGE_QUERY = `{
    "settings": *[_type == "siteSettings"][0]{ heroImage },
    "page": *[_type == "homePage" && _id == "homePage"][0]{
        heroTitle,
        heroSubtitle,
        offeringsTitle,
        offeringsSubtitle,
        offerings[]{ title, description, linkPath }
    }
}`;

export const ABOUT_PAGE_QUERY = `{
    "settings": *[_type == "siteSettings"][0]{ portraitImage },
    "page": *[_type == "aboutPage" && _id == "aboutPage"][0]{
        pageTitle,
        bio,
        experienceSectionTitle,
        experienceItems[]{ title, description }
    }
}`;

export const HEALING_PAGE_QUERY = `{
    "settings": *[_type == "siteSettings"][0]{ calendlyUrl, sessionsFullyBooked, contactEmail },
    "service": *[_type == "service" && isOnline == $isOnline][0]{
        title,
        pageTitle,
        pageSubtitle,
        price,
        duration,
        description,
        whatToExpect,
        cancellationPolicy,
        refundsPolicy,
        preparationText
    },
    "featuredModules": *[_type == "videoModule" && isFeatured == true] | order(order asc) [0...3] {
        _id,
        title,
        duration,
        description,
        thumbnailColor,
        accessTier
    }
}`;

export const VALUES_PAGE_QUERY = `*[_type == "valuesPage" && _id == "valuesPage"][0]{
    pageTitle,
    pageSubtitle,
    values[]{ title, description }
}`;

export const PRICING_PAGE_QUERY = `*[_type == "pricingPage" && _id == "pricingPage"][0]{
    pageTitle,
    servicesList[]{ name, duration, price },
    cancellationPolicy,
    refundsPolicy
}`;

export const LEARNING_HUB_QUERY = `*[_type == "videoModule"] | order(order asc) {
    _id,
    title,
    duration,
    description,
    thumbnailColor,
    accessTier,
    isFeatured
}`;

export const MODULE_DETAIL_QUERY = `*[_type == "videoModule" && _id == $id][0] {
    _id,
    title,
    duration,
    description,
    videoUrl,
    thumbnailColor,
    "products": products[]->{
        _id,
        title,
        description,
        price,
        storeUrl,
        image
    }
}`;

export const STORE_QUERY = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    description,
    price,
    storeUrl,
    image
}`;

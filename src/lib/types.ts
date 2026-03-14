export interface SiteSettings {
    title?: string;
    tagline?: string;
    heroImageUrl?: string;
    portraitImageUrl?: string;
    calendlyUrl?: string;
    contactEmail?: string;
    instagramUrl?: string;
    substackUrl?: string;
}

export interface Offering {
    title: string;
    description: string;
    linkPath: string;
}

export interface HomePageData {
    heroTitle?: string;
    heroSubtitle?: string;
    offeringsTitle?: string;
    offeringsSubtitle?: string;
    offerings?: Offering[];
}

export interface ExperienceItem {
    title: string;
    description: string;
}

export interface AboutPageData {
    pageTitle?: string;
    bio?: string;
    experienceSectionTitle?: string;
    experienceItems?: ExperienceItem[];
}

export interface ServiceData {
    title?: string;
    pageTitle?: string;
    pageSubtitle?: string;
    price?: number;
    duration?: string;
    description?: string;
    whatToExpect?: string;
    cancellationPolicy?: string;
    refundsPolicy?: string;
    preparationText?: string;
}

export interface ValueItem {
    title: string;
    description: string;
}

export interface ValuesPageData {
    pageTitle?: string;
    pageSubtitle?: string;
    values?: ValueItem[];
}

export interface PricingServiceItem {
    name: string;
    duration?: string;
    price: number;
}

export interface PricingPageData {
    pageTitle?: string;
    servicesList?: PricingServiceItem[];
    cancellationPolicy?: string;
    refundsPolicy?: string;
}

export interface VideoModule {
    _id: string;
    title: string;
    duration: string;
    description: string;
    thumbnailColor: string;
    videoUrl?: string;
    productIds?: string[];
}

export interface Product {
    _id: string;
    title: string;
    category?: 'digital' | 'physical' | 'bundle';
    description: string;
    body?: string;
    features?: string[];
    price: number;
    storeUrl?: string;
    stripePaymentLink?: string;
    imageUrl?: string;
    gallery?: string[];
}

export interface EventItem {
    _id: string;
    title: string;
    date: string;
    endDate?: string;
    location: string;
    eventType: string;
    description: string;
    detailedDescription?: string;
    imageUrl?: string;
    flyerUrl?: string;
    price?: number;
    stripePaymentLink?: string;
}

export interface EventsPageData {
    pageTitle?: string;
    pageSubtitle?: string;
}

export interface SiteContent {
    siteSettings: SiteSettings;
    homePage: HomePageData;
    aboutPage: AboutPageData;
    inPersonService: ServiceData;
    onlineService: ServiceData;
    valuesPage: ValuesPageData;
    pricingPage: PricingPageData;
    eventsPage: EventsPageData;
    events: EventItem[];
    learningModules: VideoModule[];
    products: Product[];
}

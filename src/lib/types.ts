import type { SanityImageSource } from '@sanity/image-url';

export interface SiteSettings {
    title?: string;
    tagline?: string;
    heroImage?: SanityImageSource;
    portraitImage?: SanityImageSource;
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
    products?: Product[];
}

export interface PortableTextBlock {
    _type: 'block';
    _key: string;
    style?: string;
    children: Array<{ _type: 'span'; _key: string; text: string; marks?: string[] }>;
    markDefs?: Array<{ _type: string; _key: string; href?: string }>;
}

export interface Product {
    _id: string;
    title: string;
    category?: 'digital' | 'physical' | 'bundle';
    description: string;
    body?: PortableTextBlock[];
    features?: string[];
    price: number;
    storeUrl?: string;
    stripePaymentLink?: string;
    image: SanityImageSource;
    gallery?: SanityImageSource[];
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
    image?: SanityImageSource;
    flyer?: SanityImageSource;
    price?: number;
    stripePaymentLink?: string;
}

export interface EventsPageData {
    pageTitle?: string;
    pageSubtitle?: string;
}

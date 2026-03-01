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
    kitBundleUrl?: string;
    kitBundleSavings?: number;
}

export interface KitBundle {
    _id: string;
    title: string;
    products: Product[];
    kitBundleUrl?: string;
    kitBundleSavings?: number;
}

export interface ProductWithKits extends Product {
    kits: { _id: string; title: string }[];
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    storeUrl: string;
    image: SanityImageSource;
}

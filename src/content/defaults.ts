import type {
    HomePageData,
    AboutPageData,
    ServiceData,
    ValuesPageData,
    PricingPageData,
    SiteSettings,
} from '../lib/types';

export const DEFAULT_SITE_SETTINGS: Required<Pick<SiteSettings,
    'title' | 'tagline' | 'contactEmail' | 'instagramUrl'
>> = {
    title: 'Dreaming with Marisól',
    tagline: 'Spiritual Healing & Education',
    contactEmail: 'hello@example.com',
    instagramUrl: 'https://instagram.com/dreamingwithmarisol',
};

export const DEFAULT_HOME_PAGE: Required<HomePageData> = {
    heroTitle: "Hola, I'm Marisól",
    heroSubtitle: 'Mesoamerican Cleansing Rituals & Spiritual Healing',
    offeringsTitle: 'Offerings',
    offeringsSubtitle: 'Traditional healing practices tailored to your spiritual journey.',
    offerings: [
        {
            title: 'In-Person Limpias',
            description: 'Traditional Mesoamerican spiritual cleansing to remove heavy energies and restore balance.',
            linkPath: '/healings',
        },
        {
            title: 'Pláticas',
            description: 'Heart-to-heart spiritual counseling to guide you through life\'s transitions.',
            linkPath: '/healings',
        },
        {
            title: 'Online Sessions',
            description: 'Distance healing and spiritual guidance available wherever you are.',
            linkPath: '/online-healings',
        },
    ],
};

export const DEFAULT_ABOUT_PAGE: Required<AboutPageData> = {
    pageTitle: 'About Marisól',
    bio: 'Marisól is a spiritual healer dedicated to guiding individuals through their healing journeys. With deep roots in Mesoamerican traditions, she blends ancestral wisdom with modern energetic practices to offer a holistic approach to wellness.',
    experienceSectionTitle: 'Experience & Education',
    experienceItems: [
        {
            title: 'Curanderismo',
            description: 'Extensive training and initiation into traditional Mesoamerican healing practices, focusing on spiritual cleansing (Limpias) and energetic balance.',
        },
        {
            title: 'Psychic Training',
            description: 'Developed intuitive abilities to assist clients in uncovering deep-seated blockages and navigating life\'s challenges with clarity.',
        },
        {
            title: 'Reiki',
            description: 'Certified Reiki practitioner, utilizing universal life energy to promote physical, emotional, and spiritual healing.',
        },
    ],
};

export const DEFAULT_IN_PERSON_SERVICE: Required<ServiceData> = {
    title: 'Limpia (Spiritual Cleansing)',
    pageTitle: 'In-Person Healings',
    pageSubtitle: 'San Diego, CA',
    price: 100,
    duration: '60 Minutes',
    description: 'A Limpia is a traditional Mesoamerican healing practice designed to cleanse the body, mind, and spirit of heavy, stagnant energies. Using sacred smoke (copal, palo santo, or sage), fresh herbs, eggs, and prayer, this ritual restores balance to your energetic field.',
    whatToExpect: 'We begin with a brief plática (heart-to-heart talk) to set intentions. The cleansing involves sweeping the body with herbs and using localized energetic clearing techniques. Please wear comfortable, light-colored clothing.',
    cancellationPolicy: 'Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.',
    refundsPolicy: 'All healing sessions are final sale. No refunds are provided after the service has been rendered.',
    preparationText: 'Consume a light meal 1-2 hours prior. Avoid alcohol and recreational substances 24 hours before your session.',
};

export const DEFAULT_ONLINE_SERVICE: Required<ServiceData> = {
    title: 'Distance Limpia & Plática',
    pageTitle: 'Online Sessions',
    pageSubtitle: 'Available Worldwide via Zoom',
    price: 100,
    duration: '60 Minutes',
    description: 'Energy knows no physical bounds. Distance healing sessions are just as effective as in-person sessions. We will connect via Zoom for a heart-to-heart discussion (plática), followed by a guided energetic clearing and meditation.',
    whatToExpect: 'We begin with a virtual plática to set intentions and connect energetically. The session includes guided breathwork, energetic clearing techniques, and a closing meditation. Please find a quiet, private space and have a candle or glass of water nearby.',
    cancellationPolicy: 'Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.',
    refundsPolicy: 'All healing sessions are final sale. No refunds are provided after the service has been rendered.',
    preparationText: 'Find a quiet, private space. Have a candle or glass of water nearby. Avoid alcohol and recreational substances 24 hours before your session.',
};

export const DEFAULT_VALUES_PAGE: Required<ValuesPageData> = {
    pageTitle: 'Core Values',
    pageSubtitle: 'Guiding principles for healing and community support.',
    values: [
        {
            title: 'Ancestral Wisdom',
            description: 'Honoring and preserving traditional Mesoamerican healing practices passed down through generations. Keeping the roots alive.',
        },
        {
            title: 'Holistic Approach',
            description: 'Recognizing that true wellness encompasses the mind, body, and spirit. Healing the whole person, not just the symptom.',
        },
        {
            title: 'Accessible Care',
            description: 'Dedicated to providing support to the community through sliding scale options and inclusive practices whenever possible.',
        },
        {
            title: 'Empowerment',
            description: 'Guiding individuals to discover their own innate power to heal and transform their lives from within.',
        },
    ],
};

export const DEFAULT_PRICING_PAGE: Required<PricingPageData> = {
    pageTitle: 'Pricing & Policies',
    servicesList: [
        { name: 'In-Person Limpia', duration: '60 Min', price: 100 },
        { name: 'Distance Limpia & Plática', duration: '60 Min', price: 100 },
    ],
    cancellationPolicy: 'Your time is valuable, and so is mine. Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.',
    refundsPolicy: 'All healing sessions are final sale. No refunds are provided after the service has been rendered. If you are unsatisfied, please bring it up during our plática.',
};

export const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Learning', path: '/learning' },
    { name: 'Store', path: '/store' },
    { name: 'Values', path: '/values' },
    { name: 'Healings', path: '/healings' },
    { name: 'Online Healings', path: '/online-healings' },
    { name: 'Pricing', path: '/pricing' },
] as const;

import type {
    HomePageData,
    AboutPageData,
    ServiceData,
    ValuesPageData,
    PricingPageData,
    EventsPageData,
    EventItem,
    Product,
    SiteContent,
    SiteSettings,
    VideoModule,
} from '../lib/types';

export const DEFAULT_SITE_SETTINGS: Required<Pick<SiteSettings,
    'title' | 'tagline' | 'contactEmail' | 'instagramUrl'
>> & Pick<SiteSettings, 'heroImageUrl' | 'portraitImageUrl' | 'calendlyUrl' | 'substackUrl'> = {
    title: 'Dreaming with Marisól',
    tagline: 'Spiritual Healing & Education',
    contactEmail: 'hello@example.com',
    instagramUrl: 'https://instagram.com/dreamingwithmarisol',
    calendlyUrl: '',
    heroImageUrl: '',
    portraitImageUrl: '',
    substackUrl: '',
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

export const DEFAULT_EVENTS_PAGE: Required<EventsPageData> = {
    pageTitle: 'Upcoming Events',
    pageSubtitle: 'Join us for ceremonies, workshops, and community gatherings.',
};

export const DEFAULT_EVENTS: EventItem[] = [
    {
        _id: 'default-event-1',
        title: 'Full Moon Ceremony',
        date: '2026-04-12T19:00:00-07:00',
        endDate: '2026-04-12T21:00:00-07:00',
        location: 'San Diego, CA',
        eventType: 'ceremony',
        description: 'Join us under the full moon for a sacred cleansing ceremony rooted in Mesoamerican tradition.',
        price: 35,
        imageUrl: '',
    },
    {
        _id: 'default-event-2',
        title: 'Introduction to Curanderismo',
        date: '2026-04-26T10:00:00-07:00',
        endDate: '2026-04-26T16:00:00-07:00',
        location: 'San Diego, CA',
        eventType: 'workshop',
        description: 'A day-long immersive workshop exploring the foundations of traditional Mesoamerican healing.',
        price: 120,
        imageUrl: '',
    },
    {
        _id: 'default-event-3',
        title: 'Community Meditation & Plática',
        date: '2026-05-03T18:00:00-07:00',
        endDate: '2026-05-03T19:30:00-07:00',
        location: 'Online via Zoom',
        eventType: 'online',
        description: 'A virtual gathering open to all with guided meditation and heart-to-heart plática.',
        imageUrl: '',
    },
];

export const DEFAULT_PRODUCTS: Product[] = [
    {
        _id: 'product-limpia-kit',
        title: 'Limpia Ritual Kit',
        category: 'physical',
        description: 'A curated kit of herbs, copal incense, and ritual tools for at-home energetic cleansing.',
        body: 'Use this kit to create a grounding ritual at home. Includes guidance card and cleansing prayer.',
        features: ['Copal incense', 'Ritual herbs', 'Guidance card'],
        price: 48,
        imageUrl: '',
        gallery: [],
        storeUrl: '',
        stripePaymentLink: '',
    },
    {
        _id: 'product-ancestral-audio',
        title: 'Ancestral Grounding Audio',
        category: 'digital',
        description: 'A 20-minute guided energetic reset meditation for daily grounding.',
        body: 'Instant download after checkout. Perfect for mornings, transitions, or after emotionally heavy days.',
        features: ['MP3 audio', 'Printable ritual prompt', 'Lifetime access'],
        price: 18,
        imageUrl: '',
        gallery: [],
        storeUrl: '',
        stripePaymentLink: '',
    },
];

export const DEFAULT_LEARNING_MODULES: VideoModule[] = [
    {
        _id: 'module-smoke-cleansing',
        title: 'Smoke Cleansing Fundamentals',
        duration: '18 min',
        description: 'Learn the energetic intention, prayer structure, and respectful use of sacred smoke.',
        thumbnailColor: 'bg-primary',
        videoUrl: '',
        productIds: ['product-limpia-kit'],
    },
    {
        _id: 'module-protection-practice',
        title: 'Daily Protection Practice',
        duration: '24 min',
        description: 'Build a practical daily ritual for grounding, spiritual boundaries, and energy hygiene.',
        thumbnailColor: 'bg-secondary',
        videoUrl: '',
        productIds: ['product-ancestral-audio'],
    },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
    siteSettings: DEFAULT_SITE_SETTINGS,
    homePage: DEFAULT_HOME_PAGE,
    aboutPage: DEFAULT_ABOUT_PAGE,
    inPersonService: DEFAULT_IN_PERSON_SERVICE,
    onlineService: DEFAULT_ONLINE_SERVICE,
    valuesPage: DEFAULT_VALUES_PAGE,
    pricingPage: DEFAULT_PRICING_PAGE,
    eventsPage: DEFAULT_EVENTS_PAGE,
    events: DEFAULT_EVENTS,
    learningModules: DEFAULT_LEARNING_MODULES,
    products: DEFAULT_PRODUCTS,
};

export const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Learning', path: '/learning' },
    { name: 'Store', path: '/store' },
    { name: 'Events', path: '/events' },
    { name: 'Values', path: '/values' },
    { name: 'Healings', path: '/healings' },
    { name: 'Online Healings', path: '/online-healings' },
    { name: 'Pricing', path: '/pricing' },
] as const;

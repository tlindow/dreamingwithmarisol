import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_TOKEN
if (!token) {
    console.error('SANITY_API_TOKEN environment variable is required (has read+write access)')
    console.error('Note: SANITY_DEPLOY_TOKEN is for studio deployment only, not content writes')
    process.exit(1)
}

const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    apiVersion: '2025-02-24',
    token,
    useCdn: false,
})

async function sync() {
    const tx = client.transaction()

    // ── siteSettings ──
    // Migrate from random-ID document to singleton ID, preserving existing data
    const existing = await client.fetch<Record<string, unknown> | null>(
        `*[_type == "siteSettings"][0]`
    )

    if (existing && existing._id !== 'siteSettings') {
        console.log(`Migrating siteSettings from ${existing._id} → singleton ID "siteSettings"`)
        tx.createOrReplace({
            _id: 'siteSettings',
            _type: 'siteSettings',
            title: existing.title ?? 'Dreaming with Marisól',
            tagline: 'Spiritual Healing & Education',
            heroImage: existing.heroImage,
            portraitImage: existing.portraitImage,
            calendlyUrl: existing.calendlyUrl,
            contactEmail: existing.contactEmail,
            instagramUrl: 'https://instagram.com/dreamingwithmarisol',
        })
        tx.delete(existing._id as string)
    } else if (!existing) {
        console.log('Creating siteSettings singleton')
        tx.createOrReplace({
            _id: 'siteSettings',
            _type: 'siteSettings',
            title: 'Dreaming with Marisól',
            tagline: 'Spiritual Healing & Education',
            instagramUrl: 'https://instagram.com/dreamingwithmarisol',
        })
    } else {
        console.log('Patching existing siteSettings singleton with new fields')
        tx.patch('siteSettings', (p) =>
            p.setIfMissing({
                tagline: 'Spiritual Healing & Education',
                instagramUrl: 'https://instagram.com/dreamingwithmarisol',
            })
        )
    }

    // ── homePage ──
    console.log('Creating homePage singleton')
    tx.createOrReplace({
        _id: 'homePage',
        _type: 'homePage',
        heroTitle: "Hola, I'm Marisól",
        heroSubtitle: 'Mesoamerican Cleansing Rituals & Spiritual Healing',
        offeringsTitle: 'Offerings',
        offeringsSubtitle:
            'Traditional healing practices tailored to your spiritual journey.',
        offerings: [
            {
                _key: 'offering-1',
                _type: 'object',
                title: 'In-Person Limpias',
                description:
                    'Traditional Mesoamerican spiritual cleansing to remove heavy energies and restore balance.',
                linkPath: '/healings',
            },
            {
                _key: 'offering-2',
                _type: 'object',
                title: 'Pláticas',
                description:
                    "Heart-to-heart spiritual counseling to guide you through life's transitions.",
                linkPath: '/healings',
            },
            {
                _key: 'offering-3',
                _type: 'object',
                title: 'Online Sessions',
                description:
                    'Distance healing and spiritual guidance available wherever you are.',
                linkPath: '/online-healings',
            },
        ],
    })

    // ── aboutPage ──
    console.log('Creating aboutPage singleton')
    tx.createOrReplace({
        _id: 'aboutPage',
        _type: 'aboutPage',
        pageTitle: 'About Marisól',
        bio: 'Marisól is a spiritual healer dedicated to guiding individuals through their healing journeys. With deep roots in Mesoamerican traditions, she blends ancestral wisdom with modern energetic practices to offer a holistic approach to wellness.',
        experienceSectionTitle: 'Experience & Education',
        experienceItems: [
            {
                _key: 'exp-1',
                _type: 'object',
                title: 'Curanderismo',
                description:
                    'Extensive training and initiation into traditional Mesoamerican healing practices, focusing on spiritual cleansing (Limpias) and energetic balance.',
            },
            {
                _key: 'exp-2',
                _type: 'object',
                title: 'Psychic Training',
                description:
                    "Developed intuitive abilities to assist clients in uncovering deep-seated blockages and navigating life's challenges with clarity.",
            },
            {
                _key: 'exp-3',
                _type: 'object',
                title: 'Reiki',
                description:
                    'Certified Reiki practitioner, utilizing universal life energy to promote physical, emotional, and spiritual healing.',
            },
        ],
    })

    // ── valuesPage ──
    console.log('Creating valuesPage singleton')
    tx.createOrReplace({
        _id: 'valuesPage',
        _type: 'valuesPage',
        pageTitle: 'Core Values',
        pageSubtitle: 'Guiding principles for healing and community support.',
        values: [
            {
                _key: 'val-1',
                _type: 'object',
                title: 'Ancestral Wisdom',
                description:
                    'Honoring and preserving traditional Mesoamerican healing practices passed down through generations. Keeping the roots alive.',
            },
            {
                _key: 'val-2',
                _type: 'object',
                title: 'Holistic Approach',
                description:
                    'Recognizing that true wellness encompasses the mind, body, and spirit. Healing the whole person, not just the symptom.',
            },
            {
                _key: 'val-3',
                _type: 'object',
                title: 'Accessible Care',
                description:
                    'Dedicated to providing support to the community through sliding scale options and inclusive practices whenever possible.',
            },
            {
                _key: 'val-4',
                _type: 'object',
                title: 'Empowerment',
                description:
                    'Guiding individuals to discover their own innate power to heal and transform their lives from within.',
            },
        ],
    })

    // ── pricingPage ──
    console.log('Creating pricingPage singleton')
    tx.createOrReplace({
        _id: 'pricingPage',
        _type: 'pricingPage',
        pageTitle: 'Pricing & Policies',
        servicesList: [
            {
                _key: 'svc-1',
                _type: 'object',
                name: 'In-Person Limpia',
                duration: '60 Min',
                price: 100,
            },
            {
                _key: 'svc-2',
                _type: 'object',
                name: 'Distance Limpia & Plática',
                duration: '60 Min',
                price: 100,
            },
        ],
        cancellationPolicy:
            'Your time is valuable, and so is mine. Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.',
        refundsPolicy:
            'All healing sessions are final sale. No refunds are provided after the service has been rendered. If you are unsatisfied, please bring it up during our plática.',
    })

    // ── service: In-Person ──
    console.log('Creating in-person service')
    tx.createIfNotExists({
        _id: 'service-in-person',
        _type: 'service',
        title: 'Limpia (Spiritual Cleansing)',
        slug: { _type: 'slug', current: 'limpia-spiritual-cleansing' },
        pageTitle: 'In-Person Healings',
        pageSubtitle: 'San Diego, CA',
        price: 100,
        duration: '60 Minutes',
        isOnline: false,
        description:
            'A Limpia is a traditional Mesoamerican healing practice designed to cleanse the body, mind, and spirit of heavy, stagnant energies. Using sacred smoke (copal, palo santo, or sage), fresh herbs, eggs, and prayer, this ritual restores balance to your energetic field.',
        whatToExpect:
            'We begin with a brief plática (heart-to-heart talk) to set intentions. The cleansing involves sweeping the body with herbs and using localized energetic clearing techniques. Please wear comfortable, light-colored clothing.',
        cancellationPolicy:
            'Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.',
        refundsPolicy:
            'All healing sessions are final sale. No refunds are provided after the service has been rendered.',
        preparationText:
            'Consume a light meal 1-2 hours prior. Avoid alcohol and recreational substances 24 hours before your session.',
    })

    // ── service: Online ──
    console.log('Creating online service')
    tx.createIfNotExists({
        _id: 'service-online',
        _type: 'service',
        title: 'Distance Limpia & Plática',
        slug: { _type: 'slug', current: 'distance-limpia-platica' },
        pageTitle: 'Online Sessions',
        pageSubtitle: 'Available Worldwide via Zoom',
        price: 100,
        duration: '60 Minutes',
        isOnline: true,
        description:
            'Energy knows no physical bounds. Distance healing sessions are just as effective as in-person sessions. We will connect via Zoom for a heart-to-heart discussion (plática), followed by a guided energetic clearing and meditation.',
        whatToExpect:
            'We begin with a virtual plática to set intentions and connect energetically. The session includes guided breathwork, energetic clearing techniques, and a closing meditation. Please find a quiet, private space and have a candle or glass of water nearby.',
        cancellationPolicy:
            'Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.',
        refundsPolicy:
            'All healing sessions are final sale. No refunds are provided after the service has been rendered.',
        preparationText:
            'Find a quiet, private space. Have a candle or glass of water nearby. Avoid alcohol and recreational substances 24 hours before your session.',
    })

    // ── eventsPage ──
    console.log('Creating eventsPage singleton')
    tx.createOrReplace({
        _id: 'eventsPage',
        _type: 'eventsPage',
        pageTitle: 'Upcoming Events',
        pageSubtitle:
            'Join us for ceremonies, workshops, and community gatherings.',
    })

    // ── sample events ──
    console.log('Creating sample events')
    tx.createOrReplace({
        _id: 'event-full-moon-ceremony',
        _type: 'event',
        title: 'Full Moon Ceremony',
        date: '2026-04-12T19:00:00-07:00',
        endDate: '2026-04-12T21:00:00-07:00',
        location: 'San Diego, CA',
        eventType: 'ceremony',
        description:
            'Join us under the full moon for a sacred cleansing ceremony rooted in Mesoamerican tradition. We will gather to release what no longer serves us and set intentions for the cycle ahead.',
        detailedDescription:
            'Join us under the full moon for a sacred cleansing ceremony rooted in Mesoamerican tradition. We will gather to release what no longer serves us, set intentions, and honor the lunar cycle with copal, prayer, and community.\n\nThis ceremony includes a guided group limpia, intention-setting with copal smoke, drumming, and communal prayer. All are welcome regardless of experience level. Please wear comfortable, light-colored clothing and bring an open heart.\n\nLight refreshments will be provided after the ceremony.',
        price: 35,
    })
    tx.createOrReplace({
        _id: 'event-curanderismo-workshop',
        _type: 'event',
        title: 'Introduction to Curanderismo',
        date: '2026-04-26T10:00:00-07:00',
        endDate: '2026-04-26T16:00:00-07:00',
        location: 'San Diego, CA',
        eventType: 'workshop',
        description:
            'A day-long immersive workshop exploring the foundations of traditional Mesoamerican healing. Learn about limpias, the use of herbs, the role of prayer, and how to integrate ancestral wellness practices into your daily life.',
        detailedDescription:
            'A day-long immersive workshop exploring the foundations of traditional Mesoamerican healing. Learn about limpias, the use of herbs, the role of prayer, and how to integrate ancestral wellness practices into your daily life.\n\nTopics covered:\n• History and philosophy of Curanderismo\n• Introduction to the four elements in healing\n• Hands-on herb preparation and identification\n• Guided practice: performing a basic limpia\n• Q&A and integration circle\n\nLunch and all materials are included. Space is limited to 15 participants to ensure personalized instruction.',
        price: 120,
    })
    tx.createOrReplace({
        _id: 'event-online-meditation',
        _type: 'event',
        title: 'Community Meditation & Plática',
        date: '2026-05-03T18:00:00-07:00',
        endDate: '2026-05-03T19:30:00-07:00',
        location: 'Online via Zoom',
        eventType: 'online',
        description:
            'A virtual gathering open to all. We will share a guided meditation followed by a heart-to-heart plática on navigating life transitions with spiritual awareness.',
        detailedDescription:
            'A virtual gathering open to all. We will share a guided meditation followed by a heart-to-heart plática on navigating life transitions with spiritual awareness.\n\nThis is a free community event — no prior experience needed. Zoom link will be sent after registration. Please find a quiet, private space and have a candle or glass of water nearby.',
    })

    // ── sample products ──
    console.log('Creating sample products')

    // Digital: Guided Meditation Audio
    tx.createIfNotExists({
        _id: 'product-guided-meditation',
        _type: 'product',
        title: 'Ancestral Healing Meditation — Audio Bundle',
        category: 'digital',
        price: 22,
        description:
            'Three guided meditation recordings rooted in Mesoamerican tradition. Perfect for daily practice, these audios guide you through energetic cleansing, ancestral connection, and grounding.',
        features: [
            '3 MP3 audio files (approx. 20 min each)',
            'Guided limpia visualization with copal & herbs',
            'Ancestral connection & gratitude meditation',
            'Grounding & protection practice',
            'PDF companion guide with affirmations',
            'Instant download — yours forever',
        ],
    })

    // Digital: Curanderismo E-Book
    tx.createIfNotExists({
        _id: 'product-curanderismo-ebook',
        _type: 'product',
        title: 'Introduction to Curanderismo — Digital Guide',
        category: 'digital',
        price: 18,
        description:
            'A 40-page illustrated guide to the foundations of Mesoamerican healing. Learn the history, philosophy, herbs, and rituals of Curanderismo from the comfort of home.',
        features: [
            '40-page illustrated PDF e-book',
            'History & philosophy of Curanderismo',
            'Herb profiles: copal, rue, sage, palo santo',
            'Step-by-step limpia instructions',
            'Glossary of key terms in Spanish & English',
            'Instant download — print or read digitally',
        ],
    })

    // Digital: Ritual Journal
    tx.createIfNotExists({
        _id: 'product-ritual-journal',
        _type: 'product',
        title: 'Spiritual Practice Journal — Printable',
        category: 'digital',
        price: 12,
        description:
            'A beautifully designed 30-page printable journal for tracking your spiritual practice, moon cycles, dreams, and healing intentions. Print at home on any standard paper.',
        features: [
            '30 printable pages (US Letter & A4)',
            'Moon cycle tracker',
            'Dream & vision journal pages',
            'Weekly intention-setting spreads',
            'Gratitude & release practice prompts',
            'Instant download PDF',
        ],
    })

    // Physical: Limpia Starter Kit
    tx.createIfNotExists({
        _id: 'product-limpia-kit',
        _type: 'product',
        title: 'Limpia Starter Kit',
        category: 'physical',
        price: 45,
        description:
            'Everything you need to perform a basic spiritual cleansing at home. Curated by Marisól, this kit includes ethically sourced herbs, copal resin, and a beginner\'s instruction card.',
        features: [
            'Dried rue bundle (ruda)',
            'White sage bundle',
            'Copal resin (approx. 1 oz)',
            'Palo santo stick',
            'Small charcoal disk for resin burning',
            'Hand-written instruction card by Marisól',
        ],
    })

    // Physical: Crystal Set
    tx.createIfNotExists({
        _id: 'product-crystal-set',
        _type: 'product',
        title: 'Curandera Crystal Collection',
        category: 'physical',
        price: 38,
        description:
            'A hand-selected set of five crystals commonly used in Mesoamerican healing practice. Each stone is cleansed and charged before shipping.',
        features: [
            'Black tourmaline (protection)',
            'Clear quartz (amplification)',
            'Rose quartz (heart healing)',
            'Obsidian (grounding)',
            'Amethyst (intuition)',
            'Drawstring pouch included',
            'Crystal meaning card',
        ],
    })

    // ── Commit ──
    console.log('\nCommitting transaction...')
    const result = await tx.commit()
    console.log(`Transaction committed. ${result.results.length} mutations applied.`)

    // ── Verify ──
    const docs = await client.fetch<{ _id: string; _type: string }[]>(
        `*[_type in ["siteSettings","homePage","aboutPage","valuesPage","pricingPage","eventsPage","service","videoModule","product","event"]]{_id, _type}`
    )
    const counts: Record<string, number> = {}
    for (const d of docs) {
        counts[d._type] = (counts[d._type] ?? 0) + 1
    }
    console.log('\nDocument counts:')
    for (const [type, count] of Object.entries(counts).sort()) {
        console.log(`  ${type}: ${count}`)
    }
}

sync().catch((err) => {
    console.error('Sync failed:', err)
    process.exit(1)
})

export const SITE = {
  name: 'Dreaming with Marisól',
  url: 'https://dreamingwithmarisol.com',
  email: 'dreamingwithmarisol@gmail.com',
  instagramUrl: 'https://instagram.com/dreamingwithmarisol',
  tiktokUrl: 'https://tiktok.com/@dreamingwithmarisol',
  substackUrl: 'https://dreamingwithmarisol.substack.com/',
  instagramHandle: '@dreamingwithmarisol',
} as const

export const CANCELLATION_POLICY =
  'Please note that there is a $10.00 fee for cancelling an appointment after scheduling. There is no refund that can be provided after beginning, receiving, and/or completing the session service. Before booking your appointment, it is highly advised to have already made plans with your personal and employment schedules in order to guarantee your attendance.'

export type NavLink = { name: string; href: string; external?: boolean }

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Values', href: '/values' },
  { name: 'Limpias', href: '/limpias' },
  { name: 'Shop', href: '/shop' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Newsletter', href: SITE.substackUrl, external: true },
]

export type CalendlyEvent = {
  name: string
  url: string
  priceLabel: string
  durationLabel: string
}

export const CALENDLY_EVENTS: CalendlyEvent[] = [
  {
    name: '1 hour Limpias: Mesoamerican Cleansing Rituals',
    url: 'https://calendly.com/d/dtn2-5r9-6d9/1-hour-limpias-mesoamerican-cleansing-rituals',
    priceLabel: '$100',
    durationLabel: '1 hour private limpia ceremony with a full plática',
  },
  {
    name: '30 minute Limpias: Mesoamerican Cleansing Rituals',
    url: 'https://calendly.com/d/5hf-nrz-dtk/30-minute-limpias-mesoamerican-cleansing-rituals',
    priceLabel: '$45',
    durationLabel: '30 minute private limpia session',
  },
]

export const BOOKING_BANNER =
  'Hola! I currently do not have availability, but I will have more sessions open for the month of October. You can stay updated by subscribing to my newsletter!'

export type Section = {
  heading?: string
  paragraphs: string[]
  image?: { src: string; alt: string; caption?: string }
}

export type PageCopy = {
  slug: string
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroSubtitle?: string
  image?: string
  imageAlt: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  sections: Section[]
}

export const HOME = {
  seoDescription:
    'Spiritual healing with Marisól in San Diego. Limpias, pláticas, and prayers held with the ancestors and the Great Spirits.',
  heroTitle: "Hola I'm Marisól 🌞",
  heroSubtitle:
    'Along with your ancestors and the Great Spirits, I am here to support you in your spiritual healing journey 🌹🙏🏼',
  heroImage: '/gallery/home-hero.webp',
  quote:
    'The Ancestors are calling, the trees are waiting, and the Earth welcomes your spirit back to wholeness.',
  limpiasTitle: 'Limpias: Mesoamerican Cleansing Rituals',
  limpiasSubtitle:
    'Spiritual healing sessions where we invoke the Great Spirits to heal and provide gentle love.',
  limpiasImage: '/gallery/home-limpias.webp',
  links: [
    { label: 'about me', href: '/about' },
    { label: 'my values', href: '/values' },
    { label: 'limpias', href: '/limpias' },
    { label: 'pricing and cost', href: '/pricing' },
    { label: 'newsletter', href: SITE.substackUrl, external: true },
    { label: 'reviews', href: '/reviews' },
    { label: 'shop', href: '/shop' },
  ],
}

export const PAGES: Record<string, PageCopy> = {
  about: {
    slug: 'about',
    seoTitle: 'About',
    seoDescription:
      'Training and education behind Dreaming with Marisól: curanderismo, herbalism, and the teachers who inform the practice.',
    heroTitle: 'Marisól (she/her)',
    heroSubtitle: 'training and education',
    image: '/gallery/about.webp',
    imageAlt: 'Marisól',
    primary: { label: 'Book a Session', href: '/book-your-session' },
    secondary: { label: 'Learn more', href: '/values' },
    sections: [
      {
        paragraphs: [
          'On this page, you will find my training and education that now inform my offerings and services. I am a student who is still studying and learning. With this said, despite being a student, I believe that with the heart and intentions that I have, the spiritual work I offer can still support you on your healing and spiritual journey.',
          'The list below is not a full representation of my capabilities, but I believe in sharing my schooling as transparency.',
        ],
      },
      {
        heading: 'Curanderismo',
        paragraphs: [
          "My family's ancestry comes from the Sonoran Desert, Mexico as well as the Yucatán peninsula.",
          'Curanderismo is an ancestral, traditional system of healing that is called the three headed serpent: an eclectic practice comprised of Spanish, African, and Meso-American Indigenous practices. Curanderismo is a spiritual practice that encompasses herbalism, astral journeying, limpias/spiritual cleansing ceremonies, bodywork, and so much more. Curanderismo is one of the ways that I incorporate my ancestral roots into the work that I do.',
          'Curanderismo is a life-long path that I am excited to embark on. As of now, I am a student learning under the mentorship of Curandera Erika Buenaflor. Curandera Erika Buenaflor has a number of books that teaches common curanderismo practices and history that I highly suggest reading to begin your journey of self-healing with the Earth. You can find out more about my teacher by visiting her website: https://www.realizeyourbliss.com/',
        ],
      },
      {
        heading: 'Herbalism',
        paragraphs: [
          'My grandmothers from both my maternal and paternal lineage always kept their gardens beautiful and alive. I have many memories of my family taking care of my stomach pains and empacho with the help of yerba buena y manzanilla (spearmint and chamomile).',
          'I began walking the green path more intensively when I realized that my health needed herbal allies and support. And now, I am happy to create remedies and medicines that can support you on your own journey too!',
          'I am rooting my herbal studies with Traditional Mexican Medicine as well as with Western Herbalism and Vitalism.',
        ],
      },
      {
        heading: 'Sobadas and Healing Touch',
        paragraphs: [
          "I am still very new to this work and do not offer this to the public, yet. But I would like to share that my maternal grandmother was a Curandera and Sobadora for the children of her pueblo near Tecate. She tended to my empachos with many sobadas and herbal oils as I grew up in her household. I have recently felt the calling to finally step into this inheritance and my family's don.",
          'I am now learning with two indigenous, Maya maestras from Chumbec, Yucatán: Nana Rafita and her daughter, Maestra Mary. Additionally, I am continuing my studies with Maestra Metztli here in San Diego, CA.',
          'It is in my plans to offer sobadas in a few years once my teachers tell me I am ready.',
        ],
      },
      {
        heading: 'More education and modalities',
        paragraphs: [
          'Budding Herbalist Apprenticeship with Herbalist Cindy Saylor',
          'Elemental Herbalism with Maestra Mars, Dose of Diosa',
          'School of Healing and Earth Medicine with Maestra Mars, Dose of Diosa',
          'Seeds of Herbalism with Herbalist Cindy Saylor',
          'Escuela de Herbolaria Energética with Maestra Emilia Yolozintli',
          'Psychic Development with Boulder Psychic Institute',
          "The Divine Alignment Activator with Bela Divine",
          "The Fool's Journey with Lisa Quigley",
          'Astrology with Sydney Astrology School',
          'Mediumship with Arthur Findlay College',
          'Tarot with Biddy Tarot',
          'Reiki 1 and 2, Reiki Holy Fire 1 and 2 certifications',
          'and many, many books and other classes, as well as my own life journey experiences!',
        ],
      },
    ],
  },
  values: {
    slug: 'values',
    seoTitle: 'Values',
    seoDescription:
      'Guiding principles that inform Marisól’s healing practice: holistic care, ancestral healing, and community support.',
    heroTitle: 'My Guiding Principles',
    heroSubtitle: 'values that inform my practice',
    image: '/gallery/values.webp',
    imageAlt: 'Flowers and offerings',
    primary: { label: 'Book a Session', href: '/book-your-session' },
    secondary: { label: 'Learn more', href: '/about' },
    sections: [
      {
        paragraphs: [
          'Below is a list of guiding principles and values that inform the way I work with others. I am committed to continue growing, learning, and developing a practice that is loving, effective, and honorable. Thank you for being here and allowing me to work with you!',
        ],
      },
      {
        heading: 'I am Marisól',
        paragraphs: [
          'In the healing room, I do not embody a detached, depersonalized, and all-knowing white male professional. I embody Marisól. I am a woman in her 30s, laughs a lot, enjoys reading symbolic poetry, prefers savory snacks over sweets, obsessed with her garden, loves her pets, married to her best friend, eldest sister of three, daughter of immigrants, bilingual, mixed-race, family from México, anti-colonial politic, and so much more.',
        ],
      },
      {
        heading: 'Holistic Approach',
        paragraphs: [
          'I do not treat the mind alone, I work with the whole being: heart, body, and soul. Our society promotes logic over everything else which results in overthinking, rumination, and dissociation. It is imperative for me that in the healing room, we approach the totality of who you are.',
        ],
      },
      {
        heading: 'Community Support',
        paragraphs: [
          'I empower you to cultivate a sense of belonging and to identify the people around you who can support you on your journey. Healing is much more effective and powerful when we open ourselves up to be supported and loved.',
        ],
      },
      {
        heading: 'Responsive to Collective Trauma',
        paragraphs: [
          'I consider the health and wellness of the communities you are a part of and how they are affected by systemic and institutional bodies. Trauma is collective, not just individual and that is why we will address the history, culture, and current anxieties of your people when learning more about your own personal experiences and healing process.',
        ],
      },
      {
        heading: 'Ancestral Healing',
        paragraphs: [
          'I honor your ancestors and families, their stories and histories, for you to bring peace to your lineage, your relationships, and the body you have inherited. By engaging in ancestral practices and medicines, we awaken a remembrance and a reclamation to what colonization and ongoing cultural erasure took from you and your ancestors.',
        ],
      },
      {
        heading: 'Harmonizing Care',
        paragraphs: [
          'I do not blame the individual, diagnose, nor believe you are dirty or sinful. I do not believe that there is something inherently wrong with you. When conducting limpias, we are bringing energetic balance and harmony back to the body, mind, and spirit.',
        ],
      },
      {
        heading: 'Relationship to the Earth',
        paragraphs: [
          'Great Mother, also known as the Earth, Pachamama, the Goddess, Divine Mother, Creator, Source, God, etc. is my guiding light in all of the work that I do. In every session, she is honored, called upon, and acknowledged. As her earthly children, we work with her and the elements to heal ourselves, our loved ones, and the earth itself.',
        ],
      },
      {
        heading: 'You are the Healer',
        paragraphs: [
          'I believe in you to act as your own personal Healer and I am here to support you in stepping into that role for yourself. In this way, you become more and more confident in your ability to create a life you love!',
        ],
      },
    ],
  },
  limpias: {
    slug: 'limpias',
    seoTitle: 'Limpias',
    seoDescription:
      'In-person limpia ceremonies in San Diego. A plática, cleansing with the elements, and a closing prayer. Sessions are $100 or $45.',
    heroTitle: 'Limpias: Mesoamerican Cleansing Rituals',
    heroSubtitle: "heal your spirit while being held gently in Great Spirit's arms 🌿🥚🌹",
    image: '/gallery/limpia-room.webp',
    imageAlt: 'The healing room',
    primary: { label: 'Book Your Session', href: '/book-your-session' },
    sections: [
      {
        image: {
          src: '/gallery/limpia-room.webp',
          alt: 'Healing room prepared for a limpia',
          caption: 'Limpias in San Diego are conducted in the privacy of the Healing Room located at my residence.',
        },
        paragraphs: [
          'All sessions begin with a plática, a heart-to-heart conversation. Derived from my indigenous ancestors in Mesoamerica, a plática is a method of cleansing the spirit from all the feelings, thoughts, and energies that a person has been holding onto surrounding an issue. This conversation allows the spirit to speak its truth, to be seen, and to be understood. During this conversation, you may also be provided an herbal tea based on your soul’s need.',
        ],
      },
      {
        image: {
          src: '/gallery/limpia-elements.webp',
          alt: 'Natural elements used in a limpia',
          caption: 'We use the grace of Great Spirit and the natural elements to heal your soul 🙏🏼',
        },
        paragraphs: [
          'After a heart-to-heart talk, depending on what was said, I will use a number of rituals and cleansing methods to support your healing journey. These methods are called limpias and include the use of smoke, singing, rattles, herbs, egg, lemons, garlic, tobacco, florida water, and more.',
          'With the guidance of the Great Spirits, if needed, we will take you on a journey through the spirit world to support your healing. During your astral travels, you will also be receiving healing touch with the use of my hands on your energy bodies. Sessions end with planning out next steps and reciting a closing prayer.',
        ],
      },
      {
        heading: 'Cancellation and Refund Policy',
        paragraphs: [CANCELLATION_POLICY],
      },
    ],
  },
  'virtual-limpias': {
    slug: 'virtual-limpias',
    seoTitle: 'Virtual Limpias',
    seoDescription:
      'How virtual limpia sessions have been offered. Virtual limpias are not currently scheduled.',
    heroTitle: 'Virtual Limpias',
    heroSubtitle: 'A limpia ceremony guided either through phone or video call 🌿',
    image: '/gallery/virtual.webp',
    imageAlt: 'Elements for a virtual limpia',
    primary: { label: 'See in-person sessions', href: '/book-your-session' },
    secondary: { label: 'Newsletter', href: SITE.substackUrl },
    sections: [
      {
        paragraphs: [
          'Virtual limpias are not offered right now. The notes below are here so the practice stays visible. In-person sessions are the ones currently open on the calendar.',
          'Virtual limpia sessions are a great opportunity to receive cleansing, healing, and empowerment even if you do not live nearby! This is a great option if you are sick or unable to leave your home as well.',
          'However, unlike in-person sessions, Virtual Limpias will require you to gather materials beforehand.',
          'When you book a Virtual Session, you will receive a list of materials needed for you to gather and prepare. With the list, you will also receive a video that explains each of the materials needed.',
          'Virtual sessions begin with an opening prayer followed by a plática, which is a heart straightening talk meant for you to release your burdens, stress, and blockages. After the plática, I will then guide you through a self-limpia along with providing medicine songs and prayers.',
          'Although virtual sessions are not in-person, people have reported to feel cleansed, inspired, and energized after receiving the virtual limpias!',
        ],
      },
      {
        heading: 'Cancellation and Refund Policy',
        paragraphs: [CANCELLATION_POLICY],
      },
    ],
  },
  pricing: {
    slug: 'pricing',
    seoTitle: 'Fair Trade Policy',
    seoDescription:
      'The fair trade policy for sessions with Marisól: a mutual exchange of care, with room for groceries, produce, and art when full price is not possible.',
    heroTitle: 'Fair Trade Policy',
    heroSubtitle: 'a foundation of mutual aid and care 🙏🏼🌼',
    image: '/gallery/pricing.webp',
    imageAlt: 'Marigold flowers',
    primary: { label: 'Book Your Session', href: '/book-your-session' },
    secondary: { label: 'Limpias', href: '/limpias' },
    sections: [
      {
        paragraphs: [
          'The limpias I offer rest on a foundation of mutual respect and gratitude. It is my intention that at the very core of our work together, we exchange energies fairly and honestly. I call this the fair trade policy.',
          'I offer my time, my dedication, and my upmost care to support you in your healing and spiritual journeys. In exchange, I ask for you to show your genuine gratitude towards me and the sacred medicine of my ancestors.',
          'If you are unable to pay full price for your session, then we can talk about other ways to honor our exchange of goods. Some have chosen to support my work by providing me groceries, produce, and food to tend to my health and my family. Artists and creatives have shared with me their own beautiful gifts, artwork, and creations. We are building a relationship and this requires giving openly from the both of us.',
          'My intention is to create meaningful and authentic connections where both parties, myself and you, are taken care of. I trust that you will respect my work, this holy medicine, and show your gratitude honestly and freely! Thank you so much for being here.',
        ],
      },
      {
        heading: 'Session prices',
        paragraphs: [
          '1 hour private limpia ceremony with a full plática: $100.',
          '30 minute private limpia session: $45.',
          'Payment for sessions is collected by Calendly when you book. Those prices stay on the calendar, not in a separate checkout on this site.',
        ],
      },
      {
        heading: 'Cancellation and Refund Policy',
        paragraphs: [CANCELLATION_POLICY],
      },
    ],
  },
  reviews: {
    slug: 'reviews',
    seoTitle: 'Reviews',
    seoDescription: 'What people have shared after limpias and soul retrieval sessions with Marisól.',
    heroTitle: 'What People Are Saying',
    heroSubtitle: 'notes from people who have sat in session',
    image: '/gallery/reviews.webp',
    imageAlt: 'A note from a session',
    sections: [
      {
        heading: 'One person says...',
        paragraphs: [
          "My first limpia with Marisól was last month and to this day, cannot stop thinking about it!!! I never realized how severely my spirit had been affected by my family and their rejection of my identity. I learned about the parallels of prayers and curses which was pretty amazing to me. During our cleanse, I was also able to connect with my late grandfather, a priceless gift that Marisól was so kind to give to me. Most importantly, I was able to work on a wound that, before, was almost impossible for me to work on because of my faint memory but with Marisól, her patience and words helped me connect dots I didn't even know were there. I am very grateful for her kindness and willingness to connect with me. I am looking forward to working with her again soon!",
        ],
      },
      {
        heading: 'Another person says...',
        paragraphs: [
          'Marisól has helped me by reconnect with myself, including my inner child. I used to be very hard on myself for my mistakes (present/past), but through Marisól I have learned to give myself grace & how to be kinder to my heart and soul. I want her to know that because of my session, I base a lot of my decisions on how it would help my inner child, how she would feel; because of this, I know I deserve respect, patience, and love. This has helped my confidence with decision making and it allows me to live a lot more peaceful, lighter even. ♡',
        ],
      },
      {
        heading: 'After a soul retrieval with the spirit of Great Mother, this person says...',
        paragraphs: [
          "I had a beautiful session with Marisól and Great Mother. Marisól made me feel safe and I was able to speak with her about what was going on lately and what I felt I needed to work on. The session was so magical and so beautiful. Marisól explained to me and guided on how the session was going to look like. I was able to see and experience everything. I was able to see something change on what I had a hard time getting to for a while now and all I see is Great Mother helping me bring it out and transmute it. It was a beautiful integration between Great mother and myself. I thank you Marisól for being the bridge and the beautiful work you do with Great Mother. It's only been a few days but I feel like myself once again after a few months of darkness. Thank you thank you!",
        ],
      },
      {
        heading: "Here's what someone said after their very first limpia...",
        paragraphs: [
          "Marisól has helped me by allowing me to be vulnerable and open when I hadn’t been in a long time. There are things that I needed out of my system and mind that were released with help of the limpia and afterwards I felt relaxed and cared for by them and their practices. I also really enjoyed how I had homework and ways to continue practice at home. I am grateful to have experienced my first limpia with her and hope to work more in the future!! Thank you again for offering the space and time and energy to help me.",
        ],
      },
      {
        heading: 'In limpias, many find healing for their past, especially their childhood...',
        paragraphs: [
          "With the support of Marisól, I have been able to tend to my childhood self in ways that for many years i’ve been trying to get a hold of. I have been tending to the wounds that my parents have left and am learning to let my rage channel through my body and into madre tierra. I am learning to reclaim the many emotions that I carry that did not start with me, but with my ancestors. As an undocu person, I've felt so disconnected from the land, feeling a lack of belonging. I’m learning that the land and myself are in a parallel process, that we are both one navigating a colonial system meant to disconnect us. I’m being reminded that my (tr)ancestors are right here with me.",
        ],
      },
    ],
  },
  'shop-la-botanica': {
    slug: 'shop-la-botanica',
    seoTitle: 'La Botanica',
    seoDescription: 'Tools for self-healing, picked up in San Diego. Online sales are not offered right now.',
    heroTitle: 'La Botanica',
    heroSubtitle: 'tools for self-healing 🌿',
    image: '/gallery/botanica.png',
    imageAlt: 'La Botanica',
    sections: [
      {
        paragraphs: [
          'These kits are listed for local pickup in San Diego. They are not for sale through the website checkout.',
        ],
      },
    ],
  },
  'copalero-kit': {
    slug: 'copalero-kit',
    seoTitle: 'The Copalero Kit',
    seoDescription: 'The Copalero Kit, $75, for pickup in San Diego. Terracotta copalero, white copal, charcoal, and matches.',
    heroTitle: 'The Copalero Kit',
    heroSubtitle: '$75.00 (pick up in San Diego)',
    image: '/gallery/copalero.webp',
    imageAlt: 'Terracotta copalero',
    sections: [
      {
        paragraphs: [
          "The Copalero Kit has everything you need to begin your relationship to one of Mesoamerica's most sacred resins: the Copal.",
          'Copal is a resin that is sourced from the copal tree, Protium Copal. This resin carries the power to both raise the vibrations of a space and cleanse the spirit of unwanted energies. Mesoamerican Indigenous peoples also burned Copal Smoke as an offering to the spirits and natural elements.',
          'In this kit you will receive: a terracotta copalero, high grade sustainably sourced white copal resin from Puebla, Mexico, 10 charcoal tablets, and a small box of matches.',
          'How to use: Go outside and retrieve tierra from the ground. Always say thank you to the Earth for sharing her tierra with you. Place the tierra in the copalero.',
          'Now, light a match and burn the charcoal tablet until it begins to spark and emit smoke. Place the charcoal tablet upon the dirt in the copalero.',
          'Add a bit of copal resin and say a prayer of gratitude for its healing and clearing properties.',
          'You can use it to cleanse a space. Or you can place the copalero on the ground for the smoke to rise and you can stand above it and be embraced and cleansed by the smoke. Amen!',
          'To buy this kit, direct message @dreamingwithmarisol. It is pickup in San Diego, not an online checkout.',
        ],
      },
    ],
  },
  'self-limpia': {
    slug: 'self-limpia',
    seoTitle: 'The Self-Limpia Kit',
    seoDescription: 'The Self-Limpia Kit, $20, for pickup in San Diego. A seed rattle, florida water, and anointing oil.',
    heroTitle: 'The Self-Limpia Kit',
    heroSubtitle: '$20.00 (pick up in San Diego)',
    image: '/gallery/self-limpia.webp',
    imageAlt: 'Self-limpia kit',
    primary: { label: 'Buy Now', href: 'https://forms.gle/ZDGsJ3biYQz15CFd7' },
    sections: [
      {
        paragraphs: [
          'This Self-Limpia Kit has the basic tools needed to keep your energy clear and protected as you live your day-to-day life!',
          'In this kit you will receive: a peruvian seed rattle, florida water, and anointing oil.',
          'How to use: First, say a prayer to the spirits that protect you to come forward for this cleansing practice. Use the seed rattle to shake off energies that are no longer needed. Breathe deeply as you shake it all off.',
          'Then, place some florida water into your hands. Rub the liquid all over your hands and smell them. Take deep long breaths. Imagine the aroma entering your body and cleansing you from the inside out. Take a little more florida water and rub it all over your body! You will smell clean and delightful!',
          'Lastly, open the anointing oil and tap some onto your finger. Place this oil on your forehead. Pray for protection. Pray for focus and positive, uplifting thoughts. Pray for a beautiful day ahead!',
          'End this cleansing ritual with a sincere "Thank You" to your spirits and ancestors who held you during this time. Amen!',
          'Pickup in San Diego. The Buy Now button opens the existing request form.',
        ],
      },
    ],
  },
  'calendula-essence': {
    slug: 'calendula-essence',
    seoTitle: 'Calendula Flower Essence',
    seoDescription:
      'Calendula Flower Essence, $10, made from home-grown calendula. Pickup in San Diego.',
    heroTitle: 'Calendula Flower Essence',
    heroSubtitle: '$10.00 (pick up in San Diego)',
    image: '/gallery/calendula.webp',
    imageAlt: 'Calendula flowers',
    primary: {
      label: 'Buy Now',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLScRQ1RdRqswBVCZJgF8HZJlE8asTRYJ7c_jC_ThDeyKlqP1dA/viewform?usp=header',
    },
    sections: [
      {
        paragraphs: [
          'This Calendula Flower Essence was created with calendula flowers that I personally grew from seed in my garden. I was inspired to craft this gentle medicine after many neighbors kept commenting on the beauty and joy they saw in the flowers as they passed by my home. I realized that calendula brings out a smile, a soft reminder of the joy in ordinary life. By sitting with this flower, you will inspired to connect to your spark, your innermost joy!',
          'To sit with Calendula Flower Essence, simply take some time to slow down and breathe. You can choose to take a few drops under the tongue, or you can add some to a glass of water. As you taste the essence, imagine the bright yellow flower turning towards you and sharing its medicine with you. Ask it to guide you towards laughter, peace, and happiness.',
          'Ingredients: water infused with calendula flowers, vegetable glycerine, and spring water.',
          'Pickup in San Diego. The Buy Now button opens the existing request form.',
        ],
      },
    ],
  },
}

export type CatalogProduct = {
  slug: string
  title: string
  description: string
  amountCents: number
  stripePriceId?: string
  status: 'available' | 'coming-soon'
  blobPath?: string
  fileUrl?: string
  beaconsProductId: string
  postPurchaseMessage?: string
  image: string
}

export const PRODUCTS: CatalogProduct[] = [
  {
    slug: 'a-book-of-prayers',
    title: 'A Book of Prayers',
    description:
      'A book of 6 prayers meant to support you in creating a relationship with the Unseen World. This guidebook is here to teach you how to have communication with the spirits you believe in. We must learn that it is possible for our prayers to be heard and answered! With this guide, you will learn how to listen and allow for spirits to respond to your invocations of prayer.',
    amountCents: 500,
    status: 'available',
    beaconsProductId: '21ffffb3-1ad3-43d6-ae68-8425a92e4a3c',
    postPurchaseMessage: 'Hope you enjoy this guidebook! ✨',
    image: '/gallery/prayers.webp',
  },
  {
    slug: 'enter-the-cosmic-ocean',
    title: 'Enter the Cosmic Ocean',
    description:
      'A 60 page digital magazine meant to inspire you through the magick of the ocean. This work is inspired from my spiritual relationship with a beautiful spirit: Mother Ocean. She allowed me to swim into the depths of my healing and return to the surface feeling like a whole new person. I pray this magazine inspires you on your own personal healing and spiritual journey!',
    amountCents: 900,
    status: 'coming-soon',
    beaconsProductId: '23fbccb1-5fb5-4260-96f6-89e0165d154e',
    image: '/gallery/cosmic.webp',
  },
]

export const INSTAGRAM_POSTS: { src: string; href: string }[] = [
  { src: '/instagram/01.jpg', href: 'https://www.instagram.com/p/DDX6jp2y719/' },
  { src: '/instagram/02.jpg', href: 'https://www.instagram.com/reel/DDK1iozymWg/' },
  { src: '/instagram/03.jpg', href: 'https://www.instagram.com/p/DDFLNspv6Tw/' },
  { src: '/instagram/04.jpg', href: 'https://www.instagram.com/p/DCs4y23Rkob/' },
  { src: '/instagram/05.jpg', href: 'https://www.instagram.com/p/DCLQgSJxAUQ/' },
  { src: '/instagram/06.jpg', href: 'https://www.instagram.com/p/DCGRF-2xOXU/' },
  { src: '/instagram/07.jpg', href: 'https://www.instagram.com/p/DCE3HSbviEg/' },
  { src: '/instagram/08.jpg', href: 'https://www.instagram.com/p/DCCJ_bhP0oE/' },
  { src: '/instagram/09.jpg', href: 'https://www.instagram.com/reel/DCAZPD0yuxL/' },
  { src: '/instagram/10.jpg', href: 'https://www.instagram.com/p/DB4R7Rry2FS/' },
  { src: '/instagram/11.jpg', href: 'https://www.instagram.com/p/DBwWyHGyNLo/' },
  { src: '/instagram/12.jpg', href: 'https://www.instagram.com/p/DBfR2JcvCzz/' },
  { src: '/instagram/13.jpg', href: 'https://www.instagram.com/p/DBdNfKARY7l/' },
  { src: '/instagram/14.jpg', href: 'https://www.instagram.com/p/DBYiXxbp8D4/' },
  { src: '/instagram/15.jpg', href: 'https://www.instagram.com/p/DBYZ0LiJj3H/' },
]

export const SITEMAP_PATHS = [
  '/',
  '/about',
  '/values',
  '/limpias',
  '/virtual-limpias',
  '/pricing',
  '/book-your-session',
  '/reviews',
  '/shop',
  '/shop/a-book-of-prayers',
  '/shop/enter-the-cosmic-ocean',
  '/shop-la-botanica',
  '/copalero-kit',
  '/self-limpia',
  '/calendula-essence',
]

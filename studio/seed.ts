import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function seed() {
    console.log('Setting up Site Settings...')

    // Check if siteSettings already exists
    const existingSettings = await client.fetch(`*[_type == "siteSettings"][0]`)
    
    if (existingSettings) {
        console.log('Site Settings already exists. Updating with typography, emojis, and text content...')
        
        await client
            .patch(existingSettings._id)
            .set({
                typography: {
                    primaryFont: 'Outfit',
                    primaryFontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap',
                    secondaryFont: 'Playfair Display',
                    secondaryFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap',
                },
                emojis: {
                    heroEmoji: '✨',
                    brandEmoji: '🌙',
                    decorativeEmojis: ['🍨', '✨', '🌙', '🕯️', '🌸'],
                    sectionEmojis: {
                        about: '🌿',
                        services: '🕯️',
                        store: '🍨',
                        learning: '📚',
                    },
                },
                textContent: {
                    heroTitle: "Hola, I'm Marisól",
                    heroSubtitle: 'Mesoamerican Cleansing Rituals & Spiritual Healing',
                    siteDescription: 'Traditional healing practices and spiritual guidance',
                },
            })
            .commit()
        
        console.log('Site Settings updated successfully!')
    } else {
        console.log('Creating new Site Settings document...')
        
        const settings = await client.create({
            _type: 'siteSettings',
            title: 'Dreaming with Marisól',
            typography: {
                primaryFont: 'Outfit',
                primaryFontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap',
                secondaryFont: 'Playfair Display',
                secondaryFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap',
            },
            emojis: {
                heroEmoji: '✨',
                brandEmoji: '🌙',
                decorativeEmojis: ['🍨', '✨', '🌙', '🕯️', '🌸'],
                sectionEmojis: {
                    about: '🌿',
                    services: '🕯️',
                    store: '🍨',
                    learning: '📚',
                },
            },
            textContent: {
                heroTitle: "Hola, I'm Marisól",
                heroSubtitle: 'Mesoamerican Cleansing Rituals & Spiritual Healing',
                siteDescription: 'Traditional healing practices and spiritual guidance',
            },
        })

        console.log(`Created Site Settings (ID: ${settings._id})`)
    }

    console.log('Seeding dummy eCommerce product...')

    const product = await client.create({
        _type: 'product',
        title: 'Sacred Copal Resin (Dummy)',
        price: 24.99,
        description: 'Aura cleansing resin for your spiritual practice. 100% natural. (This is a dummy product for testing).',
        storeUrl: 'https://buy.stripe.com/test_12345'
    })

    console.log(`Created product: ${product.title} (ID: ${product._id})`)

    console.log('Seeding dummy learning video...')
    const video = await client.create({
        _type: 'videoModule',
        title: 'Intro to Cleansing Smoke (Dummy)',
        duration: '15 mins',
        description: 'Learn how to properly light and work with Copal. This dummy video demonstrates the UI connection to the store products.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy
        thumbnailColor: 'bg-accent',
        order: 0,
        products: [
            {
                _type: 'reference',
                _ref: product._id,
                _key: 'prod_ref_1'
            }
        ]
    })

    console.log(`Created video module: ${video.title} (ID: ${video._id})`)
    console.log('Finished seeding Sanity data!')
}

seed().catch((err) => {
    console.error("Failed to seed data:", err)
    process.exit(1)
})

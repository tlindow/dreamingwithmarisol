/**
 * Setup script to configure Sanity CMS with typography, emojis, and text content
 * This script uses the Sanity client to create/update siteSettings
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-02-24',
    token: process.env.SANITY_API_TOKEN, // Optional: if you have a token with write access
});

async function setupSiteSettings() {
    console.log('🔧 Setting up Site Settings in Sanity CMS...\n');

    try {
        // Check if siteSettings already exists
        const existingSettings = await client.fetch(`*[_type == "siteSettings"][0]`);

        const settingsData = {
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
        };

        if (existingSettings) {
            console.log('📝 Updating existing Site Settings...');
            const result = await client
                .patch(existingSettings._id)
                .set(settingsData)
                .commit();
            console.log('✅ Site Settings updated successfully!');
            console.log(`   Document ID: ${result._id}\n`);
        } else {
            console.log('🆕 Creating new Site Settings document...');
            const result = await client.create(settingsData);
            console.log('✅ Site Settings created successfully!');
            console.log(`   Document ID: ${result._id}\n`);
        }

        // Verify the settings
        console.log('🔍 Verifying settings...');
        const verified = await client.fetch(`
            *[_type == "siteSettings"][0] {
                title,
                typography,
                emojis,
                textContent
            }
        `);

        console.log('📋 Current Settings:');
        console.log(JSON.stringify(verified, null, 2));
        console.log('\n✨ Setup complete! Your frontend will now use these CMS-managed values.');

    } catch (error) {
        if (error.statusCode === 401 || error.statusCode === 403) {
            console.error('❌ Authentication error:');
            console.error('   The Sanity client needs write permissions.');
            console.error('   Please run this setup manually in Sanity Studio:');
            console.error('   1. Open http://localhost:3333');
            console.error('   2. Go to "Site Settings & Images"');
            console.error('   3. Use the values from studio/siteSettings.json');
            console.error('\n   Or set SANITY_API_TOKEN environment variable with a token that has write access.');
        } else {
            console.error('❌ Error setting up Site Settings:', error);
        }
        process.exit(1);
    }
}

setupSiteSettings();

/**
 * Browser Console Setup Script
 * 
 * This script can be run directly in the browser console while logged into Sanity Studio
 * It uses the Studio's authenticated session to create/update site settings
 * 
 * Instructions:
 * 1. Open Sanity Studio at http://localhost:3333
 * 2. Log in
 * 3. Open browser DevTools (F12)
 * 4. Go to Console tab
 * 5. Copy and paste this entire script
 * 6. Press Enter
 */

(async function setupSiteSettings() {
  console.log('🔧 Setting up Site Settings in Sanity CMS...\n');

  try {
    // Get the Sanity client from the Studio's context
    // The Studio exposes the client via window.__sanity
    const sanityClient = window.__sanity?.client || window.sanity?.client;
    
    if (!sanityClient) {
      // Try to get it from the Studio's internal state
      const studioApp = document.querySelector('[data-testid="studio-app"]');
      if (!studioApp) {
        throw new Error('Could not find Sanity Studio client. Make sure you are logged into the Studio.');
      }
      
      // Alternative: use fetch with the Studio's session
      const projectId = 't8kqnnav';
      const dataset = 'production';
      const apiVersion = '2025-02-24';
      
      // Get the auth token from localStorage or cookies
      const token = localStorage.getItem('sanitySession') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('sanitySession='))?.split('=')[1];
      
      if (!token) {
        throw new Error('No authentication token found. Please log in to Sanity Studio first.');
      }

      // Use fetch API with the token
      const baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
      
      const settingsData = {
        mutations: [{
          createOrReplace: {
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
          }
        }]
      };

      // Check if settings already exist
      const queryUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=*[_type == "siteSettings"][0]`;
      const existingResponse = await fetch(queryUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (existingResponse.ok) {
        const existing = await existingResponse.json();
        if (existing.result) {
          // Update existing
          settingsData.mutations[0] = {
            patch: {
              id: existing.result._id,
              set: settingsData.mutations[0].createOrReplace
            }
          };
          delete settingsData.mutations[0].createOrReplace;
        }
      }

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error: ${JSON.stringify(error)}`);
      }

      const result = await response.json();
      console.log('✅ Site Settings configured successfully!');
      console.log('Result:', result);
      console.log('\n✨ Refresh the Studio to see the changes.');
      
    } else {
      // Use the Studio's client if available
      const existing = await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
      
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

      if (existing) {
        await sanityClient.patch(existing._id).set(settingsData).commit();
        console.log('✅ Site Settings updated successfully!');
      } else {
        await sanityClient.create(settingsData);
        console.log('✅ Site Settings created successfully!');
      }
      
      console.log('\n✨ Refresh the Studio to see the changes.');
    }
    
  } catch (error) {
    console.error('❌ Error setting up Site Settings:', error);
    console.log('\n💡 Alternative: Use the Vision tool in Sanity Studio:');
    console.log('   1. Open Vision tool (Ctrl+K, search "Vision")');
    console.log('   2. Copy contents from studio/setup-vision-mutation.json');
    console.log('   3. Paste and run the mutation');
  }
})();

import { definePlugin } from 'sanity'
import { getCliClient } from 'sanity/cli'

const setupPlugin = definePlugin({
  name: 'auto-setup',
  studio: {
    components: {
      layout: (props) => {
        // Run setup on first load
        if (typeof window !== 'undefined') {
          const setupKey = 'sanity-site-settings-setup-complete'
          const hasRun = sessionStorage.getItem(setupKey)
          
          if (!hasRun) {
            // Run setup asynchronously
            setTimeout(async () => {
              try {
                const client = getCliClient()
                const existing = await client.fetch(`*[_type == "siteSettings"][0]`)
                
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
                }

                if (existing) {
                  await client
                    .patch(existing._id)
                    .set(settingsData)
                    .commit()
                  console.log('✅ Site Settings updated automatically!')
                } else {
                  await client.create(settingsData)
                  console.log('✅ Site Settings created automatically!')
                }
                
                sessionStorage.setItem(setupKey, 'true')
              } catch (error) {
                console.warn('Could not auto-setup site settings:', error)
              }
            }, 2000)
          }
        }
        
        return props.renderDefault(props)
      },
    },
  },
})

export default setupPlugin

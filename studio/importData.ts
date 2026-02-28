/**
 * Import script to set up Site Settings
 * 
 * This script can be run from the Sanity Studio Vision tool:
 * 1. Open Sanity Studio
 * 2. Go to the Vision tool (in the toolbar)
 * 3. Paste this query and run it
 * 4. Then use the mutation below to create/update the settings
 */

// First, check if siteSettings exists:
// *[_type == "siteSettings"][0]

// If it doesn't exist, run this mutation in Vision:
/*
*[_type == "siteSettings"][0] {
  _id,
  _type,
  title,
  typography {
    primaryFont,
    primaryFontUrl,
    secondaryFont,
    secondaryFontUrl
  },
  emojis {
    heroEmoji,
    brandEmoji,
    decorativeEmojis,
    sectionEmojis {
      about,
      services,
      store,
      learning
    }
  },
  textContent {
    heroTitle,
    heroSubtitle,
    siteDescription
  }
}
*/

// To create new settings, use this mutation in Vision:
/*
{
  "mutations": [
    {
      "createOrReplace": {
        "_type": "siteSettings",
        "title": "Dreaming with Marisól",
        "typography": {
          "primaryFont": "Outfit",
          "primaryFontUrl": "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap",
          "secondaryFont": "Playfair Display",
          "secondaryFontUrl": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap"
        },
        "emojis": {
          "heroEmoji": "✨",
          "brandEmoji": "🌙",
          "decorativeEmojis": ["🍨", "✨", "🌙", "🕯️", "🌸"],
          "sectionEmojis": {
            "about": "🌿",
            "services": "🕯️",
            "store": "🍨",
            "learning": "📚"
          }
        },
        "textContent": {
          "heroTitle": "Hola, I'm Marisól",
          "heroSubtitle": "Mesoamerican Cleansing Rituals & Spiritual Healing",
          "siteDescription": "Traditional healing practices and spiritual guidance"
        }
      }
    }
  ]
}
*/

// To update existing settings, first get the _id, then use:
/*
{
  "mutations": [
    {
      "patch": {
        "id": "YOUR_DOCUMENT_ID_HERE",
        "set": {
          "typography": {
            "primaryFont": "Outfit",
            "primaryFontUrl": "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap",
            "secondaryFont": "Playfair Display",
            "secondaryFontUrl": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap"
          },
          "emojis": {
            "heroEmoji": "✨",
            "brandEmoji": "🌙",
            "decorativeEmojis": ["🍨", "✨", "🌙", "🕯️", "🌸"],
            "sectionEmojis": {
              "about": "🌿",
              "services": "🕯️",
              "store": "🍨",
              "learning": "📚"
            }
          },
          "textContent": {
            "heroTitle": "Hola, I'm Marisól",
            "heroSubtitle": "Mesoamerican Cleansing Rituals & Spiritual Healing",
            "siteDescription": "Traditional healing practices and spiritual guidance"
          }
        }
      }
    }
  ]
}
*/

export {}

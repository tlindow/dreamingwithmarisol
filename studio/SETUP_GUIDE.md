# Sanity Studio Setup Guide

## Setting Up Typography, Emojis, and Text Content

Follow these steps to configure your site settings in Sanity Studio:

### Quick Setup (Recommended)

**Option 1: Manual Entry in Studio UI**
1. Start the Sanity Studio: `cd studio && npm run dev`
2. Navigate to `http://localhost:3333` and log in
3. In the Studio sidebar, click on **"Site Settings & Images"**
4. If a document doesn't exist, click **"Create new"**
5. Fill in the fields as described below, or use the values from `siteSettings.json`

**Option 2: Using Vision Tool (Advanced)**
1. Open Sanity Studio and go to the **Vision** tool (in the toolbar)
2. See `importData.ts` for mutation examples you can copy and paste

### Step-by-Step Manual Configuration

If setting up manually, fill in these fields:

#### Typography Settings
- **Primary Font Family**: `Outfit` (or your preferred font)
- **Primary Font URL**: `https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap`
- **Secondary Font Family**: `Playfair Display` (or your preferred font)
- **Secondary Font URL**: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap`

#### Emoji Settings
- **Hero Section Emoji**: `✨` (or your preferred emoji)
- **Brand/Logo Emoji**: `🌙` (or your preferred emoji)
- **Decorative Emojis**: Add an array of emojis like: `🍨`, `✨`, `🌙`, `🕯️`, `🌸`
- **Section Emojis**:
  - **About Section**: `🌿`
  - **Services Section**: `🕯️`
  - **Store Section**: `🍨`
  - **Learning Section**: `📚`

#### Text Content Settings
- **Hero Title**: `Hola, I'm Marisól` (or your preferred title)
- **Hero Subtitle**: `Mesoamerican Cleansing Rituals & Spiritual Healing` (or your preferred subtitle)
- **Site Description**: `Traditional healing practices and spiritual guidance` (optional)

### Step 3: Save
Click **"Publish"** to save your changes.

### Step 4: Verify
1. Start your frontend: `npm run dev` (from root directory)
2. Navigate to `http://localhost:5173`
3. You should see:
   - The emoji in the hero section
   - The brand emoji in the navbar
   - The custom fonts loading
   - The custom text content

## Custom Font Options

If you want to use different fonts, you can:

1. **Google Fonts**: Visit [Google Fonts](https://fonts.google.com/) and:
   - Select your fonts
   - Click "Get embed code"
   - Copy the URL from the `<link>` tag
   - Paste it into the Font URL field

2. **Custom Fonts**: If you have custom font files:
   - Upload them to your hosting/CDN
   - Use a `@font-face` CSS URL or a font service URL
   - Enter the URL in the Font URL field

## Example Font Combinations

- **Elegant/Spiritual**: Playfair Display (secondary) + Inter (primary)
- **Modern/Minimal**: Outfit (primary) + Playfair Display (secondary)
- **Warm/Friendly**: Poppins (primary) + Merriweather (secondary)
- **Bold/Artistic**: Montserrat (primary) + Crimson Text (secondary)

## Quick Reference Values

For quick setup, you can copy these values:

**Typography:**
- Primary Font: `Outfit`
- Primary Font URL: `https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap`
- Secondary Font: `Playfair Display`
- Secondary Font URL: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap`

**Emojis:**
- Hero: `✨`
- Brand: `🌙`
- Decorative: `🍨`, `✨`, `🌙`, `🕯️`, `🌸`
- About: `🌿`
- Services: `🕯️`
- Store: `🍨`
- Learning: `📚`

**Text:**
- Hero Title: `Hola, I'm Marisól`
- Hero Subtitle: `Mesoamerican Cleansing Rituals & Spiritual Healing`

## Notes

- Fonts will load dynamically when you save changes
- The frontend automatically applies fonts via CSS variables
- Emojis can be changed at any time and will update immediately
- Text content is editable and updates in real-time
- See `siteSettings.json` for a complete example structure

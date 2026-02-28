# Automated Setup via Sanity Studio

Here are three ways to set up the CMS configuration:

## Method 1: Browser Console Script (Easiest - 1 minute)

1. **Start Sanity Studio:**
   ```bash
   cd studio
   npm run dev
   ```

2. **Open Studio:** Navigate to `http://localhost:3333` and log in

3. **Open Browser Console:** Press `F12` or right-click → "Inspect" → "Console" tab

4. **Run Setup Script:** Copy the entire contents of `studio/browser-console-setup.js` and paste into the console, then press Enter

5. **Done!** You should see a success message. Refresh the Studio to see the changes.

## Method 2: Vision Tool (Alternative - 2 minutes)

1. **Start Sanity Studio:**
   ```bash
   cd studio
   npm run dev
   ```

2. **Open Studio:** Navigate to `http://localhost:3333` and log in

3. **Open Vision Tool:** Click on the "Vision" icon in the toolbar (or press `Ctrl+K` and search for "Vision")

4. **Copy and Paste:** Copy the entire contents of `studio/setup-vision-mutation.json` and paste it into the Vision tool

5. **Run Mutation:** Click "Run" or press `Ctrl+Enter`

6. **Done!** The site settings are now configured. Refresh the Studio to see the changes.

## Alternative: Manual Entry

If you prefer to enter the values manually:

1. Go to **"Site Settings & Images"** in the Studio sidebar
2. Click **"Create new"** if no document exists
3. Fill in the fields using the values from `studio/siteSettings.json`
4. Click **"Publish"**

## Verify Setup

After setup, verify by:
1. Starting your frontend: `npm run dev` (from root)
2. Checking `http://localhost:5173`
3. You should see:
   - ✨ emoji in the hero section
   - 🌙 emoji in the navbar
   - Custom fonts loading
   - Custom text content

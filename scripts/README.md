# Substack Articles Import Script

This script imports articles from the Substack RSS feed into Sanity CMS.

## Prerequisites

1. **Sanity API Token**: You need a Sanity API token with write permissions.

   - Go to https://www.sanity.io/manage
   - Select your project (`t8kqnnav`)
   - Navigate to API → Tokens
   - Create a new token with Editor permissions

2. **Environment Variables**: Create a `.env` file in the root directory:

   ```
   SANITY_API_TOKEN=your_token_here
   ```

## Usage

Run the import script:

```bash
npm run import-substack
```

The script will:
1. Fetch all articles from `https://dreamingwithmarisol.substack.com/feed`
2. Check if each article already exists (by slug or Substack URL)
3. Import new articles into Sanity CMS
4. Skip articles that have already been imported

## Notes

- The script automatically generates slugs from article titles
- Articles are stored with their full HTML content from Substack
- The `isImported` field is set to `true` for all imported articles
- You can re-run the script safely - it won't create duplicates

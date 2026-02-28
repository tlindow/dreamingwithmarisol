# Cursor Cloud Environment Variable Setup

This guide explains how to set up the `SANITY_API_TOKEN` environment variable in Cursor Cloud for the Substack articles import script.

## Steps to Set Up Environment Variable

1. **Get Your Sanity API Token**:
   - Go to https://www.sanity.io/manage
   - Select your project (`t8kqnnav`)
   - Navigate to **API** → **Tokens**
   - Click **Add API token**
   - Name it (e.g., "Substack Import")
   - Select **Editor** permissions (needed to create documents)
   - Click **Save**
   - **Copy the token** (you won't be able to see it again!)

2. **Set Environment Variable in Cursor Cloud**:
   - In your Cursor Cloud project, go to **Settings** (or **Project Settings**)
   - Navigate to **Environment Variables** section
   - Click **Add Variable** or **New Environment Variable**
   - Enter:
     - **Name**: `SANITY_API_TOKEN`
     - **Value**: Paste your Sanity API token
   - Click **Save** or **Add**

3. **Verify the Setup**:
   - The environment variable will be available to all scripts and processes in your Cursor Cloud environment
   - You can verify it's set by running:
     ```bash
     echo $SANITY_API_TOKEN
     ```
   - Or test the import script:
     ```bash
     npm run import-substack
     ```

## Security Notes

- ✅ Environment variables in Cursor Cloud are encrypted and secure
- ✅ The token is only accessible within your cloud environment
- ✅ Never commit the token to git (`.env` files are gitignored)
- ✅ The token has Editor permissions, which allows creating/updating documents in Sanity

## Troubleshooting

If you get an error that `SANITY_API_TOKEN` is not set:

1. Verify the variable name is exactly `SANITY_API_TOKEN` (case-sensitive)
2. Make sure you saved the environment variable in Cursor Cloud settings
3. Try restarting your cloud environment/terminal session
4. Check that the token has the correct permissions (Editor or higher)

## Next Steps

Once the environment variable is set, you can run the import script:

```bash
npm run import-substack
```

The script will automatically use the `SANITY_API_TOKEN` from your cloud environment.

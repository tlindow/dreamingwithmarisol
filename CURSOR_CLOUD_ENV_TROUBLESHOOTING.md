# Troubleshooting Cursor Cloud Environment Variables

If you're getting an error that `SANITY_API_TOKEN` is not found even though you've set it in Cursor Cloud, try these steps:

## Step 1: Verify the Environment Variable is Set

1. Go to your Cursor Cloud project settings
2. Navigate to **Environment Variables**
3. Verify that `SANITY_API_TOKEN` exists and has a value
4. Make sure the name is exactly `SANITY_API_TOKEN` (case-sensitive, no spaces)

## Step 2: Restart Your Environment

After adding or modifying environment variables in Cursor Cloud:

1. **Restart your terminal session** - Close and reopen the terminal
2. **Or restart the entire cloud environment** if available in settings
3. Environment variables are loaded when the environment starts, so existing processes won't see new variables

## Step 3: Test the Environment Variable

Run this command to check if the variable is available:

```bash
echo $SANITY_API_TOKEN
```

If it's empty or not set, the variable isn't being loaded. If it shows a value, the variable is available.

## Step 4: Alternative - Use .env File (Temporary Workaround)

If the cloud environment variable still isn't working, you can temporarily use a `.env` file:

1. Create a `.env` file in the root directory (`/workspace/.env`)
2. Add: `SANITY_API_TOKEN=your_token_here`
3. Run the import script

**Note**: The `.env` file is gitignored and won't be committed to the repository.

## Step 5: Check Environment Variable Access in Scripts

The import script now includes debugging information. When you run it, it will show:
- Whether a `.env` file exists
- What environment variables are available (filtered for "SANITY")
- The current working directory

This can help diagnose the issue.

## Common Issues

### Issue: "Environment variable not found" but it's set in Cursor Cloud
**Solution**: Restart your terminal/cloud environment. Environment variables are loaded at startup.

### Issue: Variable name mismatch
**Solution**: Ensure the variable name is exactly `SANITY_API_TOKEN` (all caps, underscore, no spaces)

### Issue: Variable has extra spaces or quotes
**Solution**: When setting the variable in Cursor Cloud, make sure the value doesn't have leading/trailing spaces or quotes unless they're part of the actual token

## Still Having Issues?

If none of these steps work, the issue might be with how Cursor Cloud exposes environment variables to Node.js processes. In that case:

1. Use the `.env` file workaround (it's gitignored, so it's safe)
2. Contact Cursor Cloud support about environment variable access in Node.js scripts

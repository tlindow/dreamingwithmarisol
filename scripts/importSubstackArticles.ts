import Parser from 'rss-parser';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env file only if it exists (for local development)
// Cloud environment variables are already available via process.env
// Suppress dotenv messages when .env doesn't exist
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    // Suppress dotenv's default message about missing .env file
    // Cloud environment variables should be available via process.env
    process.env.DOTENV_CONFIG_DEBUG = 'false';
}

// Initialize Sanity client (token will be set in main function)
let client: ReturnType<typeof createClient>;

// Initialize RSS parser
const parser = new Parser();

interface SubstackArticle {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet?: string;
    guid?: string;
}

async function fetchSubstackArticles(): Promise<SubstackArticle[]> {
    const rssUrl = 'https://dreamingwithmarisol.substack.com/feed';
    console.log(`Fetching articles from ${rssUrl}...`);
    
    try {
        const feed = await parser.parseURL(rssUrl);
        console.log(`Found ${feed.items.length} articles in RSS feed`);
        return feed.items.map((item) => ({
            title: item.title || 'Untitled',
            link: item.link || '',
            pubDate: item.pubDate || new Date().toISOString(),
            content: item.content || item['content:encoded'] || '',
            contentSnippet: item.contentSnippet,
            guid: item.guid,
        }));
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        throw error;
    }
}

function createSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function importArticleToSanity(article: SubstackArticle): Promise<void> {
    const slug = createSlug(article.title);
    const publishedAt = new Date(article.pubDate).toISOString();

    // Check if article already exists by slug or Substack URL
    const existing = await client.fetch(
        `*[_type == "substackArticle" && (slug.current == $slug || substackUrl == $url)][0]`,
        { slug, url: article.link }
    );

    if (existing) {
        console.log(`Article "${article.title}" already exists, skipping...`);
        return;
    }

    try {
        const doc = {
            _type: 'substackArticle',
            title: article.title,
            slug: {
                _type: 'slug',
                current: slug,
            },
            publishedAt,
            excerpt: article.contentSnippet || article.content.substring(0, 200).replace(/<[^>]*>/g, ''),
            content: article.content,
            substackUrl: article.link,
            isImported: true,
        };

        const result = await client.create(doc);
        console.log(`✓ Imported: "${article.title}" (ID: ${result._id})`);
    } catch (error) {
        console.error(`Error importing article "${article.title}":`, error);
        throw error;
    }
}

async function main() {
    // Debug: Check if environment variable is available
    const token = process.env.SANITY_API_TOKEN;
    
    if (!token) {
        console.error('ERROR: SANITY_API_TOKEN environment variable is required.');
        console.error('\nDebugging info:');
        console.error(`  - Current working directory: ${process.cwd()}`);
        console.error(`  - .env file exists: ${existsSync(resolve(process.cwd(), '.env'))}`);
        console.error(`  - Environment variables available: ${Object.keys(process.env).filter(k => k.includes('SANITY')).join(', ') || 'none'}`);
        console.error('\nFor Cursor Cloud:');
        console.error('  1. Go to your Cursor Cloud project settings');
        console.error('  2. Navigate to Environment Variables');
        console.error('  3. Add SANITY_API_TOKEN with your token value');
        console.error('  4. Make sure the variable name is exactly: SANITY_API_TOKEN (case-sensitive)');
        console.error('  5. You may need to restart your terminal/cloud environment after adding the variable');
        console.error('\nFor local development:');
        console.error('  Create a .env file in the root directory with:');
        console.error('  SANITY_API_TOKEN=your_token_here');
        console.error('\nGet your token from: https://www.sanity.io/manage');
        process.exit(1);
    }
    
    console.log(`✓ Found SANITY_API_TOKEN (length: ${token.length} characters)`);
    
    // Initialize Sanity client with the token
    client = createClient({
        projectId: 't8kqnnav',
        dataset: 'production',
        useCdn: false,
        apiVersion: '2025-02-24',
        token: token,
    });

    try {
        const articles = await fetchSubstackArticles();
        console.log(`\nImporting ${articles.length} articles to Sanity...\n`);

        for (const article of articles) {
            await importArticleToSanity(article);
        }

        console.log(`\n✓ Successfully imported ${articles.length} articles!`);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

main();

import Parser from 'rss-parser';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables if .env exists
dotenv.config();

// Initialize Sanity client
const client = createClient({
    projectId: 't8kqnnav',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-02-24',
    token: process.env.SANITY_API_TOKEN, // You'll need to set this in .env
});

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
    if (!process.env.SANITY_API_TOKEN) {
        console.error('ERROR: SANITY_API_TOKEN environment variable is required.');
        console.error('Please create a .env file in the root directory with:');
        console.error('SANITY_API_TOKEN=your_token_here');
        console.error('\nYou can get your token from: https://www.sanity.io/manage');
        process.exit(1);
    }

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

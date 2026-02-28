import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client, urlFor } from '../sanityClient';
import './Articles.css';

interface SubstackArticle {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    publishedAt: string;
    excerpt: string;
    featuredImage?: any;
}

const Articles = () => {
    const [articles, setArticles] = useState<SubstackArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await client.fetch(`
                    *[_type == "substackArticle"] | order(publishedAt desc) {
                        _id,
                        title,
                        slug,
                        publishedAt,
                        excerpt,
                        featuredImage
                    }
                `);
                setArticles(data || []);
            } catch (error) {
                console.error("Error fetching articles from Sanity:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container text-center">
                    <h1 className="page-title">Articles</h1>
                    <p className="page-subtitle">A virtual letter filled with joyful inspiration & spiritual healing</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="articles-grid">
                        {isLoading ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-[var(--color-text-light)]">Loading articles...</p>
                            </div>
                        ) : articles.length > 0 ? (
                            articles.map((article) => (
                                <Link 
                                    to={`/articles/${article.slug.current}`} 
                                    key={article._id} 
                                    className="article-card group hover:shadow-lg transition-all duration-300"
                                >
                                    {article.featuredImage && (
                                        <div className="article-image-wrapper">
                                            <img
                                                src={urlFor(article.featuredImage).width(800).height(450).url()}
                                                alt={article.title}
                                                className="article-image"
                                            />
                                        </div>
                                    )}
                                    <div className="article-content">
                                        <div className="article-meta">
                                            <time className="article-date">{formatDate(article.publishedAt)}</time>
                                        </div>
                                        <h3 className="article-title group-hover:text-[var(--color-primary-dark)] transition-colors">
                                            {article.title}
                                        </h3>
                                        {article.excerpt && (
                                            <p className="article-excerpt line-clamp-3">{article.excerpt}</p>
                                        )}
                                        <span className="article-read-more">Read more &rarr;</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-[var(--color-text-light)]">No articles available yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Articles;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { client, urlFor } from '../sanityClient';
import { Button } from '../components/Button';
import './ArticleDetail.css';

interface SubstackArticle {
    _id: string;
    title: string;
    slug: {
        current: string;
    };
    publishedAt: string;
    excerpt: string;
    content: string;
    substackUrl: string;
    featuredImage?: any;
}

const ArticleDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<SubstackArticle | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return;
            try {
                const data = await client.fetch(`
                    *[_type == "substackArticle" && slug.current == $slug][0] {
                        _id,
                        title,
                        slug,
                        publishedAt,
                        excerpt,
                        content,
                        substackUrl,
                        featuredImage
                    }
                `, { slug });
                setArticle(data);
            } catch (error) {
                console.error("Error fetching article detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="page-wrapper animate-fade-in flex items-center justify-center min-h-[50vh]">
                <p className="text-[var(--color-text-light)]">Loading article...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="page-wrapper animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-serif text-[var(--color-primary-dark)] mb-4">Article not found</h2>
                <Link to="/articles">
                    <Button variant="outline">Return to Articles</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="bg-primary-light py-8">
                <div className="container">
                    <Link to="/articles" className="inline-flex items-center gap-2 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors mb-6">
                        <ArrowLeft size={20} /> Back to Articles
                    </Link>
                    <h1 className="text-4xl font-serif text-[var(--color-primary-dark)] mb-2">{article.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-light)]">
                        <time>{formatDate(article.publishedAt)}</time>
                    </div>
                </div>
            </section>

            {article.featuredImage && (
                <section className="section py-0">
                    <div className="container max-w-5xl">
                        <div className="article-featured-image-wrapper">
                            <img
                                src={urlFor(article.featuredImage).width(1200).height(675).url()}
                                alt={article.title}
                                className="article-featured-image"
                            />
                        </div>
                    </div>
                </section>
            )}

            <section className="section py-12">
                <div className="container max-w-4xl">
                    <article className="article-content-wrapper">
                        <div 
                            className="article-body"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                        <div className="article-footer">
                            <p className="article-original-link">
                                Originally published on{' '}
                                <a 
                                    href={article.substackUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="link-substack"
                                >
                                    Substack
                                </a>
                            </p>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default ArticleDetail;

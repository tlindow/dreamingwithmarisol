import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { client, urlFor } from '../sanityClient';
import './Home.css';

interface HeroImage {
    alt?: string;
    asset: { _ref: string };
}

const Home = () => {
    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
    const [heroImageAlt, setHeroImageAlt] = useState('Marisól');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await client.fetch<{ heroImage?: HeroImage } | null>(
                    `*[_type == "siteSettings"][0]{ heroImage }`,
                );
                if (settings?.heroImage) {
                    setHeroImageUrl(
                        urlFor(settings.heroImage)
                            .width(1000)
                            .quality(80)
                            .auto('format')
                            .url(),
                    );
                    if (settings.heroImage.alt) {
                        setHeroImageAlt(settings.heroImage.alt);
                    }
                }
            } catch (error) {
                console.error('Error fetching site settings from Sanity:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">Hola, I'm Marisól</h1>
                        <p className="hero-subtitle">Mesoamerican Cleansing Rituals & Spiritual Healing</p>
                        <div className="hero-actions">
                            <Link to="/healings">
                                <Button size="lg" variant="primary">Book a Session</Button>
                            </Link>
                            <Link to="/about">
                                <Button size="lg" variant="secondary">Learn More</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image-wrapper">
                        {isLoading ? (
                            <div className="image-placeholder loading-shimmer" />
                        ) : heroImageUrl ? (
                            <img src={heroImageUrl} alt={heroImageAlt} className="hero-image" />
                        ) : (
                            <div className="image-placeholder">
                                <span className="placeholder-text">Upload Hero Image in Sanity</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Offerings Preview Section */}
            <section className="section bg-primary-light">
                <div className="container">
                    <div className="section-header center">
                        <h2>Offerings</h2>
                        <p>Traditional healing practices tailored to your spiritual journey.</p>
                    </div>

                    <div className="offerings-grid">
                        <div className="offering-card">
                            <h3>In-Person Limpias</h3>
                            <p>Traditional Mesoamerican spiritual cleansing to remove heavy energies and restore balance.</p>
                            <Link to="/healings" className="text-cta">Learn more &rarr;</Link>
                        </div>

                        <div className="offering-card">
                            <h3>Pláticas</h3>
                            <p>Heart-to-heart spiritual counseling to guide you through life's transitions.</p>
                            <Link to="/healings" className="text-cta">Learn more &rarr;</Link>
                        </div>

                        <div className="offering-card">
                            <h3>Online Sessions</h3>
                            <p>Distance healing and spiritual guidance available wherever you are.</p>
                            <Link to="/online-healings" className="text-cta">Learn more &rarr;</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

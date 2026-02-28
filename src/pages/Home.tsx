import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { client, urlFor } from '../sanityClient';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import './Home.css';

const Home = () => {
    const { settings } = useSiteSettings();
    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch the first siteSettings document (usually there is only one)
                const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
                if (settings?.heroImage) {
                    setHeroImageUrl(urlFor(settings.heroImage).url());
                }
            } catch (error) {
                console.error("Error fetching site settings from Sanity:", error);
            }
        };

        fetchSettings();
    }, []);

    // Get CMS-managed text content with fallbacks
    const heroTitle = settings?.textContent?.heroTitle || "Hola, I'm Marisól";
    const heroSubtitle = settings?.textContent?.heroSubtitle || "Mesoamerican Cleansing Rituals & Spiritual Healing";
    const heroEmoji = settings?.emojis?.heroEmoji || "";

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            {heroEmoji && <span className="hero-emoji">{heroEmoji}</span>}
                            {heroTitle}
                        </h1>
                        <p className="hero-subtitle">{heroSubtitle}</p>
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
                        {heroImageUrl ? (
                            <img src={heroImageUrl} alt="Marisól" className="hero-image" />
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

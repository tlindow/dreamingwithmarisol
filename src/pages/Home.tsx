import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { client, urlFor, urlForFile } from '../sanityClient';
// @ts-ignore
import ReactPlayer from 'react-player';
import './Home.css';

// Bypass strict TypeScript JSX Element typing for the external ReactPlayer module
const Player = ReactPlayer as any;

const Home = () => {
    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
    const [featuredVideoUrl, setFeaturedVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch the first siteSettings document (usually there is only one)
                const settings = await client.fetch(`
                    *[_type == "siteSettings"][0] {
                        heroImage,
                        "featuredVideoUrl": featuredVideo.asset->url
                    }
                `);
                if (settings?.heroImage) {
                    setHeroImageUrl(urlFor(settings.heroImage).url());
                }
                if (settings?.featuredVideoUrl) {
                    setFeaturedVideoUrl(settings.featuredVideoUrl);
                }
            } catch (error) {
                console.error("Error fetching site settings from Sanity:", error);
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
                        {featuredVideoUrl ? (
                            <div className="hero-video-wrapper">
                                <Player
                                    url={featuredVideoUrl}
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    playing={false}
                                    className="hero-video"
                                />
                            </div>
                        ) : heroImageUrl ? (
                            <img src={heroImageUrl} alt="Marisól" className="hero-image" />
                        ) : (
                            <div className="image-placeholder">
                                <span className="placeholder-text">Upload Hero Image or Video in Sanity</span>
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

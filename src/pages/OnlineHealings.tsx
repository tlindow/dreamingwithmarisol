import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { client } from '../sanityClient';

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ calendlyUrl }`;

const OnlineHealings = () => {
    const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        client
            .fetch(SETTINGS_QUERY)
            .then((s: { calendlyUrl?: string } | null) => {
                if (s?.calendlyUrl) setCalendlyUrl(s.calendlyUrl);
            })
            .catch((err: unknown) => console.error('Failed to fetch settings:', err))
            .finally(() => setLoaded(true));
    }, []);

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light text-center">
                <div className="container">
                    <h1 className="page-title">Online Sessions</h1>
                    <p className="page-subtitle">Available Worldwide via Zoom</p>
                </div>
            </section>

            <section className="section">
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="offering-card" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h2 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-secondary)' }}>Distance Limpia & Plática</h2>
                        </div>
                        <div className="service-details">
                            <span className="price">$150</span>
                            <span className="duration">60 Minutes</span>
                        </div>

                        <p style={{ lineHeight: 1.8, marginBottom: 'var(--spacing-lg)' }}>
                            Energy knows no physical bounds. Distance healing sessions are just as effective as in-person sessions. We will connect via Zoom for a heart-to-heart discussion (plática), followed by a guided energetic clearing and meditation.
                        </p>

                        {loaded && calendlyUrl ? (
                            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" variant="primary">Book Online Session</Button>
                            </a>
                        ) : loaded ? (
                            <Link to="/healings">
                                <Button size="lg" variant="primary">View Booking Info</Button>
                            </Link>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OnlineHealings;

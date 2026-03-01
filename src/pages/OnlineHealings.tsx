import { useEffect, useCallback, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { client } from '../sanityClient';
import './Healings.css';

const BRAND_PARAMS =
    'hide_gdpr_banner=1' +
    '&background_color=f4f3ef' +
    '&text_color=2d2a26' +
    '&primary_color=4a5d23';

function brandedUrl(raw: string) {
    const sep = raw.includes('?') ? '&' : '?';
    return `${raw}${sep}${BRAND_PARAMS}`;
}

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ calendlyUrl, contactEmail }`;

const OnlineHealings = () => {
    const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
    const [contactEmail, setContactEmail] = useState<string | null>(null);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [showCalendly, setShowCalendly] = useState(false);
    const [calendlyReady, setCalendlyReady] = useState(false);
    const embedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        client
            .fetch(SETTINGS_QUERY)
            .then((settings: { calendlyUrl?: string; contactEmail?: string } | null) => {
                if (settings?.calendlyUrl) setCalendlyUrl(settings.calendlyUrl);
                if (settings?.contactEmail) setContactEmail(settings.contactEmail);
            })
            .catch((err: unknown) => console.error('Failed to fetch site settings:', err))
            .finally(() => setSettingsLoaded(true));
    }, []);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = () => setCalendlyReady(true);
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) script.parentNode.removeChild(script);
            if (link.parentNode) link.parentNode.removeChild(link);
        };
    }, []);

    const fullUrl = calendlyUrl ? brandedUrl(calendlyUrl) : null;

    useEffect(() => {
        if (showCalendly && calendlyReady && fullUrl && embedRef.current && window.Calendly) {
            embedRef.current.innerHTML = '';
            window.Calendly.initInlineWidget({
                url: fullUrl,
                parentElement: embedRef.current,
            });
            setTimeout(() => {
                embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }, [showCalendly, calendlyReady, fullUrl]);

    const handleBookClick = useCallback(() => {
        if (!fullUrl) return;
        if (showCalendly) {
            embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (calendlyReady) {
            setShowCalendly(true);
        } else {
            window.open(fullUrl, '_blank');
        }
    }, [showCalendly, calendlyReady, fullUrl]);

    const email = contactEmail ?? 'hello@example.com';
    const waitlistMailto = `mailto:${email}?subject=${encodeURIComponent(
        'Waitlist — Online Healing Session'
    )}&body=${encodeURIComponent(
        "Hi Marisól,\n\nI'd love to book an online Distance Limpia & Plática session. Could you please add me to the waitlist and notify me when new appointments become available?\n\nThank you!"
    )}`;

    const bookingAvailable = settingsLoaded && !!calendlyUrl;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light text-center">
                <div className="container">
                    <h1 className="page-title">Online Sessions</h1>
                    <p className="page-subtitle">Available Worldwide via Zoom</p>
                </div>
            </section>

            <section className="section">
                <div className="container healings-container">
                    <div className="healings-content">
                        <h2>Distance Limpia &amp; Plática</h2>
                        <div className="service-details">
                            <span className="price">$150</span>
                            <span className="duration">60 Minutes</span>
                        </div>

                        <div className="prose">
                            <p>
                                Energy knows no physical bounds. Distance healing sessions are just as effective as in-person sessions. We will connect via Zoom for a heart-to-heart discussion (plática), followed by a guided energetic clearing and meditation.
                            </p>
                            <p>
                                <strong>What to expect:</strong> We begin with a virtual plática to set intentions and connect energetically. The session includes guided breathwork, energetic clearing techniques, and a closing meditation. Please find a quiet, private space and have a candle or glass of water nearby.
                            </p>
                        </div>

                        <div className="availability-notice">
                            <svg className="availability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <div>
                                <strong>Sessions open on the 1st of each month</strong>
                                <p>Appointments fill quickly — book early to secure your spot.</p>
                            </div>
                        </div>

                        <div className="booking-cta">
                            {bookingAvailable ? (
                                <Button size="lg" variant="primary" onClick={handleBookClick}>
                                    Book Online Session
                                </Button>
                            ) : settingsLoaded ? (
                                <div className="booking-closed-notice">
                                    <p>
                                        <strong>Booking is not yet open for this month.</strong>
                                    </p>
                                    <p>
                                        New sessions are released on the 1st — check back soon
                                        or join the waitlist below to get notified.
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {showCalendly && fullUrl && (
                            <div className="calendly-embed-wrapper">
                                <div className="calendly-embed-header">
                                    <h3>Select a Date &amp; Time</h3>
                                    <button
                                        className="calendly-close-btn"
                                        onClick={() => setShowCalendly(false)}
                                        aria-label="Close calendar"
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    ref={embedRef}
                                    className="calendly-embed-body"
                                    style={{ minWidth: '320px', height: '700px' }}
                                />
                            </div>
                        )}

                        <div className="sold-out-section">
                            <h3>All booked this month?</h3>
                            <p>
                                New sessions are released on the <strong>1st of every month</strong>.
                                Join the waitlist to be the first to know when spots open up.
                            </p>
                            <a href={waitlistMailto}>
                                <Button size="md" variant="secondary">
                                    Join the Waitlist
                                </Button>
                            </a>
                            <div className="explore-section">
                                <p className="explore-label">Explore while you wait</p>
                                <div className="explore-links">
                                    <Link to="/healings" className="explore-link">
                                        In-Person Healings
                                    </Link>
                                    <Link to="/learning" className="explore-link">
                                        Learning Hub
                                    </Link>
                                    <Link to="/values" className="explore-link">
                                        Our Values
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="healings-sidebar">
                        <div className="policy-card">
                            <h3>Cancellation Policy</h3>
                            <p>
                                Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.
                            </p>
                        </div>
                        <div className="policy-card">
                            <h3>Refunds</h3>
                            <p>
                                All healing sessions are final sale. No refunds are provided after the service has been rendered.
                            </p>
                        </div>
                        <div className="policy-card">
                            <h3>Preparation</h3>
                            <p>
                                Find a quiet, private space. Have a candle or glass of water nearby. Avoid alcohol and recreational substances 24 hours before your session.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OnlineHealings;

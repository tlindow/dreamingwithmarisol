import { useEffect, useCallback, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import './Healings.css';

// TODO: Replace with your actual Calendly event URL and contact email
const CALENDLY_URL = 'https://calendly.com/YOUR_USERNAME/in-person-healing';
const CONTACT_EMAIL = 'hello@example.com';

const CALENDLY_BRANDED_URL =
    `${CALENDLY_URL}?hide_gdpr_banner=1` +
    `&background_color=f4f3ef` +   // --color-primary-light
    `&text_color=2d2a26` +         // --color-text-main
    `&primary_color=4a5d23`;       // --color-secondary (olive green)

declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: { url: string }) => void;
            initInlineWidget: (options: {
                url: string;
                parentElement: HTMLElement;
            }) => void;
        };
    }
}

const Healings = () => {
    const [showCalendly, setShowCalendly] = useState(false);
    const [calendlyReady, setCalendlyReady] = useState(false);
    const embedRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (showCalendly && calendlyReady && embedRef.current && window.Calendly) {
            embedRef.current.innerHTML = '';
            window.Calendly.initInlineWidget({
                url: CALENDLY_BRANDED_URL,
                parentElement: embedRef.current,
            });
            setTimeout(() => {
                embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }, [showCalendly, calendlyReady]);

    const handleBookClick = useCallback(() => {
        if (showCalendly) {
            embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (calendlyReady) {
            setShowCalendly(true);
        } else {
            window.open(CALENDLY_BRANDED_URL, '_blank');
        }
    }, [showCalendly, calendlyReady]);

    const waitlistMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        'Waitlist — In-Person Healing Session'
    )}&body=${encodeURIComponent(
        "Hi Marisól,\n\nI'd love to book an in-person Limpia session. Could you please add me to the waitlist and notify me when new appointments become available?\n\nThank you!"
    )}`;

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Header Section */}
            <section className="section bg-primary-light text-center">
                <div className="container">
                    <h1 className="page-title">In-Person Healings</h1>
                    <p className="page-subtitle">San Diego, CA</p>
                </div>
            </section>

            {/* Main Service Description */}
            <section className="section">
                <div className="container healings-container">
                    <div className="healings-content">
                        <h2>Limpia (Spiritual Cleansing)</h2>
                        <div className="service-details">
                            <span className="price">$150</span>
                            <span className="duration">60 Minutes</span>
                        </div>

                        <div className="prose">
                            <p>
                                A Limpia is a traditional Mesoamerican healing practice designed to cleanse the body, mind, and spirit of heavy, stagnant energies. Using sacred smoke (copal, palo santo, or sage), fresh herbs, eggs, and prayer, this ritual restores balance to your energetic field.
                            </p>
                            <p>
                                <strong>What to expect:</strong> We begin with a brief plática (heart-to-heart talk) to set intentions. The cleansing involves sweeping the body with herbs and using localized energetic clearing techniques. Please wear comfortable, light-colored clothing.
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
                            <Button size="lg" variant="primary" onClick={handleBookClick}>
                                Book Your Session
                            </Button>
                        </div>

                        {showCalendly && (
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
                                    <Link to="/online-healings" className="explore-link">
                                        Online Healings
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
                                Consume a light meal 1-2 hours prior. Avoid alcohol and recreational substances 24 hours before your session.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Healings;

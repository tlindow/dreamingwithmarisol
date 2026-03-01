import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { useCalendlyEmbed } from '../hooks/useCalendlyEmbed';
import { HEALINGS_QUERY } from '../lib/queries';
import { formatPrice } from '../lib/utils';
import { DEFAULT_IN_PERSON_SERVICE, DEFAULT_SITE_SETTINGS } from '../content/defaults';
import type { ServiceData, SiteSettings } from '../lib/types';
import './Healings.css';

interface HealingsQueryResult {
    settings: Pick<SiteSettings, 'calendlyUrl' | 'contactEmail'> | null;
    service: ServiceData | null;
}

const Healings = () => {
    const { data, isLoading: settingsLoading } = useSanityQuery<HealingsQueryResult>(HEALINGS_QUERY);

    const calendlyUrl = data?.settings?.calendlyUrl ?? null;
    const contactEmail = data?.settings?.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail;

    const svc = data?.service;
    const serviceTitle = svc?.title ?? DEFAULT_IN_PERSON_SERVICE.title;
    const pageTitle = svc?.pageTitle ?? DEFAULT_IN_PERSON_SERVICE.pageTitle;
    const pageSubtitle = svc?.pageSubtitle ?? DEFAULT_IN_PERSON_SERVICE.pageSubtitle;
    const price = svc?.price ?? DEFAULT_IN_PERSON_SERVICE.price;
    const duration = svc?.duration ?? DEFAULT_IN_PERSON_SERVICE.duration;
    const description = svc?.description ?? DEFAULT_IN_PERSON_SERVICE.description;
    const whatToExpect = svc?.whatToExpect ?? DEFAULT_IN_PERSON_SERVICE.whatToExpect;
    const cancellationPolicy = svc?.cancellationPolicy ?? DEFAULT_IN_PERSON_SERVICE.cancellationPolicy;
    const refundsPolicy = svc?.refundsPolicy ?? DEFAULT_IN_PERSON_SERVICE.refundsPolicy;
    const preparationText = svc?.preparationText ?? DEFAULT_IN_PERSON_SERVICE.preparationText;

    const { showCalendly, setShowCalendly, embedRef, fullUrl, handleBookClick } =
        useCalendlyEmbed(calendlyUrl);

    const settingsLoaded = !settingsLoading;
    const bookingAvailable = settingsLoaded && !!calendlyUrl;

    const waitlistMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
        `Waitlist — ${pageTitle}`
    )}&body=${encodeURIComponent(
        `Hi Marisól,\n\nI'd love to book an in-person ${serviceTitle} session. Could you please add me to the waitlist and notify me when new appointments become available?\n\nThank you!`
    )}`;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light text-center">
                <div className="container">
                    <h1 className="page-title">{pageTitle}</h1>
                    <p className="page-subtitle">{pageSubtitle}</p>
                </div>
            </section>

            <section className="section">
                <div className="container healings-container">
                    <div className="healings-content">
                        <h2>{serviceTitle}</h2>
                        <div className="service-details">
                            <span className="price">{formatPrice(price)}</span>
                            <span className="duration">{duration}</span>
                        </div>

                        <div className="prose">
                            <p>{description}</p>
                            <p>
                                <strong>What to expect:</strong> {whatToExpect}
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
                                    Book Your Session
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
                            <p>{cancellationPolicy}</p>
                        </div>
                        <div className="policy-card">
                            <h3>Refunds</h3>
                            <p>{refundsPolicy}</p>
                        </div>
                        <div className="policy-card">
                            <h3>Preparation</h3>
                            <p>{preparationText}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Healings;

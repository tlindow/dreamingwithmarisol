import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { useCalendlyEmbed } from '../hooks/useCalendlyEmbed';
import { HEALINGS_QUERY } from '../lib/queries';
import { formatPrice } from '../lib/utils';
import { DEFAULT_IN_PERSON_SERVICE, DEFAULT_SITE_SETTINGS } from '../content/defaults';
import type { ServiceData, SiteSettings, VideoModule } from '../lib/types';
import './Healings.css';

interface HealingsQueryResult {
    settings: Pick<SiteSettings, 'calendlyUrl' | 'sessionsFullyBooked' | 'contactEmail'> | null;
    service: ServiceData | null;
    featuredModules: VideoModule[] | null;
}

const Healings = () => {
    const { data, isLoading: settingsLoading } = useSanityQuery<HealingsQueryResult>(HEALINGS_QUERY);

    const calendlyUrl = data?.settings?.calendlyUrl ?? null;
    const sessionsFullyBooked = data?.settings?.sessionsFullyBooked ?? false;
    const contactEmail = data?.settings?.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail;
    const featuredModules = data?.featuredModules ?? [];

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
    const bookingAvailable = settingsLoaded && !!calendlyUrl && !sessionsFullyBooked;

    const contactMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
        `Inquiry — ${pageTitle}`
    )}&body=${encodeURIComponent(
        `Hi Marisól,\n\nI'm interested in learning more about your in-person ${serviceTitle} sessions.\n\nThank you!`
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
                            ) : settingsLoaded && sessionsFullyBooked ? (
                                <div className="fully-booked-notice">
                                    <Sparkles size={20} className="fully-booked-icon" />
                                    <div>
                                        <p>
                                            <strong>This month's sessions are fully booked.</strong>
                                        </p>
                                        <p>
                                            New sessions open on the 1st of next month. In the meantime,
                                            start your healing journey with our learning resources below.
                                        </p>
                                    </div>
                                </div>
                            ) : settingsLoaded ? (
                                <div className="booking-closed-notice">
                                    <p>
                                        <strong>Booking is not yet open for this month.</strong>
                                    </p>
                                    <p>
                                        New sessions are released on the 1st — check back soon.
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

                        {/* Overflow section: always visible, emphasized when booked */}
                        <div className={`overflow-section${sessionsFullyBooked ? ' overflow-section--prominent' : ''}`}>
                            <div className="overflow-header">
                                <BookOpen size={24} className="overflow-header-icon" />
                                <div>
                                    <h3>
                                        {sessionsFullyBooked
                                            ? 'Begin Learning While You Wait'
                                            : 'Deepen Your Practice'}
                                    </h3>
                                    <p>
                                        {sessionsFullyBooked
                                            ? 'Explore ancestral wisdom teachings and prepare for your healing session with our guided learning modules.'
                                            : 'Complement your healing sessions with guided learning on ancestral wisdom and spiritual practice.'}
                                    </p>
                                </div>
                            </div>

                            {featuredModules.length > 0 && (
                                <div className="overflow-modules">
                                    {featuredModules.map((mod) => (
                                        <Link
                                            to={`/learning/${mod._id}`}
                                            key={mod._id}
                                            className="overflow-module-card"
                                        >
                                            <div className={`overflow-module-thumb ${mod.thumbnailColor || 'bg-primary'}`}>
                                                {mod.accessTier === 'premium' && (
                                                    <span className="tier-badge tier-badge--premium">Premium</span>
                                                )}
                                                {mod.accessTier === 'free' && (
                                                    <span className="tier-badge tier-badge--free">Free</span>
                                                )}
                                            </div>
                                            <div className="overflow-module-info">
                                                <h4>{mod.title}</h4>
                                                <span className="overflow-module-duration">{mod.duration}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <div className="overflow-actions">
                                <Link to="/learning">
                                    <Button size="md" variant={sessionsFullyBooked ? 'primary' : 'secondary'}>
                                        Explore the Learning Hub <ArrowRight size={16} />
                                    </Button>
                                </Link>
                                <Link to="/store" className="overflow-store-link">
                                    Browse Healing Supplies
                                </Link>
                            </div>

                            {sessionsFullyBooked && (
                                <p className="overflow-contact">
                                    Have questions? <a href={contactMailto}>Reach out to Marisól</a>
                                </p>
                            )}
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

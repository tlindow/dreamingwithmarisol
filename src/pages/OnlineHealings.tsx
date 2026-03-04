import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { useCalendlyEmbed } from '../hooks/useCalendlyEmbed';
import { useCalendlyAvailability } from '../hooks/useCalendlyAvailability';
import { ONLINE_HEALINGS_QUERY } from '../lib/queries';
import { formatPrice } from '../lib/utils';
import { DEFAULT_ONLINE_SERVICE, DEFAULT_SITE_SETTINGS } from '../content/defaults';
import type { ServiceData, SiteSettings } from '../lib/types';
import './Healings.css';

interface OnlineHealingsQueryResult {
    settings: Pick<SiteSettings, 'calendlyUrl' | 'contactEmail'> | null;
    service: ServiceData | null;
}

const OnlineHealings = () => {
    const { data, isLoading: settingsLoading } = useSanityQuery<OnlineHealingsQueryResult>(ONLINE_HEALINGS_QUERY);

    const calendlyUrl = data?.settings?.calendlyUrl ?? null;
    const contactEmail = data?.settings?.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail;

    const svc = data?.service;
    const serviceTitle = svc?.title ?? DEFAULT_ONLINE_SERVICE.title;
    const pageTitle = svc?.pageTitle ?? DEFAULT_ONLINE_SERVICE.pageTitle;
    const pageSubtitle = svc?.pageSubtitle ?? DEFAULT_ONLINE_SERVICE.pageSubtitle;
    const price = svc?.price ?? DEFAULT_ONLINE_SERVICE.price;
    const duration = svc?.duration ?? DEFAULT_ONLINE_SERVICE.duration;
    const description = svc?.description ?? DEFAULT_ONLINE_SERVICE.description;
    const whatToExpect = svc?.whatToExpect ?? DEFAULT_ONLINE_SERVICE.whatToExpect;
    const cancellationPolicy = svc?.cancellationPolicy ?? DEFAULT_ONLINE_SERVICE.cancellationPolicy;
    const refundsPolicy = svc?.refundsPolicy ?? DEFAULT_ONLINE_SERVICE.refundsPolicy;
    const preparationText = svc?.preparationText ?? DEFAULT_ONLINE_SERVICE.preparationText;

    const { showCalendly, setShowCalendly, embedRef, fullUrl, handleBookClick } =
        useCalendlyEmbed(calendlyUrl);

    const { status: availabilityStatus } = useCalendlyAvailability(calendlyUrl);

    const settingsLoaded = !settingsLoading;

    const showBooking =
        availabilityStatus === 'available' ||
        (availabilityStatus === 'error' && !!calendlyUrl);

    const showUnavailableFallback =
        settingsLoaded &&
        !showBooking &&
        availabilityStatus !== 'loading';

    const waitlistMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
        `Waitlist — ${pageTitle}`
    )}&body=${encodeURIComponent(
        `Hi Marisól,\n\nI'd love to book an online ${serviceTitle} session. Could you please add me to the waitlist and notify me when new appointments become available?\n\nThank you!`
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
                            {availabilityStatus === 'loading' && settingsLoaded ? (
                                <div className="availability-checking">
                                    <span className="checking-dot" />
                                    <span>Checking availability&hellip;</span>
                                </div>
                            ) : showBooking ? (
                                <Button size="lg" variant="primary" onClick={handleBookClick}>
                                    Book Online Session
                                </Button>
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

                        {showUnavailableFallback && (
                            <div className="no-availability-section">
                                <div className="no-availability-header">
                                    <svg className="no-availability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                    <div>
                                        <h3>Sessions are fully booked right now</h3>
                                        <p>
                                            New appointments open on the <strong>1st of each month</strong> and
                                            fill quickly. Join the waitlist to be notified the moment spots open&nbsp;up.
                                        </p>
                                    </div>
                                </div>

                                <a href={waitlistMailto}>
                                    <Button size="md" variant="primary">
                                        Join the Waitlist
                                    </Button>
                                </a>

                                <div className="explore-offerings">
                                    <p className="explore-offerings-label">
                                        There&rsquo;s so much more to explore in the meantime
                                    </p>
                                    <div className="explore-offerings-grid">
                                        <Link to="/store" className="offering-card">
                                            <span className="offering-card-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                            </span>
                                            <strong>Apothecary &amp; Digital&nbsp;Media</strong>
                                            <span>Sacred tools, supplies &amp; digital offerings curated by&nbsp;Marisól</span>
                                        </Link>
                                        <Link to="/healings" className="offering-card">
                                            <span className="offering-card-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                                            </span>
                                            <strong>In-Person Healings</strong>
                                            <span>Traditional Mesoamerican spiritual cleansing in San&nbsp;Diego</span>
                                        </Link>
                                        <Link to="/learning" className="offering-card">
                                            <span className="offering-card-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                                            </span>
                                            <strong>Learning Hub</strong>
                                            <span>Video teachings on spiritual practices &amp;&nbsp;healing</span>
                                        </Link>
                                        <Link to="/pricing" className="offering-card">
                                            <span className="offering-card-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                                            </span>
                                            <strong>Pricing &amp; Policies</strong>
                                            <span>Session details, rates &amp; cancellation&nbsp;info</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showBooking && (
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
                                        <Link to="/store" className="explore-link">
                                            Apothecary &amp; Store
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
                        )}
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

export default OnlineHealings;

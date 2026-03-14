import { useParams, Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { formatPrice } from '../lib/utils';
import './EventDetail.css';

const EVENT_TYPE_LABELS: Record<string, string> = {
    ceremony: 'Ceremony',
    workshop: 'Workshop',
    retreat: 'Retreat',
    gathering: 'Community Gathering',
    online: 'Online Event',
};

function formatEventDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatEventTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

function formatTimeRange(start: string, end?: string): string {
    const startTime = formatEventTime(start);
    if (!end) return startTime;
    return `${startTime} – ${formatEventTime(end)}`;
}

const EventDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { content } = useContent();
    const event = content.events.find((item) => item._id === id);
    const isLoading = false;

    if (isLoading) {
        return (
            <div className="page-wrapper animate-fade-in">
                <section className="section bg-primary-light">
                    <div className="container ed-loading">
                        <p>Loading event details...</p>
                    </div>
                </section>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="page-wrapper animate-fade-in">
                <section className="section bg-primary-light">
                    <div className="container ed-not-found">
                        <h2>Event not found</h2>
                        <Link to="/events" className="ed-back-link">
                            &larr; Back to Events
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    const typeLabel = EVENT_TYPE_LABELS[event.eventType] ?? event.eventType;
    const flyerUrl = event.flyerUrl
        ? event.flyerUrl
        : event.imageUrl
            ? event.imageUrl
            : null;
    const longDescription = event.detailedDescription || event.description;
    const isFree = event.price == null || event.price === 0;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container">
                    <Link to="/events" className="ed-back-link">
                        &larr; Back to Events
                    </Link>

                    <div className="ed-layout">
                        {/* Left column — info */}
                        <div className="ed-info">
                            <span className="event-badge">{typeLabel}</span>
                            <h1 className="ed-title">{event.title}</h1>

                            <div className="ed-meta">
                                <div className="ed-meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                    <span>{formatEventDate(event.date)}</span>
                                </div>
                                <div className="ed-meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>{formatTimeRange(event.date, event.endDate)}</span>
                                </div>
                                <div className="ed-meta-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="ed-description">
                                {longDescription.split('\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Right column — flyer + registration card */}
                        <aside className="ed-sidebar">
                            {flyerUrl && (
                                <div className="ed-flyer">
                                    <img src={flyerUrl} alt={`${event.title} flyer`} />
                                </div>
                            )}

                            <div className="ed-register-card">
                                <div className="ed-price">
                                    {isFree ? 'Free' : formatPrice(event.price!)}
                                </div>

                                {event.stripePaymentLink ? (
                                    <a
                                        href={event.stripePaymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ed-pay-btn"
                                    >
                                        {isFree ? 'Register for Free' : 'Register & Pay'}
                                    </a>
                                ) : (
                                    <span className="ed-coming-soon">
                                        Registration opening soon
                                    </span>
                                )}

                                {event.stripePaymentLink && (
                                    <p className="ed-secure-note">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        Secure checkout powered by Stripe
                                    </p>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventDetail;

import { urlFor } from '../sanityClient';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { EVENTS_PAGE_QUERY } from '../lib/queries';
import { DEFAULT_EVENTS_PAGE, DEFAULT_EVENTS } from '../content/defaults';
import type { EventsPageData, EventItem } from '../lib/types';
import './Events.css';

interface EventsQueryResult {
    page: EventsPageData | null;
    events: EventItem[] | null;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
    ceremony: 'Ceremony',
    workshop: 'Workshop',
    retreat: 'Retreat',
    gathering: 'Community Gathering',
    online: 'Online Event',
};

function formatEventDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatEventTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

function formatTimeRange(start: string, end?: string): string {
    const startTime = formatEventTime(start);
    if (!end) return startTime;
    const endTime = formatEventTime(end);
    return `${startTime} – ${endTime}`;
}

function isUpcoming(dateStr: string): boolean {
    return new Date(dateStr) >= new Date();
}

const Events = () => {
    const { data } = useSanityQuery<EventsQueryResult>(EVENTS_PAGE_QUERY);

    const page = data?.page;
    const allEvents = data?.events ?? DEFAULT_EVENTS;

    const pageTitle = page?.pageTitle ?? DEFAULT_EVENTS_PAGE.pageTitle;
    const pageSubtitle = page?.pageSubtitle ?? DEFAULT_EVENTS_PAGE.pageSubtitle;

    const upcoming = allEvents.filter((e) => isUpcoming(e.date));
    const past = allEvents.filter((e) => !isUpcoming(e.date));

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container">
                    <div className="events-header text-center">
                        <h1 className="page-title">{pageTitle}</h1>
                        <p className="page-subtitle">{pageSubtitle}</p>
                    </div>

                    {upcoming.length > 0 ? (
                        <div className="events-list">
                            {upcoming.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="events-empty">
                            <p>No upcoming events at this time. Check back soon!</p>
                        </div>
                    )}

                    {past.length > 0 && (
                        <div className="events-past-section">
                            <h2 className="events-past-heading">Past Events</h2>
                            <div className="events-list events-list--past">
                                {past.map((event) => (
                                    <EventCard key={event._id} event={event} isPast />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

function EventCard({ event, isPast }: { event: EventItem; isPast?: boolean }) {
    const imageUrl = event.image ? urlFor(event.image).width(600).height(400).url() : null;
    const typeLabel = EVENT_TYPE_LABELS[event.eventType] ?? event.eventType;

    return (
        <article className={`event-card${isPast ? ' event-card--past' : ''}`}>
            {imageUrl && (
                <div className="event-card-image">
                    <img src={imageUrl} alt={event.title} />
                </div>
            )}

            <div className="event-card-body">
                <span className="event-badge">{typeLabel}</span>

                <h3 className="event-card-title">{event.title}</h3>

                <div className="event-meta">
                    <span className="event-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {formatEventDate(event.date)}
                    </span>
                    <span className="event-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {formatTimeRange(event.date, event.endDate)}
                    </span>
                    <span className="event-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {event.location}
                    </span>
                </div>

                <p className="event-card-description">{event.description}</p>

                {event.registrationUrl && !isPast && (
                    <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-register-btn"
                    >
                        Register
                    </a>
                )}
            </div>
        </article>
    );
}

export default Events;

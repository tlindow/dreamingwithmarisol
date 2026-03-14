import { useMemo, useState } from 'react';
import './JourneyMockups.css';

type ConversionType = 'booking' | 'purchase' | 'waitlist' | 'none';
type JourneyFilter = 'all' | 'converted' | 'not_converted';

interface JourneySummary {
    id: string;
    steps: string[];
    sessions: number;
    convertedSessions: number;
    conversionType: ConversionType;
}

interface SessionJourney {
    id: string;
    startedAt: string;
    source: string;
    steps: string[];
    converted: boolean;
    conversionType: ConversionType;
}

const SUMMARY_DATA: JourneySummary[] = [
    {
        id: 'flow-1',
        steps: ['Home', 'Healings', 'Book Session', 'Calendly Opened'],
        sessions: 14,
        convertedSessions: 10,
        conversionType: 'booking',
    },
    {
        id: 'flow-2',
        steps: ['Home', 'Store', 'Product Detail', 'Buy Now (Stripe)'],
        sessions: 9,
        convertedSessions: 5,
        conversionType: 'purchase',
    },
    {
        id: 'flow-3',
        steps: ['Home', 'Online Healings', 'Waitlist Click'],
        sessions: 7,
        convertedSessions: 3,
        conversionType: 'waitlist',
    },
    {
        id: 'flow-4',
        steps: ['Home', 'About', 'Values', 'Exit'],
        sessions: 6,
        convertedSessions: 0,
        conversionType: 'none',
    },
];

const SESSION_DATA: SessionJourney[] = [
    {
        id: 's-001',
        startedAt: 'Mar 14, 10:12 AM',
        source: 'Instagram',
        steps: ['Home', 'Healings', 'Book Session', 'Calendly Opened'],
        converted: true,
        conversionType: 'booking',
    },
    {
        id: 's-002',
        startedAt: 'Mar 14, 9:54 AM',
        source: 'Direct',
        steps: ['Home', 'Store', 'Product Detail', 'Buy Now (Stripe)'],
        converted: true,
        conversionType: 'purchase',
    },
    {
        id: 's-003',
        startedAt: 'Mar 14, 9:40 AM',
        source: 'Google',
        steps: ['Home', 'About', 'Values', 'Exit'],
        converted: false,
        conversionType: 'none',
    },
    {
        id: 's-004',
        startedAt: 'Mar 14, 9:21 AM',
        source: 'Instagram',
        steps: ['Home', 'Online Healings', 'Waitlist Click'],
        converted: true,
        conversionType: 'waitlist',
    },
    {
        id: 's-005',
        startedAt: 'Mar 14, 8:57 AM',
        source: 'Direct',
        steps: ['Home', 'Learning', 'Module Detail', 'Exit'],
        converted: false,
        conversionType: 'none',
    },
];

function conversionLabel(type: ConversionType): string {
    if (type === 'booking') return 'Booking Intent';
    if (type === 'purchase') return 'Purchase Intent';
    if (type === 'waitlist') return 'Waitlist Intent';
    return 'No Conversion';
}

function JourneyMockups() {
    const [filter, setFilter] = useState<JourneyFilter>('all');

    const totalSessions = useMemo(
        () => SUMMARY_DATA.reduce((sum, row) => sum + row.sessions, 0),
        [],
    );

    const filteredSummaries = useMemo(() => {
        if (filter === 'converted') {
            return SUMMARY_DATA.filter((flow) => flow.convertedSessions > 0);
        }
        if (filter === 'not_converted') {
            return SUMMARY_DATA.filter((flow) => flow.convertedSessions === 0);
        }
        return SUMMARY_DATA;
    }, [filter]);

    const filteredSessions = useMemo(() => {
        if (filter === 'converted') {
            return SESSION_DATA.filter((session) => session.converted);
        }
        if (filter === 'not_converted') {
            return SESSION_DATA.filter((session) => !session.converted);
        }
        return SESSION_DATA;
    }, [filter]);

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container journey-mockups-header">
                    <p className="journey-eyebrow">Journey Insights</p>
                    <h1 className="page-title">Customer Journey Mockups</h1>
                    <p className="page-subtitle">
                        A simple PM view showing the most common paths people take before
                        they convert.
                    </p>
                    <p className="journey-disclaimer">
                        Mock data preview — this is what your eventual live dashboard could look like.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="journey-controls">
                        <button
                            className={`journey-filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Flows
                        </button>
                        <button
                            className={`journey-filter-btn ${filter === 'converted' ? 'active' : ''}`}
                            onClick={() => setFilter('converted')}
                        >
                            Converted
                        </button>
                        <button
                            className={`journey-filter-btn ${filter === 'not_converted' ? 'active' : ''}`}
                            onClick={() => setFilter('not_converted')}
                        >
                            Not Converted
                        </button>
                    </div>

                    <div className="journey-grid">
                        {filteredSummaries.map((flow, index) => {
                            const conversionRate = flow.sessions
                                ? Math.round((flow.convertedSessions / flow.sessions) * 100)
                                : 0;
                            const sessionShare = totalSessions
                                ? Math.round((flow.sessions / totalSessions) * 100)
                                : 0;

                            return (
                                <article className="journey-card" key={flow.id}>
                                    <div className="journey-card-top">
                                        <span className="journey-rank">#{index + 1} Popular Flow</span>
                                        <span className={`journey-badge ${flow.convertedSessions > 0 ? 'journey-badge--success' : ''}`}>
                                            {conversionLabel(flow.conversionType)}
                                        </span>
                                    </div>
                                    <p className="journey-path">{flow.steps.join(' → ')}</p>
                                    <div className="journey-metrics">
                                        <div className="journey-metric">
                                            <span className="journey-metric-label">Sessions</span>
                                            <strong>{flow.sessions}</strong>
                                        </div>
                                        <div className="journey-metric">
                                            <span className="journey-metric-label">Conversion</span>
                                            <strong>{conversionRate}%</strong>
                                        </div>
                                        <div className="journey-metric">
                                            <span className="journey-metric-label">Traffic Share</span>
                                            <strong>{sessionShare}%</strong>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section bg-primary-light">
                <div className="container">
                    <div className="journey-section-heading">
                        <h2>All Visitor Sessions (Low-Traffic Friendly)</h2>
                        <p>
                            Every session shown as a card so you can inspect each individual path.
                        </p>
                    </div>
                    <div className="session-grid">
                        {filteredSessions.map((session) => (
                            <article className="session-card" key={session.id}>
                                <div className="session-top">
                                    <strong>{session.id}</strong>
                                    <span className={`journey-badge ${session.converted ? 'journey-badge--success' : ''}`}>
                                        {session.converted ? conversionLabel(session.conversionType) : 'No Conversion'}
                                    </span>
                                </div>
                                <p className="session-meta">{session.startedAt} · Source: {session.source}</p>
                                <p className="session-path">{session.steps.join(' → ')}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default JourneyMockups;

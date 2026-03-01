import { useSanityQuery } from '../hooks/useSanityQuery';
import { PRICING_PAGE_QUERY } from '../lib/queries';
import { formatPrice } from '../lib/utils';
import { DEFAULT_PRICING_PAGE } from '../content/defaults';
import type { PricingPageData } from '../lib/types';

const Pricing = () => {
    const { data } = useSanityQuery<PricingPageData>(PRICING_PAGE_QUERY);

    const pageTitle = data?.pageTitle ?? DEFAULT_PRICING_PAGE.pageTitle;
    const servicesList = data?.servicesList ?? DEFAULT_PRICING_PAGE.servicesList;
    const cancellationPolicy = data?.cancellationPolicy ?? DEFAULT_PRICING_PAGE.cancellationPolicy;
    const refundsPolicy = data?.refundsPolicy ?? DEFAULT_PRICING_PAGE.refundsPolicy;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 className="page-title text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>{pageTitle}</h1>

                    <div className="prose" style={{ backgroundColor: 'var(--color-primary)', padding: 'var(--spacing-2xl)', borderRadius: 'var(--radius-lg)' }}>
                        <h2 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-secondary)' }}>Investment</h2>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--spacing-2xl)' }}>
                            {servicesList.map((item) => (
                                <li key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                                    <span>{item.name}{item.duration ? ` (${item.duration})` : ''}</span>
                                    <strong>{formatPrice(item.price)}</strong>
                                </li>
                            ))}
                        </ul>

                        <h2 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-secondary)' }}>Cancellation Policy</h2>
                        <p>{cancellationPolicy}</p>

                        <h2 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-secondary)', marginTop: 'var(--spacing-xl)' }}>Refunds</h2>
                        <p>{refundsPolicy}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;

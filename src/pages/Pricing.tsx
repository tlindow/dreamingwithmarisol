const Pricing = () => {
    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 className="page-title text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>Pricing & Policies</h1>

                    <div className="prose" style={{ backgroundColor: 'var(--color-primary)', padding: 'var(--spacing-2xl)', borderRadius: 'var(--radius-lg)' }}>
                        <h2 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-secondary)' }}>Investment</h2>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--spacing-2xl)' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                                <span>In-Person Limpia (60 Min)</span>
                                <strong>$150</strong>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                                <span>Distance Limpia & Plática (60 Min)</span>
                                <strong>$150</strong>
                            </li>
                        </ul>

                        <h2 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-secondary)' }}>Cancellation Policy</h2>
                        <p>
                            Your time is valuable, and so is mine. Please provide at least 24 hours notice for cancellations or rescheduling. Cancellations made within 24 hours of the appointment time will incur a 50% fee. No-calls/no-shows are charged the full session amount.
                        </p>

                        <h2 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-secondary)', marginTop: 'var(--spacing-xl)' }}>Refunds</h2>
                        <p>
                            All healing sessions are final sale. No refunds are provided after the service has been rendered. If you are unsatisfied, please bring it up during our plática.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;

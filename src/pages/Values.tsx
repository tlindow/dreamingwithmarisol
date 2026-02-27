import './Values.css';

const Values = () => {
    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container">
                    <div className="values-header text-center">
                        <h1 className="page-title">Core Values</h1>
                        <p className="page-subtitle">Guiding principles for healing and community support.</p>
                    </div>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">01</div>
                            <h3>Ancestral Wisdom</h3>
                            <p>Honoring and preserving traditional Mesoamerican healing practices passed down through generations. Keeping the roots alive.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">02</div>
                            <h3>Holistic Approach</h3>
                            <p>Recognizing that true wellness encompasses the mind, body, and spirit. Healing the whole person, not just the symptom.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">03</div>
                            <h3>Accessible Care</h3>
                            <p>Dedicated to providing support to the community through sliding scale options and inclusive practices whenever possible.</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">04</div>
                            <h3>Empowerment</h3>
                            <p>Guiding individuals to discover their own innate power to heal and transform their lives from within.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Values;

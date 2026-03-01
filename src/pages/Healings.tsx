import { Button } from '../components/Button';
import './Healings.css';

const Healings = () => {
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
                            <span className="price">$100</span>
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

                        <div className="booking-cta">
                            <Button size="lg" variant="primary">Book Your Session</Button>
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

import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './CheckoutSuccess.css';

const CheckoutSuccess = () => {
    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container cs-container">
                    <div className="cs-card">
                        <CheckCircle size={64} className="cs-icon" />
                        <h1 className="cs-title">Thank you for your purchase!</h1>
                        <p className="cs-message">
                            Your payment was successful. You will receive a confirmation email shortly.
                        </p>
                        <Link to="/" className="cs-back-btn">
                            Return to home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CheckoutSuccess;

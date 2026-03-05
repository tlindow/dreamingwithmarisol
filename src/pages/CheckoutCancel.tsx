import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import './CheckoutCancel.css';

const CheckoutCancel = () => {
    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container cc-container">
                    <div className="cc-card">
                        <XCircle size={64} className="cc-icon" />
                        <h1 className="cc-title">Checkout cancelled</h1>
                        <p className="cc-message">
                            Your payment was not completed. You can try again whenever you&apos;re ready.
                        </p>
                        <Link to="/" className="cc-back-btn">
                            Return to home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CheckoutCancel;

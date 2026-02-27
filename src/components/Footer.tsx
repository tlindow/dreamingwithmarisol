import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="footer section">
            <div className="container footer-container">
                <div className="footer-brand">
                    <Link to="/" className="brand-logo">Dreaming with Marisól</Link>
                    <p className="footer-subtitle">Spiritual Healing & Education</p>
                </div>

                <div className="footer-links-grid">
                    <div className="footer-col">
                        <h4 className="footer-heading">Navigate</h4>
                        <Link to="/" className="footer-link">Home</Link>
                        <Link to="/about" className="footer-link">About</Link>
                        <Link to="/values" className="footer-link">Values</Link>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Services</h4>
                        <Link to="/healings" className="footer-link">In-Person Healings</Link>
                        <Link to="/online-healings" className="footer-link">Online Healings</Link>
                        <Link to="/pricing" className="footer-link">Pricing & Policy</Link>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Connect</h4>
                        <a href="https://instagram.com/dreamingwithmarisol" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            <Instagram size={18} /> Instagram
                        </a>
                        <a href="#" className="footer-link">Newsletter (Substack)</a>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Dreaming with Marisól. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

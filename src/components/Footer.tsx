import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import { DEFAULT_SITE_SETTINGS } from '../content/defaults';
import './Footer.css';

export const Footer = () => {
    const { content } = useContent();

    const siteTitle = content.siteSettings.title ?? DEFAULT_SITE_SETTINGS.title;
    const tagline = content.siteSettings.tagline ?? DEFAULT_SITE_SETTINGS.tagline;
    const instagramUrl = content.siteSettings.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl;
    const substackUrl = content.siteSettings.substackUrl ?? null;

    return (
        <footer className="footer section">
            <div className="container footer-container">
                <div className="footer-brand">
                    <Link to="/" className="brand-logo">{siteTitle}</Link>
                    <p className="footer-subtitle">{tagline}</p>
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
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            <Instagram size={18} /> Instagram
                        </a>
                        {substackUrl ? (
                            <a href={substackUrl} target="_blank" rel="noopener noreferrer" className="footer-link">Newsletter (Substack)</a>
                        ) : (
                            <span className="footer-link" style={{ opacity: 0.5 }}>Newsletter (Coming Soon)</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

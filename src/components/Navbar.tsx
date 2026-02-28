import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import { useState } from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import './Navbar.css';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Learning', path: '/learning' },
    { name: 'Store', path: '/store' },
    { name: 'Values', path: '/values' },
    { name: 'Healings', path: '/healings' },
    { name: 'Online Healings', path: '/online-healings' },
    { name: 'Pricing', path: '/pricing' }
];

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { settings } = useSiteSettings();

    const toggleMenu = () => setIsOpen(!isOpen);
    
    const brandEmoji = settings?.emojis?.brandEmoji || "";
    const siteTitle = settings?.title || "Dreaming with Marisól";

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/" className="brand-logo">
                        {brandEmoji && <span className="brand-emoji">{brandEmoji}</span>}
                        {siteTitle}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-links desktop-only">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="navbar-social desktop-only">
                    <a href="https://instagram.com/dreamingwithmarisol" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                        <Instagram size={20} />
                    </a>
                </div>

                {/* Mobile menu button */}
                <div className="mobile-only">
                    <button onClick={toggleMenu} className="menu-button" aria-label="Toggle menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="mobile-menu animate-fade-in">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mobile-social">
                        <a href="https://instagram.com/dreamingwithmarisol" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

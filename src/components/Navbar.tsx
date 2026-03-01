import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import { useState } from 'react';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { NAV_LINKS, DEFAULT_SITE_SETTINGS } from '../content/defaults';
import type { SiteSettings } from '../lib/types';
import './Navbar.css';

const NAV_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ title, instagramUrl }`;

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { data } = useSanityQuery<Pick<SiteSettings, 'title' | 'instagramUrl'>>(NAV_SETTINGS_QUERY);

    const siteTitle = data?.title ?? DEFAULT_SITE_SETTINGS.title;
    const instagramUrl = data?.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl;

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/" className="brand-logo">{siteTitle}</Link>
                </div>

                <div className="navbar-links desktop-only">
                    {NAV_LINKS.map((link) => (
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
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                        <Instagram size={20} />
                    </a>
                </div>

                <div className="mobile-only">
                    <button onClick={toggleMenu} className="menu-button" aria-label="Toggle menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="mobile-menu animate-fade-in">
                    {NAV_LINKS.map((link) => (
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
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

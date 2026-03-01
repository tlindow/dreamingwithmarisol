import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { urlFor } from '../sanityClient';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { HOME_PAGE_QUERY } from '../lib/queries';
import { DEFAULT_HOME_PAGE } from '../content/defaults';
import type { HomePageData, SiteSettings } from '../lib/types';
import './Home.css';

interface HomeQueryResult {
    settings: Pick<SiteSettings, 'heroImage'> | null;
    page: HomePageData | null;
}

const Home = () => {
    const { data, isLoading } = useSanityQuery<HomeQueryResult>(HOME_PAGE_QUERY);

    const page = data?.page;
    const heroImage = data?.settings?.heroImage;
    const heroImageUrl = heroImage ? urlFor(heroImage).url() : null;

    const heroTitle = page?.heroTitle ?? DEFAULT_HOME_PAGE.heroTitle;
    const heroSubtitle = page?.heroSubtitle ?? DEFAULT_HOME_PAGE.heroSubtitle;
    const offeringsTitle = page?.offeringsTitle ?? DEFAULT_HOME_PAGE.offeringsTitle;
    const offeringsSubtitle = page?.offeringsSubtitle ?? DEFAULT_HOME_PAGE.offeringsSubtitle;
    const offerings = page?.offerings ?? DEFAULT_HOME_PAGE.offerings;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">{heroTitle}</h1>
                        <p className="hero-subtitle">{heroSubtitle}</p>
                        <div className="hero-actions">
                            <Link to="/healings">
                                <Button size="lg" variant="primary">Book a Session</Button>
                            </Link>
                            <Link to="/about">
                                <Button size="lg" variant="secondary">Learn More</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image-wrapper">
                        {heroImageUrl ? (
                            <img src={heroImageUrl} alt="Marisól" className="hero-image" />
                        ) : !isLoading ? (
                            <div className="image-placeholder">
                                <span className="placeholder-text">Upload Hero Image in Sanity</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>

            <section className="section bg-primary-light">
                <div className="container">
                    <div className="section-header center">
                        <h2>{offeringsTitle}</h2>
                        <p>{offeringsSubtitle}</p>
                    </div>

                    <div className="offerings-grid">
                        {offerings.map((offering) => (
                            <div className="offering-card" key={offering.title}>
                                <h3>{offering.title}</h3>
                                <p>{offering.description}</p>
                                <Link to={offering.linkPath} className="text-cta">Learn more &rarr;</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

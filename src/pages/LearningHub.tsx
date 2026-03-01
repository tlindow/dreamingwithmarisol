import './LearningHub.css';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { LEARNING_HUB_QUERY } from '../lib/queries';
import type { VideoModule } from '../lib/types';

const LearningHub = () => {
    const { data: modules, isLoading } = useSanityQuery<VideoModule[]>(LEARNING_HUB_QUERY);

    const items = modules ?? [];
    const featured = items.filter((m) => m.isFeatured);
    const rest = items.filter((m) => !m.isFeatured);

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container text-center">
                    <h1 className="page-title">Learning Hub</h1>
                    <p className="page-subtitle">
                        Ancestral wisdom teachings to deepen your practice — start learning at your own pace
                    </p>
                </div>
            </section>

            {!isLoading && featured.length > 0 && (
                <section className="section featured-section">
                    <div className="container">
                        <h2 className="featured-heading">Featured</h2>
                        <div className="modules-grid">
                            {featured.map((mod) => (
                                <Link to={`/learning/${mod._id}`} key={mod._id} className="module-card group hover:shadow-lg transition-all duration-300">
                                    <div className={`module-thumbnail ${mod.thumbnailColor || 'bg-primary'}`}>
                                        <div className="play-button group-hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm" aria-label={`Play ${mod.title}`}>
                                            <Play size={32} fill="currentColor" />
                                        </div>
                                        <span className="module-duration">{mod.duration}</span>
                                        {mod.accessTier === 'premium' && (
                                            <span className="module-tier module-tier--premium">Premium</span>
                                        )}
                                        {mod.accessTier === 'free' && (
                                            <span className="module-tier module-tier--free">Free</span>
                                        )}
                                    </div>
                                    <div className="module-content">
                                        <h3 className="module-title group-hover:text-[var(--color-primary-dark)] transition-colors">{mod.title}</h3>
                                        <p className="module-description line-clamp-3">{mod.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="section">
                <div className="container">
                    {!isLoading && featured.length > 0 && rest.length > 0 && (
                        <h2 className="all-modules-heading">All Modules</h2>
                    )}
                    <div className="modules-grid">
                        {isLoading ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-[var(--color-text-light)]">Loading modules...</p>
                            </div>
                        ) : (rest.length > 0 || featured.length === 0) ? (
                            (featured.length > 0 ? rest : items).map((mod) => (
                                <Link to={`/learning/${mod._id}`} key={mod._id} className="module-card group hover:shadow-lg transition-all duration-300">
                                    <div className={`module-thumbnail ${mod.thumbnailColor || 'bg-primary'}`}>
                                        <div className="play-button group-hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm" aria-label={`Play ${mod.title}`}>
                                            <Play size={32} fill="currentColor" />
                                        </div>
                                        <span className="module-duration">{mod.duration}</span>
                                        {mod.accessTier === 'premium' && (
                                            <span className="module-tier module-tier--premium">Premium</span>
                                        )}
                                        {mod.accessTier === 'free' && (
                                            <span className="module-tier module-tier--free">Free</span>
                                        )}
                                    </div>
                                    <div className="module-content">
                                        <h3 className="module-title group-hover:text-[var(--color-primary-dark)] transition-colors">{mod.title}</h3>
                                        <p className="module-description line-clamp-3">{mod.description}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-[var(--color-text-light)]">Check back later for upcoming ancestral wisdom teachings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LearningHub;

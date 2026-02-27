import './LearningHub.css';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient';

interface VideoModule {
    _id: string;
    title: string;
    duration: string;
    description: string;
    thumbnailColor: string;
}

const LearningHub = () => {
    const [modules, setModules] = useState<VideoModule[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                // Fetch videos basic info for the grid
                const data = await client.fetch(`
                    *[_type == "videoModule"] | order(order asc) {
                        _id,
                        title,
                        duration,
                        description,
                        thumbnailColor
                    }
                `);
                setModules(data || []);
            } catch (error) {
                console.error("Error fetching video modules from Sanity:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchModules();
    }, []);

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container text-center">
                    <h1 className="page-title">Learning Modules</h1>
                    <p className="page-subtitle">Educational videos on ancestral wisdom and practice</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="modules-grid">
                        {isLoading ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-[var(--color-text-light)]">Loading modules...</p>
                            </div>
                        ) : modules.length > 0 ? (
                            modules.map((mod) => (
                                <Link to={`/learning/${mod._id}`} key={mod._id} className="module-card group hover:shadow-lg transition-all duration-300">
                                    <div className={`module-thumbnail ${mod.thumbnailColor || 'bg-primary'}`}>
                                        <div className="play-button group-hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm" aria-label={`Play ${mod.title}`}>
                                            <Play size={32} fill="currentColor" />
                                        </div>
                                        <span className="module-duration">{mod.duration}</span>
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

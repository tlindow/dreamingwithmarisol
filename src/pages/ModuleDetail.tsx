import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
// @ts-ignore
import ReactPlayer from 'react-player';
import { client, urlFor } from '../sanityClient';
import { Button } from '../components/Button';
import './ModuleDetail.css';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    storeUrl: string;
    image: any;
}

interface VideoModule {
    _id: string;
    title: string;
    duration: string;
    description: string;
    videoUrl: string;
    thumbnailColor: string;
    products?: Product[];
}

// Bypass strict TypeScript JSX Element typing for the external ReactPlayer module
const Player = ReactPlayer as any;

const ModuleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [moduleFile, setModuleFile] = useState<VideoModule | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchModule = async () => {
            if (!id) return;
            try {
                const data = await client.fetch(`
                    *[_type == "videoModule" && _id == $id][0] {
                        _id,
                        title,
                        duration,
                        description,
                        videoUrl,
                        thumbnailColor,
                        "products": products[]->{
                            _id,
                            title,
                            description,
                            price,
                            storeUrl,
                            image
                        }
                    }
                `, { id });
                setModuleFile(data);
            } catch (error) {
                console.error("Error fetching video module detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchModule();
    }, [id]);

    if (isLoading) {
        return (
            <div className="page-wrapper animate-fade-in flex items-center justify-center min-h-[50vh]">
                <p className="text-[var(--color-text-light)]">Loading wisdom...</p>
            </div>
        );
    }

    if (!moduleFile) {
        return (
            <div className="page-wrapper animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-serif text-[var(--color-primary-dark)] mb-4">Module not found</h2>
                <Link to="/learning">
                    <Button variant="outline">Return to Learning Hub</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="bg-primary-light py-8">
                <div className="container">
                    <Link to="/learning" className="inline-flex items-center gap-2 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors mb-6">
                        <ArrowLeft size={20} /> Back to Modules
                    </Link>
                    <h1 className="text-4xl font-serif text-[var(--color-primary-dark)] mb-2">{moduleFile.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-light)]">
                        <span className="font-medium bg-[var(--color-primary)] text-white px-3 py-1 rounded-full">{moduleFile.duration}</span>
                    </div>
                </div>
            </section>

            <section className="section py-12">
                <div className="container max-w-5xl">
                    <div className="video-player-wrapper aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-8">
                        {moduleFile.videoUrl ? (
                            <Player
                                url={moduleFile.videoUrl}
                                width="100%"
                                height="100%"
                                controls={true}
                                playing={true}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <p>Video source unavailable.</p>
                            </div>
                        )}
                    </div>

                    <div className="module-content-grid grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="module-info lg:col-span-2">
                            <h2 className="text-2xl font-serif text-[var(--color-text)] mb-4 border-b border-[var(--color-primary-light)] pb-2">About this Lesson</h2>
                            <p className="text-[var(--color-text-light)] leading-relaxed whitespace-pre-wrap">
                                {moduleFile.description}
                            </p>
                        </div>

                        {moduleFile.products && moduleFile.products.length > 0 && (
                            <div className="module-kit-sidebar">
                                <div className="bg-[var(--color-primary-light)] rounded-xl p-6 shadow-sm border border-[var(--color-primary)]/20">
                                    <h3 className="text-xl font-serif text-[var(--color-primary-dark)] mb-6 text-center">Required Materials Kit</h3>
                                    <div className="flex flex-col gap-6">
                                        {moduleFile.products.map(product => (
                                            <div key={product._id} className="kit-item flex flex-col gap-3 bg-white p-4 rounded-lg shadow-sm">
                                                {product.image && (
                                                    <div className="aspect-square w-full bg-[var(--color-primary-light)] rounded-md overflow-hidden flex items-center justify-center">
                                                        <img
                                                            src={urlFor(product.image).width(400).height(400).url()}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 flex flex-col">
                                                    <h4 className="font-semibold text-[var(--color-text)] leading-tight mb-1">{product.title}</h4>
                                                    {product.price && <span className="text-[var(--color-primary-dark)] font-medium mb-2">£{product.price}</span>}
                                                    {product.description && <p className="text-sm text-[var(--color-text-light)] line-clamp-2 mb-4">{product.description}</p>}

                                                    <a href={product.storeUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
                                                        <button className="w-full py-2 px-4 bg-[var(--color-accent)] hover:bg-[#e0b02d] text-white font-medium rounded transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                                            Purchase Item <ExternalLink size={16} />
                                                        </button>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModuleDetail;

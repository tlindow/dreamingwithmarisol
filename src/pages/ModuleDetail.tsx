import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Package, Sparkles, Check } from 'lucide-react';
import ReactPlayer from 'react-player';
import { urlFor } from '../sanityClient';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { MODULE_DETAIL_QUERY } from '../lib/queries';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/Button';
import type { VideoModule } from '../lib/types';
import './ModuleDetail.css';

const Player = ReactPlayer as React.ComponentType<Record<string, unknown>>;

const ModuleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const params = useMemo(() => ({ id }), [id]);
    const { data: moduleFile, isLoading } = useSanityQuery<VideoModule>(MODULE_DETAIL_QUERY, params);

    const kitTotal = useMemo(() => {
        if (!moduleFile?.products) return 0;
        return moduleFile.products.reduce((sum, p) => sum + (p.price ?? 0), 0);
    }, [moduleFile]);

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

    const hasProducts = moduleFile.products && moduleFile.products.length > 0;
    const bundlePrice = moduleFile.kitBundleSavings ? kitTotal - moduleFile.kitBundleSavings : kitTotal;

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

                        {hasProducts && (
                            <div className="module-kit-sidebar">
                                <div className="kit-sidebar-card">
                                    {/* Kit Header */}
                                    <div className="kit-sidebar-header">
                                        <div className="kit-sidebar-badge">
                                            <Package size={16} />
                                            <span>Kit · {moduleFile.products!.length} {moduleFile.products!.length === 1 ? 'item' : 'items'}</span>
                                        </div>
                                        <h3 className="kit-sidebar-title">Required Materials Kit</h3>
                                        <div className="kit-sidebar-pricing">
                                            {moduleFile.kitBundleSavings ? (
                                                <>
                                                    <span className="kit-sidebar-price">{formatPrice(bundlePrice)}</span>
                                                    <span className="kit-sidebar-original">{formatPrice(kitTotal)}</span>
                                                </>
                                            ) : (
                                                <span className="kit-sidebar-price">{formatPrice(kitTotal)} total</span>
                                            )}
                                        </div>
                                        {moduleFile.kitBundleSavings && (
                                            <div className="kit-sidebar-savings">
                                                <Sparkles size={14} />
                                                <span>Save {formatPrice(moduleFile.kitBundleSavings)} buying as a kit</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bundle CTA */}
                                    {moduleFile.kitBundleUrl && (
                                        <div className="kit-sidebar-bundle-cta">
                                            <a href={moduleFile.kitBundleUrl} target="_blank" rel="noopener noreferrer">
                                                <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                                                    Buy Complete Kit <ExternalLink size={16} />
                                                </Button>
                                            </a>
                                        </div>
                                    )}

                                    {/* Kit Items */}
                                    <div className="kit-sidebar-items">
                                        {moduleFile.products!.map(product => (
                                            <div key={product._id} className="kit-sidebar-item">
                                                <div className="kit-sidebar-item-visual">
                                                    {product.image && (
                                                        <img
                                                            src={urlFor(product.image).width(200).height(200).url()}
                                                            alt={product.title}
                                                        />
                                                    )}
                                                    <div className="kit-sidebar-item-check">
                                                        <Check size={12} />
                                                    </div>
                                                </div>
                                                <div className="kit-sidebar-item-details">
                                                    <h4>{product.title}</h4>
                                                    {product.price && <span className="kit-sidebar-item-price">{formatPrice(product.price)}</span>}
                                                    {product.description && <p>{product.description}</p>}
                                                </div>
                                                <a href={product.storeUrl} target="_blank" rel="noopener noreferrer" className="kit-sidebar-item-buy">
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom CTA for kits without a bundle URL */}
                                    {!moduleFile.kitBundleUrl && (
                                        <div className="kit-sidebar-bottom-hint">
                                            <p>Get all materials to follow along with this lesson</p>
                                        </div>
                                    )}
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

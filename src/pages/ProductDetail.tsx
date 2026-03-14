import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Download, Check, ShieldCheck, Zap } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import { formatPrice } from '../lib/utils';
import './ProductDetail.css';

const CATEGORY_LABELS: Record<string, string> = {
    digital: 'Digital Download',
    physical: 'Handcrafted',
    bundle: 'Bundle',
};

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { content } = useContent();
    const product = useMemo(() => content.products.find((item) => item._id === id), [content.products, id]);
    const isLoading = false;
    const [activeImage, setActiveImage] = useState(0);

    if (isLoading) {
        return (
            <div className="page-wrapper animate-fade-in">
                <section className="section bg-primary-light">
                    <div className="container pd-loading">
                        <p>Loading product details...</p>
                    </div>
                </section>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-wrapper animate-fade-in">
                <section className="section bg-primary-light">
                    <div className="container pd-not-found">
                        <h2>Product not found</h2>
                        <Link to="/store" className="pd-back-link">
                            &larr; Back to Store
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    const cleanCategory = product.category;
    const categoryLabel = cleanCategory ? CATEGORY_LABELS[cleanCategory] : 'Curated Pick';
    const isDigital = cleanCategory === 'digital';
    const purchaseUrl = product.stripePaymentLink || product.storeUrl;

    const allImages: { src: string; alt: string }[] = [];
    if (product.imageUrl) {
        allImages.push({ src: product.imageUrl, alt: product.title });
    }
    if (product.gallery) {
        product.gallery.forEach((img, i) => {
            allImages.push({ src: img, alt: `${product.title} — view ${i + 2}` });
        });
    }

    const mainImageSrc = allImages[activeImage]?.src ?? null;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container">
                    <Link to="/store" className="pd-back-link">
                        <ArrowLeft size={17} />
                        Back to Store
                    </Link>

                    <div className="pd-layout">
                        {/* ── Left column: images ── */}
                        <div className="pd-images">
                            <div className="pd-main-image-wrap">
                                {mainImageSrc ? (
                                    <img src={mainImageSrc} alt={product.title} className="pd-main-image" />
                                ) : (
                                    <div className="pd-main-image-placeholder">
                                        <ShoppingBag size={64} />
                                    </div>
                                )}
                                <span className="pd-badge">{categoryLabel}</span>
                            </div>

                            {allImages.length > 1 && (
                                <div className="pd-thumbnails">
                                    {allImages.map((img, i) => (
                                        <button
                                            key={i}
                                            className={`pd-thumb${i === activeImage ? ' pd-thumb--active' : ''}`}
                                            onClick={() => setActiveImage(i)}
                                            aria-label={`View image ${i + 1}`}
                                        >
                                            <img src={img.src} alt={img.alt} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Right column: info + purchase ── */}
                        <div className="pd-info">
                            <h1 className="pd-title">{product.title}</h1>

                            {product.price != null && (
                                <div className="pd-price">{formatPrice(product.price)}</div>
                            )}

                            {product.description && (
                                <p className="pd-short-desc">{product.description}</p>
                            )}

                            {/* Digital product instant delivery banner */}
                            {isDigital && (
                                <div className="pd-digital-badge">
                                    <Zap size={16} />
                                    <span>Instant digital delivery — download immediately after purchase</span>
                                </div>
                            )}

                            {/* Features list */}
                            {product.features && product.features.length > 0 && (
                                <div className="pd-features">
                                    <h3 className="pd-features-title">
                                        {isDigital ? "What's included" : "Details"}
                                    </h3>
                                    <ul className="pd-features-list">
                                        {product.features.map((feat, i) => (
                                            <li key={i} className="pd-features-item">
                                                <Check size={15} className="pd-features-icon" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Purchase card */}
                            <div className="pd-purchase-card">
                                {purchaseUrl ? (
                                    <a
                                        href={purchaseUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pd-buy-btn"
                                    >
                                        {isDigital ? (
                                            <>
                                                <Download size={20} />
                                                {product.price != null ? `Buy Now — ${formatPrice(product.price)}` : 'Buy Now'}
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag size={20} />
                                                {product.price != null ? `Shop Now — ${formatPrice(product.price)}` : 'Shop Now'}
                                            </>
                                        )}
                                    </a>
                                ) : (
                                    <span className="pd-coming-soon">Available soon</span>
                                )}

                                <p className="pd-secure-note">
                                    <ShieldCheck size={14} />
                                    {product.stripePaymentLink
                                        ? 'Secure checkout powered by Stripe'
                                        : 'Secure external checkout'}
                                </p>

                                {isDigital && (
                                    <p className="pd-digital-note">
                                        Digital products are non-refundable once downloaded.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Full description below the fold ── */}
                    {product.body && product.body.length > 0 && (
                        <div className="pd-body-section">
                            <h2 className="pd-body-heading">About this product</h2>
                            <div className="pd-body-content">
                                {product.body.split('\n').filter(Boolean).map((paragraph, index) => (
                                    <p key={index} className="pd-body-p">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;

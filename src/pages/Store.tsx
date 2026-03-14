import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Download, ArrowRight } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import './Store.css';

const CATEGORY_LABELS: Record<string, string> = {
    digital: 'Digital Download',
    physical: 'Handcrafted',
    bundle: 'Bundle',
};

const formatProductPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const Store = () => {
    const { content } = useContent();
    const items = content.products ?? [];
    const isLoading = false;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container text-center">
                    <h1 className="page-title">Apothecary & Supplies</h1>
                    <p className="page-subtitle">Curated materials for your spiritual practice</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <div className="product-grid">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="product-card-skeleton" />
                            ))}
                        </div>
                    ) : items.length > 0 ? (
                        <div className="product-grid">
                            {items.map((product) => {
                                const cleanCategory = product.category;
                                const categoryLabel = cleanCategory
                                    ? CATEGORY_LABELS[cleanCategory]
                                    : 'Curated Pick';
                                const isDigital = cleanCategory === 'digital';

                                return (
                                    <Link
                                        key={product._id}
                                        to={`/store/${product._id}`}
                                        className="product-card"
                                    >
                                        <div className="product-card__image-wrap">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="product-card__image"
                                                />
                                            ) : (
                                                <div className="product-card__image-placeholder">
                                                    <ShoppingBag size={48} />
                                                </div>
                                            )}
                                            <span className={`product-card__badge${isDigital ? ' product-card__badge--digital' : ''}`}>
                                                {categoryLabel}
                                            </span>
                                            {isDigital && (
                                                <span className="product-card__digital-icon" title="Instant digital download">
                                                    <Download size={15} />
                                                </span>
                                            )}
                                        </div>

                                        <div className="product-card__body">
                                            <h3 className="product-card__title">{product.title}</h3>

                                            <div className="product-card__rating">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={13} fill="var(--color-accent)" color="var(--color-accent)" />
                                                ))}
                                                <span className="product-card__rating-label">Curated pick</span>
                                            </div>

                                            {product.price && (
                                                <div className="product-card__price">
                                                    {formatProductPrice(product.price)}
                                                </div>
                                            )}

                                            {product.description && (
                                                <p className="product-card__desc">{product.description}</p>
                                            )}

                                            <div className={`product-card__cta${isDigital ? ' product-card__cta--digital' : ''}`}>
                                                {isDigital ? (
                                                    <>
                                                        <Download size={16} />
                                                        Get Instant Access
                                                    </>
                                                ) : (
                                                    <>
                                                        <ArrowRight size={16} />
                                                        View Details
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p style={{ color: 'var(--color-text-light)' }}>
                                The apothecary is currently empty. Check back soon for new artifacts.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Store;

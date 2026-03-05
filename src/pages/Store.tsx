import { ShoppingCart, ShoppingBag, Star } from 'lucide-react';
import { urlFor } from '../sanityClient';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { STORE_QUERY } from '../lib/queries';
import type { Product } from '../lib/types';
import './Store.css';

const formatProductPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const Store = () => {
    const { data: products, isLoading } = useSanityQuery<Product[]>(STORE_QUERY);

    const items = products ?? [];

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
                            {items.map((product) => (
                                <a
                                    key={product._id}
                                    href={product.storeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="product-card"
                                >
                                    <div className="product-card__image-wrap">
                                        {product.image ? (
                                            <img
                                                src={urlFor(product.image).width(500).height(500).url()}
                                                alt={product.title}
                                                className="product-card__image"
                                            />
                                        ) : (
                                            <div className="product-card__image-placeholder">
                                                <ShoppingBag size={48} />
                                            </div>
                                        )}
                                        <span className="product-card__badge">Handcrafted</span>
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

                                        <div className="product-card__cta">
                                            <ShoppingCart size={16} />
                                            Shop Now
                                        </div>
                                    </div>
                                </a>
                            ))}
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
